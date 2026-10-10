import { Component, type ErrorInfo, type ReactNode } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"

type Props = {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

type State = {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

declare const __DEV__: boolean

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo)

    // Log error in development
    if (__DEV__) {
      console.error("ErrorBoundary caught an error:", error)
      console.error("Error info:", errorInfo)
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange, resetKeys } = this.props
    const { hasError } = this.state

    // Reset error state if resetKeys have changed
    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => prevProps.resetKeys?.[index] !== key
      )

      if (hasResetKeyChanged) {
        this.resetErrorBoundary()
      }
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.resetTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      })
    }, 100) as unknown as number
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  render() {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{"Something went wrong"}</Text>
            <Text style={styles.subtitle}>{"We're sorry for the inconvenience"}</Text>

            {__DEV__ && error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>{"Error Details:"}</Text>
                <Text style={styles.errorText}>{error.toString()}</Text>
                {errorInfo?.componentStack && (
                  <>
                    <Text style={styles.errorTitle}>{"Component Stack:"}</Text>
                    <Text style={styles.errorText}>{errorInfo.componentStack}</Text>
                  </>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={this.resetErrorBoundary}>
              <Text style={styles.buttonText}>{"Try Again"}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )
    }

    return children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 24,
    textAlign: "center",
  },
  errorDetails: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: "100%",
    maxHeight: 300,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#333333",
    fontFamily: "monospace",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
