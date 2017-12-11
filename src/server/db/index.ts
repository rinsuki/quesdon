import * as mongoose from "mongoose"
import { MONGODB_URL } from "../config";

mongoose.connect(MONGODB_URL).catch(e => {
    console.error("MongoDB Error: "+e.message)
    process.exit(1)
})

import MastodonApp, {IMastodonApp} from "./apps"
import User, {IUser} from "./users"
import Question, {IQuestion} from "./questions"
import Bottle, {IBottle} from "./bottles"

export {
    MastodonApp, IMastodonApp,
    User, IUser,
    Question, IQuestion,
    Bottle, IBottle
}