import "./fallback.scss";

interface FallbackErrorProps {
  title: string;
  message: string;
  error?: Error;
}

export const FallbackError = ({ title, message, error }: FallbackErrorProps) => {
  return (
    <div className="fallback fallback--error">
      <div className="fallback__header">
        <div className="fallback__title">
          <span className="fallback__icon">⚠️</span>
          <p className="fallback__title-label">{title}</p>
        </div>
        <p className="fallback__message">{message}</p>
      </div>
      {error && error.message && <p className="fallback__error-msg">{error.message}</p>}
    </div>
  );
};
