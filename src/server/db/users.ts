import * as mongoose from "mongoose"
import { IMastodonApp } from "./";
import setTransformer from "../utils/setTransformer"

var schema = new mongoose.Schema({
    acct: {type: String, required: true},
    acctLower: {type: String, required: true, unique: true},
    app: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "mastodon_apps"},
    name: {type: String, required: true},
    avatarUrl: {type: String, required: true},
    accessToken: {type: String, required: true},
    url: {type: String},
    description: {type: String, default: ""},
    questionBoxName: {type: String, default: "質問箱"},
    pushbulletAccessToken: {type: String},
    allAnon: {type: Boolean, default: false},
}, {
    timestamps: true
})

setTransformer(schema, (doc: IUser, ret: any) => {
    ret.hostName = ret.acctLower.split("@").reverse()[0]
    delete ret.app
    delete ret.accessToken
    delete ret.acctLower
    delete ret.pushbulletAccessToken
    ret.pushbulletEnabled = !!doc.pushbulletAccessToken
    return ret
})

export interface IUser extends mongoose.Document {
    acct: string
    acctLower: string
    app: IMastodonApp | mongoose.Types.ObjectId
    name: string
    avatarUrl: string
    accessToken: string
    url: string | null
    description: string
    questionBoxName: string
    pushbulletAccessToken: string | null
    allAnon: boolean
}

export default mongoose.model("users", schema) as mongoose.Model<IUser>