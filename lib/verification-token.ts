import verificationToken from "./models/verificationToken";

export const getVerificationByToken = async (token: string) => {
    try {
        const VerificationToken = await verificationToken.findOne({ token });
        return VerificationToken;
    }
    catch {
        return null;
    }
}

export const getVerificationByEmail = async (email: string) => {
    try {
        const VerificationToken = await verificationToken.findOne({ email });
        return VerificationToken;
    }
    catch {
        return null;
    }
}