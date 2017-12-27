import * as mongoose from "mongoose"
import { IUser } from "./index";
const autopopulate = require("mongoose-autopopulate") // @types/がないのでしかたない

var schema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "users", autopopulate: true},
    question: {type: String, required: true},
    answer: String,
    answeredAt: Date,
    isDeleted: {type: Boolean, default: false},
    likesCount: {type: Number, default: 0},
    isNSFW: {type: Boolean, default: false},
    questionUser: {type: mongoose.Schema.Types.ObjectId, ref: "users", autopopulate: true},
}, {
    timestamps: true
})
schema.plugin(autopopulate)

export interface IQuestion extends mongoose.Document {
    user: IUser
    question: string
    answer: string | null
    answeredAt: Date | null
    isDeleted: Boolean
    likesCount: Number
    isNSFW: Boolean
    questionUser: IUser
}

export default mongoose.model("questions", schema) as mongoose.Model<IQuestion>