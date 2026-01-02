import { redirect } from "next/navigation";

export default function Page() {
  // TODO: 임시로 공지사항 페이지로 리다이렉트
  redirect("/notices");
}
