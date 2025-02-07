import { jwtVerify } from "jose";

interface UserJwtPayLoad {
    jti: string;
    iat: number;
}

export const getJwtSecretKey = () => {
    const secret = process.env.SECRET_KEY;

    if(!secret || secret.length === 0) {
        throw new Error("The environment variable SECRET_KEY is not set.")
    }

    return secret;
}

export const verifyAuth = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()));
        return verified.payload as UserJwtPayLoad;
    }
    catch(error) {

    }
}