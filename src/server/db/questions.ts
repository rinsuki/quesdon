import * as mongoose from "mongoose"
import setTransformer from "../utils/setTransformer"
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
schema.index({
    answeredAt: -1,
})
schema.plugin(autopopulate)

setTransformer(schema, (doc: IQuestion, ret: any) => {
    if (ret.questionUser && ret.questionUser.hostName === "twitter.com") {
        delete ret.questionUser
    }
    return ret
})

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
