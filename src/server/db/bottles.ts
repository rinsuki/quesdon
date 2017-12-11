import * as mongoose from "mongoose"
import { IUser, IQuestion } from "./index";

var schema = new mongoose.Schema({
    question: {type: String, required: true},
    answers: [{type: mongoose.Schema.Types.ObjectId, ref: "questions"}],
    usedCount: {type: Number, default: 0},
}, {
    timestamps: true
})

export interface IBottle extends mongoose.Document {
    question: string
    answers: Array<IQuestion | mongoose.Types.ObjectId>
    usedCount: number
}

export default mongoose.model("bottles", schema) as mongoose.Model<IBottle>