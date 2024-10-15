import { User } from "../schemas/user.schema";

export class UserInfo {
    id: string;
    name: string;
    email: string;
    role: string;

    static fromEntity(user: User): UserInfo {
        return {
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role
        } as UserInfo
    }
}