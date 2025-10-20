export const CLEAN_UTILS = {
  // HTML 콘텐츠 정리 함수
  cleanHtmlContent(htmlString: string): string {
    if (!htmlString) return "";
    return htmlString
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();
  },
};
