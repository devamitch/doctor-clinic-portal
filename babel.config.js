/** @type {import('@babel/core').ConfigFunction} */
export default {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@": "./src",
        },
        extensions: [
          ".ios.ts",
          ".android.ts",
          ".native.ts",
          ".ts",
          ".ios.tsx",
          ".android.tsx",
          ".native.tsx",
          ".tsx",
          ".jsx",
          ".js",
          ".json",
        ],
        root: ["./src"],
      },
    ],
    "inline-dotenv",
    "react-native-reanimated/plugin", // needs to be last
  ],
}
