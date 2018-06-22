import * as mongoose from "mongoose"
import { IUser } from "./index"
// tslint:disable-next-line:no-var-requires
const autopopulate = require("mongoose-autopopulate") // @types/がないのでしかたない

const schema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "users", autopopulate: true},
    question: {type: String, required: true},
    answer: String,
    answeredAt: Date,
    isDeleted: {type: Boolean, default: false},
    likesCount: {type: Number, default: 0},
    isNSFW: {type: Boolean, default: false},
    questionUser: {type: mongoose.Schema.Types.ObjectId, ref: "users", autopopulate: true},
}, {
    timestamps: true,
})
schema.plugin(autopopulate)

export interface IQuestion extends mongoose.Document {
    user: IUser
    question: string
    answer: string | null
    answeredAt: Date | null
    isDeleted: boolean
    likesCount: number
    isNSFW: boolean
    questionUser: IUser
}

export default mongoose.model("questions", schema) as mongoose.Model<IQuestion>
