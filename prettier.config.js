/** @type {import('prettier').Config} */
export default {
  // Core formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: false,
  quoteProps: "as-needed",

  // JSX specific
  jsxSingleQuote: false,
  jsxBracketSameLine: false,

  // Trailing commas help with git diffs and are more maintainable
  trailingComma: "es5",

  // Spacing
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",

  // Line endings - consistent across platforms
  endOfLine: "lf",

  // Embedded language formatting
  embeddedLanguageFormatting: "auto",

  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: "css",

  // Prose wrapping for markdown
  proseWrap: "preserve",

  // Vue files support (if needed in future)
  vueIndentScriptAndStyle: false,

  // File-specific overrides
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: "*.md",
      options: {
        printWidth: 80,
        proseWrap: "always",
        tabWidth: 2,
      },
    },
    {
      files: "*.{yaml,yml}",
      options: {
        tabWidth: 2,
        singleQuote: true,
      },
    },
    {
      files: "*.{js,jsx,ts,tsx}",
      options: {
        parser: "typescript",
      },
    },
  ],
}
