// // import "react-native-gesture-handler"

// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// // import { GestureHandlerRootView } from "react-native-gesture-handler"
// // import { MMKV } from "react-native-mmkv"

// // import ApplicationNavigator from "@/navigation/Application"
// // import "@/translations"

// // export const queryClient = new QueryClient({
// //   defaultOptions: {
// //     mutations: {
// //       retry: false,
// //     },
// //     queries: {
// //       retry: false,
// //     },
// //   },
// // })

// // export const storage = new MMKV()

// // function App() {
// //   return (
// //     <GestureHandlerRootView style={{ flex: 1 }}>
// //       <QueryClientProvider client={queryClient}>
// //         <ApplicationNavigator />
// //       </QueryClientProvider>
// //     </GestureHandlerRootView>
// //   )
// // }

// // export default App

// "use client";

// import { StyleSheet } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { SafeAreaProvider } from "react-native-safe-area-context";

// import { ToastProvider } from "@/components/providers/ToastProvider";
// import { AppNavigator } from "@/navigation/AppNavigator";
// import { ThemeProvider } from "@/providers/ThemeProvider";

// export default function App() {
//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <SafeAreaProvider>
//         <ThemeProvider>
//           <ToastProvider>
//             <AppNavigator />
//           </ToastProvider>
//         </ThemeProvider>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

"use client";

import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ToastProvider } from "@/components/providers/ToastProvider";
import { withScreenErrorBoundary } from "@/hoc/withErrorBoundary";
import { AppNavigator } from "@/navigation/AppNavigator";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ErrorBoundary } from "@/utils/errorBoundary";
// import { setupGlobalErrorHandlers } from "@/utils/errorUtils";

const AppContent = () => {
  useEffect(() => {
    // Setup global error handlers
    // setupGlobalErrorHandlers();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <StatusBar
              barStyle="light-content"
              backgroundColor="transparent"
              translucent
            />
            <AppNavigator />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const AppWithErrorBoundary = withScreenErrorBoundary(AppContent);

const App = () => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("App-level error:", error);
        console.error("Error info:", errorInfo);
        // Here you could add crash reporting
      }}
    >
      <AppWithErrorBoundary />
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
