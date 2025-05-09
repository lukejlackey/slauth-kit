export interface ThemeConfig {
    /** Background color for the modal container */
    background: string;
    /** Primary text color */
    text: string;
    /** Accent color (buttons, links) */
    accent: string;
}

/**
 * Default sloth-themed colors. Consumers can override via props.
 */
export const defaultTheme: ThemeConfig = {
    background: '#f7f3ee', // light neutral
    text: '#4b4b4b',       // dark slate
    accent: '#4caf50',     // sloth-green
};
