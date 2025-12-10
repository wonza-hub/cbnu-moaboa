import { NextRequest, NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { INoticeRowData } from "@/entities/notice/types/notice";

// Google 서비스 계정 인증 설정
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: (process.env.GOOGLE_PRIVATE_KEY as string).replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// 기본 스프레드시트 ID와 시트 매핑
const SPREADSHEETS = {
  "sw-major": {
    id: process.env.GOOGLE_SPREADSHEET_ID,
    title: "sw_major",
  },
  cieat: {
    id: process.env.GOOGLE_SPREADSHEET_ID,
    title: "cieat",
  },
  // 필요한 다른 공지사항 그룹 추가
};

// 캐시 설정 (30분)
export const revalidate = 1800;

/**
 * GET 요청 처리 - 단일 공지사항 조회
 * 파라미터:
 * - id: 공지사항 ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: noticeId } = await params;

  if (!noticeId) {
    return NextResponse.json(
      { error: "공지사항 ID가 필요합니다." },
      { status: 400 },
    );
  }

  try {
    // 모든 스프레드시트에서 해당 ID를 가진 공지사항 찾기
    for (const [groupKey, sheetInfo] of Object.entries(SPREADSHEETS)) {
      const { id: SPREADSHEET_ID, title: SHEET_TITLE } = sheetInfo;
      const doc = new GoogleSpreadsheet(
        SPREADSHEET_ID as string,
        serviceAccountAuth,
      );

      try {
        // 스프레드시트 정보 로드
        await doc.loadInfo();

        // 시트 가져오기
        const sheet = doc.sheetsByTitle[SHEET_TITLE];
        if (!sheet) {
          console.warn(`시트를 찾을 수 없습니다: ${SHEET_TITLE}`);
          continue;
        }

        // 시트의 모든 행 데이터 가져오기
        const rows = await sheet.getRows<INoticeRowData>();

        // ID로 공지사항 찾기
        const notice = rows.find((row) => row.get("noticeId") === noticeId);

        // 공지사항을 찾았을 때 반환
        if (notice) {
          const imageUrlsJSON = notice.get("imageUrls");
          const imageUrls: string[] = imageUrlsJSON
            ? JSON.parse(imageUrlsJSON)
            : [];

          const noticeData: INoticeRowData = {
            noticeId: notice.get("noticeId"),
            createdAt: notice.get("createdAt"),
            noticeGroup: groupKey, // 실제 그룹 이름 사용
            title: notice.get("title"),
            category: notice.get("category"),
            body: notice.get("body"),
            imageUrls,
            tables: notice.get("tables"),
          };

          // CORS 헤더 설정
          const headers = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          });

          return NextResponse.json(noticeData, {
            status: 200,
            headers,
          });
        }
      } catch (error) {
        console.error(`${groupKey} 그룹 데이터 조회 중 오류:`, error);
        continue;
      }
    }

    // 모든 스프레드시트를 검색했지만 공지사항을 찾지 못한 경우
    return NextResponse.json(
      { error: "해당 ID의 공지사항을 찾을 수 없습니다." },
      { status: 404 },
    );
  } catch (error) {
    console.error("공지사항 상세 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "알 수 없는 오류" },
      { status: 500 },
    );
  }
}

// OPTIONS 메서드 추가 (CORS preflight 요청 처리)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  );
}
