/**
 * The payload model of an API response.
 */
export interface ApiResponsePayload {
  /**
   * The message.
   */
  message: string;

  /**
   * Optional. Message details.
   */
  details?: string;
}
