import jwt, { JwtPayload } from "jsonwebtoken";

export default {
    verifyAndRead(token: string): JwtPayload {
        return <JwtPayload>jwt.verify(token, <string>process.env.JWT_SECRET);
    },

    hasRoles(token: string, roles: string[]): boolean {
        try {
            const payload = this.verifyAndRead(token);

            if (!payload.role || roles.indexOf(payload.role) == -1) {
                return false;
            }

            return true;
        }
        catch {
            return false;
        }
    }
}