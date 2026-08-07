export class LlmRateLimitError extends Error {}
export class LlmTimeoutError extends Error {}
export class LlmEmptyResponseError extends Error {}
export class LlmRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
