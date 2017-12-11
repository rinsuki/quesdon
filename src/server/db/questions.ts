import * as mongoose from "mongoose"
import { IUser } from "./index";
import { IBottle } from "./bottles";

var schema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "users"},
    question: {type: String, required: true},
    answer: String,
    answeredAt: Date,
    bottle: {type: mongoose.Schema.Types.ObjectId, ref: "bottles"}
}, {
    timestamps: true
})

export interface IQuestion extends mongoose.Document {
    user: IUser | mongoose.Types.ObjectId
    question: string
    answer: string | null
    answeredAt: Date | null
    bottle: IBottle | mongoose.Types.ObjectId | null
}

export default mongoose.model("questions", schema) as mongoose.Model<IQuestion>