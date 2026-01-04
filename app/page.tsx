import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "충북대학교 통합 공지사항",
  description: "충북대학교의 다양한 공지사항을 한 곳에서 확인하세요.",
  openGraph: {
    title: "충북대학교 통합 공지사항",
    description: "충북대학교의 다양한 공지사항을 한 곳에서 확인하세요.",
    images: ["/thumbnail.webp"],
  },
};

export default function Page() {
  // TODO: 임시로 공지사항 페이지로 리다이렉트
  redirect("/notices");
}
