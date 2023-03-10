import ReactLoading from "react-loading";
function LoadingPage({ type, color }) {
  return (
    <>
      <ReactLoading type={type} color={color} height={50} width={50} />
    </>
  );
}

export default LoadingPage;
