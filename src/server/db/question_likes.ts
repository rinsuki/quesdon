import * as mongoose from "mongoose"
import { IQuestion, IUser } from "./index"

const schema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "users"},
    question: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "questions"},
}, {
    timestamps: true,
})

export interface IQuestionLike extends mongoose.Document {
    user: IUser | mongoose.Types.ObjectId
    question: IQuestion | mongoose.Types.ObjectId
}

export default mongoose.model("question_likes", schema) as mongoose.Model<IQuestionLike>
