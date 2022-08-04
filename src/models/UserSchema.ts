import { model, Schema, SchemaTypes } from "mongoose";
import { UserInfo } from "../interfaces/UserInfo";

const UserSchema = new Schema<UserInfo>({
    id: {
        type: SchemaTypes.String,
        required: true,
        unique: true,
    },
    fullName: {
        type: SchemaTypes.String,
        required: true,
    },
    age: {
        type: SchemaTypes.Number,
        required: true,
    },
    address: {
        type: SchemaTypes.String,
        required: true,
    },
    email: {
        type: SchemaTypes.String,
        required: true,
    },
});

export const UserModel = model<UserInfo>("UserConfig", UserSchema);
