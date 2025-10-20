export interface INoticeRowData {
  noticeId: string;
  createdAt: string;
  noticeGroup: string;
  title: string;
  category: string;
  body: string;
  imageUrls: string;
  tables: string;
}

export interface IApiResponse {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  data: INoticeRowData[];
}

export interface IInfiniteNoticesData {
  pages: IApiResponse[];
  pageParams: number[];
}
