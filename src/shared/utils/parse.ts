export const PARSE_UTILS = {
  // HTML 문자열을 안전하게 렌더링
  renderSafeHTML(htmlContent: string): { __html: string } {
    return { __html: htmlContent };
  },
};
