export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <h1 className="text-6xl text-accent-color mb-4" style={{ fontWeight: 800 }}>404</h1>
        <p className="text-text-muted mb-6">Page not found</p>
        <a href="/" className="px-6 py-3 bg-accent-color text-white rounded-xl hover:bg-accent-hover transition-all">
          Back to Home
        </a>
      </div>
    </div>
  );
}
