import "./loading.css";
function LoadingSkeleton({ className = "" }) {
  return <div className={`skeleton ${className}`}></div>;
}

export default LoadingSkeleton;
