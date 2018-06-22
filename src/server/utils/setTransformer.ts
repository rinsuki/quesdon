import * as mongoose from "mongoose"
export default (schema: mongoose.Schema, transformer: (doc: any, ret: any) => any) => {
    if ((schema as any).options.toObject == null) {
        (schema as any).options.toObject = {}
    }
    if ((schema as any).options.toJSON == null) {
        (schema as any).options.toJSON = {}
    }
    (schema as any).options.toObject.transform = transformer;
    (schema as any).options.toJSON.transform = transformer
}
