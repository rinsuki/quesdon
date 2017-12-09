import * as mongoose from "mongoose"
export default (schema: mongoose.Schema, transformer: (doc: any, ret: any) => any) => {
    if ((<any>schema).options.toObject == undefined) {
        (<any>schema).options.toObject = {}
    }
    if ((<any>schema).options.toJSON == undefined) {
        (<any>schema).options.toJSON = {}
    }
    (<any>schema).options.toObject.transform = transformer;
    (<any>schema).options.toJSON.transform = transformer
}