import { CardWrapper } from "./card-wrapper"

export const LoginForm = () => {
    return (
        <div>
            <CardWrapper header="Login" backButtonLabel="Don't have an account" backButtonHref="auth/register" showSocial>
                Login
            </CardWrapper>
        </div>
    )
}