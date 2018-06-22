import * as mongoose from "mongoose"

const schema = new mongoose.Schema({
    hostName: {type: String, required: true},
    clientId: {type: String, required: true},
    clientSecret: {type: String, required: true},
    appBaseUrl: {type: String, required: true},
    redirectUri: {type: String, required: true},
}, {
    timestamps: true,
})

export interface IMastodonApp extends mongoose.Document {
    hostName: string
    clientId: string
    clientSecret: string
    appBaseUrl: string
    redirectUri: string
}

export default mongoose.model("mastodon_apps", schema) as mongoose.Model<IMastodonApp>
