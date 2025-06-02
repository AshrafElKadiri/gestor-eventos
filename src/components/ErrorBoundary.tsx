/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { Component } from 'react';

interface Props {
  children: ReactNode; // Contenido que este componente envolverá y protegerá
}

interface State {
  hasError: boolean; // Indica si ocurrió un error en algún componente hijo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // Inicializamos el estado sin errores
    this.state = { hasError: false };
  }

  // Método estático que actualiza el estado si ocurre un error en un componente hijo
  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  // Aquí podemos realizar efectos secundarios como reportar el error a un servicio externo
  componentDidCatch(error: Error, info: any) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Renderiza un mensaje amigable en caso de error
      return <h1 className="p-4 text-red-600">Algo salió mal. Intenta recargar la página.</h1>;
    }

    // Si no hay error, renderiza normalmente los hijos
    return this.props.children;
  }
}
