/** @type {Detox.DetoxConfig} */
module.exports = {
  apps: {
    "android.debug": {
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
      build: "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
      reversePorts: [8081],
      type: "android.apk",
    },
    "ios.debug": {
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/MyClinic.app",
      build:
        "xcodebuild -workspace ios/MyClinic.xcworkspace -scheme MyClinic -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build",
      type: "ios.app",
    },
  },
  configurations: {
    "android.emu.debug": {
      app: "android.debug",
      device: "emulator",
    },
    "ios.sim.debug": {
      app: "ios.debug",
      device: "simulator",
    },
  },
  devices: {
    emulator: {
      device: {
        avdName: "Pixel_3a_API_30_x86",
      },
      type: "android.emulator",
    },
    simulator: {
      device: {
        type: "iPhone 14",
      },
      type: "ios.simulator",
    },
  },
  testRunner: {
    args: {
      $0: "jest",
      config: "e2e/jest.config.js",
    },
    jest: {
      setupTimeout: 120_000,
    },
  },
}
