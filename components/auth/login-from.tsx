import { CardWrapper } from "@/components/auth/card-wrapper";

export const LoginForm = () => {
    return (

        <CardWrapper
        headerLabel="Welcome back"
        backButtonHref="/auth/register"
        backButtonLabel="Don't have an account?"
        showSocial
        >
            LoginForm !
        </CardWrapper>
    )
}