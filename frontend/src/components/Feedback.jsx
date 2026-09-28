export function ErrorMessage({ children }) {
  return children ? (
    <p className="notice error" role="alert">
      {children}
    </p>
  ) : null;
}
export function Loading() {
  return (
    <p className="notice" role="status">
      Estamos preparando todo…
    </p>
  );
}
export function ResourceState({ resource, children }) {
  if (resource.loading) return <Loading />;
  if (resource.error)
    return (
      <div>
        <ErrorMessage>{resource.error}</ErrorMessage>
        <button className="button button-outline" onClick={resource.reload}>
          Volver a intentar
        </button>
      </div>
    );
  return children;
}
