/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#19372f',
    tint: '#1f6b4f',
    background: '#fff9ef',
    foreground: '#19372f',
    card: '#ffffff',
    cardForeground: '#19372f',
    primary: '#1f6b4f',
    primaryForeground: '#ffffff',
    secondary: '#f2eadc',
    secondaryForeground: '#305348',
    muted: '#f6efe4',
    mutedForeground: '#78837b',
    accent: '#ffc65a',
    accentForeground: '#19372f',
    destructive: '#c94e4e',
    destructiveForeground: '#ffffff',
    border: '#e7dcc9',
    input: '#f7f0e5',
  },
  radius: 18,
};

export default colors;
