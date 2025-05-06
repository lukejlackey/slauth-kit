import {
    FaGoogle,
    FaGithub,
    FaDiscord,
    FaMicrosoft,
    FaFacebook,
    FaTwitter,
    FaApple,
    FaGitlab,
    FaLinkedin,
    FaReddit,
    FaAmazon,
    FaTwitch,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IconType } from "react-icons";

export type OAuthProviderKey =
    | "google"
    | "github"
    | "discord"
    | "microsoft"
    | "facebook"
    | "twitter"
    | "apple"
    | "gitlab"
    | "linkedin"
    | "reddit"
    | "amazon"
    | "twitch";

export interface OAuthProviderConfig {
    label: string;
    icon: IconType;
    themedIcon?: IconType; // Optional override for monochrome icon
}

export const OAUTH_PROVIDERS: Record<OAuthProviderKey, OAuthProviderConfig> = {
    google: { label: "Google", icon: FcGoogle, themedIcon: FaGoogle },
    github: { label: "GitHub", icon: FaGithub },
    discord: { label: "Discord", icon: FaDiscord },
    microsoft: { label: "Microsoft", icon: FaMicrosoft },
    facebook: { label: "Facebook", icon: FaFacebook },
    twitter: { label: "Twitter", icon: FaTwitter },
    apple: { label: "Apple", icon: FaApple },
    gitlab: { label: "GitLab", icon: FaGitlab },
    linkedin: { label: "LinkedIn", icon: FaLinkedin },
    reddit: { label: "Reddit", icon: FaReddit },
    amazon: { label: "Amazon", icon: FaAmazon },
    twitch: { label: "Twitch", icon: FaTwitch },
};
