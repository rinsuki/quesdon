import { APIUser } from "../api-interfaces";

const w = <any>window

export const me: APIUser | undefined = w.USER
export const csrfToken: string = w.CSRFTOKEN