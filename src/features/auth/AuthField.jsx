export default function AuthField({
  id,
  label,
  icon,
  error,
  ...inputProps
}) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className={`auth-input-wrap ${error ? "has-error" : ""}`}>
        <i className={`fa-solid ${icon}`} />
        <input id={id} {...inputProps} />
      </div>
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}
