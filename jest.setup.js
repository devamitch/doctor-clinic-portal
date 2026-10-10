import "@testing-library/jest-native/extend-expect"
import "react-native-gesture-handler/jestSetup"

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock")
  Reanimated.default.call = () => {}
  return Reanimated
})

// Mock MMKV
jest.mock("react-native-mmkv", () => ({
  MMKV: jest.fn(() => ({
    clearAll: jest.fn(),
    contains: jest.fn(),
    delete: jest.fn(),
    getAllKeys: jest.fn(() => []),
    getBoolean: jest.fn(),
    getBuffer: jest.fn(),
    getNumber: jest.fn(),
    getString: jest.fn(),
    set: jest.fn(),
  })),
}))

// Mock react-native-vector-icons
jest.mock("react-native-vector-icons/MaterialIcons", () => "Icon")
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon")
jest.mock("react-native-vector-icons/Ionicons", () => "Icon")

// Mock Reactotron
jest.mock("reactotron-react-native", () => ({
  configure: jest.fn(() => ({
    connect: jest.fn(() => ({
      createEnhancer: jest.fn(),
      use: jest.fn(() => ({
        connect: jest.fn(),
        useReactNative: jest.fn(),
      })),
      useReactNative: jest.fn(() => ({
        connect: jest.fn(),
        use: jest.fn(),
      })),
    })),
    use: jest.fn(() => ({
      connect: jest.fn(),
      useReactNative: jest.fn(),
    })),
    useReactNative: jest.fn(() => ({
      connect: jest.fn(),
      use: jest.fn(),
    })),
  })),
}))

// Mock i18next
jest.mock("react-i18next", () => ({
  initReactI18next: {
    init: jest.fn(),
    type: "3rdParty",
  },
  useTranslation: () => ({
    i18n: {
      changeLanguage: jest.fn(),
      language: "en",
    },
    t: (key) => key,
  }),
}))

// Mock navigation
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}))

// Mock essential packages only
jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}))

jest.mock("react-native-linear-gradient", () => "LinearGradient")

jest.mock("react-native-sqlite-storage", () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
    executeSql: jest.fn(),
  })),
}))

jest.mock("@shopify/flash-list", () => ({
  FlashList: "FlashList",
}))

jest.mock("react-native-config", () => ({
  API_URL: "http://localhost:3000",
}))

jest.mock("lucide-react-native", () => ({
  Heart: "Heart",
  User: "User",
  Settings: "Settings",
  Calendar: "Calendar",
  FileText: "FileText",
  Users: "Users",
}))

// Global test utilities
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
}

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper")

// Mock Linking
jest.mock("react-native/Libraries/Linking/Linking", () => ({
  addEventListener: jest.fn(),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
  openURL: jest.fn(() => Promise.resolve()),
  removeEventListener: jest.fn(),
}))

// Mock Dimensions
jest.mock("react-native/Libraries/Utilities/Dimensions", () => ({
  addEventListener: jest.fn(),
  get: jest.fn(() => ({ width: 375, height: 812 })),
  removeEventListener: jest.fn(),
}))

// Mock Platform
jest.mock("react-native/Libraries/Utilities/Platform", () => ({
  OS: "ios",
  Version: "14.0",
  select: jest.fn((obj) => obj.ios),
}))

// Increase timeout for async operations
jest.setTimeout(10000)
