import "./fallback.scss";

interface FallbackLoadingProps {
  title: string;
  message: string;
}

export const FallbackLoading = ({ title, message }: FallbackLoadingProps) => {
  return (
    <div className="fallback fallback--loading">
      <div className="fallback__header">
        <div className="fallback__title">
          <span className="fallback__icon">🔃</span>
          <p className="fallback__title-label">{title}</p>
        </div>
        <p className="fallback__message">{message}</p>
      </div>
    </div>
  );
};
