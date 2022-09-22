// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface APIResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface APIResponseError {
  status: string;
  message: string;
}
