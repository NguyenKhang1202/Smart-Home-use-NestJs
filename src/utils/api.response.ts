export default function apiResponse({
  status,
  message,
  data,
}: ApiResponse): ApiResponse {
  return {
    status,
    message,
    data,
  };
}
