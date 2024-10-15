import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role } from "../enums/role.enum";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    get id() {
        return this.id
    }

    @Prop()
    email: string;

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop({ enum: Role })
    role: Role;

}

export const UserSchema = SchemaFactory.createForClass(User);