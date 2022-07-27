export interface ResponseBody<T = undefined> {
  success: boolean
  data?: T
  reason?: string
}
