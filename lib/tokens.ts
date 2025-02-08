import { v4 as uuidv4 } from "uuid";
import { getVerificationByEmail } from "./verification-token";
import verificationToken from "./models/verificationToken";

export const GenerateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationByEmail(email);

    if(existingToken) {
        await verificationToken.deleteOne({ email });
    }

    const VerificationToken = await verificationToken.create({ email, token, expires });

    return VerificationToken;
}