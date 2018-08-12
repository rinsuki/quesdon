import * as mongoose from "mongoose"
import { MONGODB_URL } from "../config"

mongoose.connect(MONGODB_URL).catch((e) => {
    console.error("MongoDB Error: " + e.message)
    process.exit(1)
})

import MastodonApp, {IMastodonApp} from "./apps"
import QuestionLike, {IQuestionLike} from "./question_likes"
import QuestionLog, { IQuestionLog } from "./question_logs"
import Question, {IQuestion} from "./questions"
import User, {IUser} from "./users"

export {
    MastodonApp, IMastodonApp,
    User, IUser,
    Question, IQuestion,
    QuestionLike, IQuestionLike,
    QuestionLog, IQuestionLog,
}
