import { OAUTH_PROVIDERS, OAuthProviderKey } from "../config/oauthProviders";

interface OAuthButtonProps {
    provider: OAuthProviderKey;
    baseUrl: string;
    useThemedIcons?: boolean;
    iconOnly?: boolean;
}

export const OAuthButton = ({
    provider,
    baseUrl,
    useThemedIcons = false,
    iconOnly = false,
}: OAuthButtonProps) => {
    const { icon: ColoredIcon, label } = OAUTH_PROVIDERS[provider];
    const Icon = useThemedIcons && OAUTH_PROVIDERS[provider].themedIcon
        ? OAUTH_PROVIDERS[provider].themedIcon
        : OAUTH_PROVIDERS[provider].icon;


    const handleOAuth = () => {
        window.location.href = `${baseUrl}/auth/oauth/${provider}`;
    };

    return (
        <button
            onClick={handleOAuth}
            className={`flex items-center justify-center ${iconOnly ? "w-10 h-10" : "w-full p-2"
                } border border-gray-300 rounded hover:bg-gray-100 transition-all`}
            title={label}
        >
            <Icon className={`text-xl ${iconOnly ? "text-sloth-green" : "mr-2 text-sloth-green"}`} />
            {!iconOnly && `Continue with ${label}`}
        </button>
    );
};
