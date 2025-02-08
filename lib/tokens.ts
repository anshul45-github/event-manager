import { v4 as uuidv4 } from "uuid";

import verificationToken from "./models/verificationToken";
import PasswordResetToken from "./models/passwordResetToken";

import { getVerificationByEmail } from "./verification-token";
import { getPasswordResetTokenByEmail } from "./password-reset-token";

export const GeneratePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if(existingToken) {
        await PasswordResetToken.deleteOne({ email });
    }

    const passwordResetToken = await PasswordResetToken.create({ email, token, expires });

    return passwordResetToken;
}

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