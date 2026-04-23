export default function FormCard({ title, children }) {
  return (
    <div className="container">
      <div className="card">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}