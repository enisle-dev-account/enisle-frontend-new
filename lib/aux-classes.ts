export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(data?.message || data?.detail || "An API error occurred");
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}