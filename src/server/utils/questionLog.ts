import * as mongoose from "mongoose"
import { IQuestion, QuestionLog } from "../db"

export async function questionLogger(ctx: {headers: any, session: any}, question: IQuestion, type: string) {
    const userId = ctx.session!.user as string | null
    const log = new QuestionLog()
    for (const name of ["cookie", "x-csrf-token"]) {
        if (name in ctx.headers) delete ctx.headers[name]
    }
    log.type = type
    log.question = question
    log.headers = ctx.headers
    if (userId) log.loggedInUser = mongoose.Types.ObjectId(userId)
    await log.save()
}
