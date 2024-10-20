import { jwtDecode, JwtPayload } from "jwt-decode";

export const getExpDate = (token: string) => {
    const decodedToken = jwtDecode<JwtPayload>(token || "");
    const decodedJson = JSON.parse(JSON.stringify(decodedToken));
    const exp = decodedJson.exp * 1000;
    return exp;
};
