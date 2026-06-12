import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="app-error">
          <h1>Aplikasi gagal dimuat</h1>
          <p>
            Terjadi error di browser. Coba refresh halaman, lalu cek pesan error
            di bawah ini.
          </p>
          <pre>{this.state.error.message}</pre>
        </main>
      );
    }

    return this.props.children;
  }
}
