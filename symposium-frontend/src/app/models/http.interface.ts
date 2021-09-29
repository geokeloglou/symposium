export interface ApiResponse  {
  data?: any[] | null;
  message?: string;
  success: boolean;
}

export interface ErrorResponse {
  error: ApiResponse;
  status: number;
}
