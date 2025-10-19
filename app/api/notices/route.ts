import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import { NoticeRowData } from "@/types/notice";

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
 * GET 요청 처리
 * 쿼리 파라미터:
 * - noticeGroup: 공지사항 종류 (sw-major, cieat 등)
 * - page: 페이지 번호 (기본값 1)
 * - limit: 페이지당 항목 수 (기본값 10)
 */
export async function GET(request: NextRequest) {
  // 쿼리 파라미터 추출
  const searchParams = request.nextUrl.searchParams;
  const noticeGroupParam = searchParams.get("noticeGroup");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // 요청된 공지사항 그룹들 처리
  // 쉼표로 구분된 문자열을 배열로 변환하거나, 없으면 모든 그룹 사용
  const requestedGroups = noticeGroupParam
    ? noticeGroupParam.split(",").map((g) => g.trim())
    : Object.keys(SPREADSHEETS);

  // 모든 그룹의 데이터를 병합할 배열
  let allData: NoticeRowData[] = [];

  try {
    // 각 공지사항 그룹별로 데이터 수집
    const fetchPromises = requestedGroups.map(async (group) => {
      // 요청된 공지사항 그룹 정보 확인
      const spreadsheetInfo = SPREADSHEETS[group as keyof typeof SPREADSHEETS];
      if (!spreadsheetInfo) {
        console.warn(`지원하지 않는 공지사항 그룹 무시: ${group}`);
        return [];
      }

      const { id: SPREADSHEET_ID, title: SHEET_TITLE } = spreadsheetInfo;
      const doc = new GoogleSpreadsheet(
        SPREADSHEET_ID as string,
        serviceAccountAuth
      );

      try {
        // 스프레드시트 정보 로드
        await doc.loadInfo();

        // 시트 가져오기
        const sheet = doc.sheetsByTitle[SHEET_TITLE];
        if (!sheet) {
          console.warn(`시트를 찾을 수 없습니다: ${SHEET_TITLE}`);
          return [];
        }

        // 시트의 모든 행 데이터 가져오기
        const rows = await sheet.getRows<NoticeRowData>();

        // 데이터 변환 및 그룹 정보 추가
        return rows.map((row) => ({
          noticeId: row.get("noticeId"),
          createdAt: row.get("createdAt"),
          noticeGroup: group, // 실제 그룹 이름 사용
          title: row.get("title"),
          category: row.get("category"),
          body: row.get("body"),
          imageUrls: row.get("imageUrls"),
          tables: row.get("tables"),
        }));
      } catch (error) {
        console.error(`${group} 그룹 데이터 조회 중 오류:`, error);
        return [];
      }
    });

    // 모든 그룹의 데이터를 병합 (TODO: Promise.allSettled로 수정 필요)
    const groupResults = await Promise.all(fetchPromises);
    allData = groupResults.flat();

    // 날짜 기준으로 내림차순 정렬 (최신순)
    allData.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    // 페이지네이션 처리
    const totalRows = allData.length;
    const totalPages = Math.ceil(totalRows / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = allData.slice(startIndex, startIndex + limit);

    // CORS 헤더 설정
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    // 응답 반환
    return NextResponse.json(
      {
        currentPage: page,
        totalPages,
        totalRows,
        data: paginatedData,
      },
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error("공지사항 데이터 조회 중 오류 발생:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "알 수 없는 오류" },
      { status: 500 }
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
    }
  );
}
