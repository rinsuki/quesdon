import * as mongoose from "mongoose"
import { IQuestion, IUser } from "."

const schema = new mongoose.Schema({
    question: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "questions"},
    type: String,
    headers: {},
    loggedInUser: {type: mongoose.Schema.Types.ObjectId, ref: "users", autopopulate: true},
}, {
    timestamps: true,
})

export interface IQuestionLog extends mongoose.Document {
    question: IQuestion | mongoose.Types.ObjectId
    type: string
    headers: {[key: string]: string}
    loggedInUser?: IUser | mongoose.Types.ObjectId
}

export default mongoose.model<IQuestionLog>("question_logs", schema)
