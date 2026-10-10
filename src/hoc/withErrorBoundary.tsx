import React, { type ComponentType, type ErrorInfo } from "react"
import { View } from "react-native"
import { Text } from "react-native-gesture-handler"

import { ErrorBoundary } from "@/utils/errorBoundary"

type ErrorBoundaryOptions = {
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  errorBoundaryOptions?: ErrorBoundaryOptions
) {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary {...errorBoundaryOptions}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Higher-order component for screen-level error boundaries
export function withScreenErrorBoundary<P extends object>(Component: ComponentType<P>) {
  return withErrorBoundary(Component, {
    onError: (error, errorInfo) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Screen Error:", error)
        console.error("Error Info:", errorInfo)
      }
      // Here you could add crash reporting like Crashlytics
    },
  })
}

// Higher-order component for component-level error boundaries
export function withComponentErrorBoundary<P extends object>(Component: ComponentType<P>) {
  return withErrorBoundary(Component, {
    fallback: (
      <View style={{ padding: 16, backgroundColor: "#FFF3CD", borderRadius: 8 }}>
        <Text style={{ margin: 0, color: "#856404" }}>Component failed to render</Text>
      </View>
    ),
    onError: (error, errorInfo) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("Component Error:", error)
      }
    },
  })
}
