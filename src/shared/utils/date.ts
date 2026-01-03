export const DATE_UTILS = {
  // 날짜 포맷팅 함수
  formatDate(dateString: string): string {
    if (!dateString) return "";

    try {
      const normalizedDate = dateString.replace(/\./g, "-");
      const date = new Date(normalizedDate);

      // 날짜가 유효하지 않은 경우 원본 반환
      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  },
};
