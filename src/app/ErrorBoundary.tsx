import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ErrorBoundaryProps { children: ReactNode }
interface ErrorBoundaryState { hasError: boolean }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false }

  public static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true } }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled application error', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <main className="error-boundary" role="alert">
        <p className="eyebrow">Algo no ha salido como esperábamos</p>
        <h1>Podemos volver a empezar.</h1>
        <p>La información de tu compra no se ha podido cargar en esta pantalla.</p>
        <Link className="button button--primary" to="/">Volver al inicio</Link>
      </main>
    }

    return this.props.children
  }
}
