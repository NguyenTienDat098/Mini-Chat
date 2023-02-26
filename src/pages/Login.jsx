import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../providers/Users";
import loginPic from "../assets/imgs/login-bg.jpg";
import "./page.css";
function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const UserData = useContext(UserContext);
  const { login, user, signInWithGoogle, loginWithFaceBook } = UserData;
  const navigate = useNavigate();
  useEffect(() => {
    if (user !== null) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <div className="login-page">
      <div className="view">
        <div className="login-pic">
          <img src={loginPic} alt="login" />
        </div>
        <div className="login-form">
          <span className="text-center w-full block mb-[30px] font-bold text-[30px]">
            Đăng Nhập
          </span>
          <div className="input-controll flex items-center justify-center bg-[#e6e6e6] rounded-[500px] mb-4">
            <FontAwesomeIcon icon={faEnvelope} className="ml-4 mr-3" />
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="text"
              className="bg-[transparent] h-[50px] pl-[10px] pr-[20px]"
              placeholder="Nhập vào email..."
            />
          </div>
          <div className="input-controll flex items-center justify-center bg-[#e6e6e6] rounded-[500px] mb-4">
            <FontAwesomeIcon icon={faLock} className="ml-4 mr-3" />
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              className="bg-[transparent] h-[50px] pl-[10px] pr-[20px]"
              placeholder="Nhập vào mật khẩu..."
            />
          </div>
          <div className="w-full">
            <button
              className="bg-[var(--main-color)] w-full p-3 mt-[10px] rounded-[500px]"
              onClick={() => {
                login(email, password);
              }}
            >
              Login
            </button>
          </div>
          <div className="forgot-account pt-[12px] text-[13px] text-center">
            <span>Forgot</span>
            <Link to="#"> Username / Password ?</Link>
          </div>
          <div className="to-register text-[13px] text-center flex items-center justify-center pt-[136px]">
            <div
              className="mr-2 cursor-pointer rounded-full bg-[#0984e3] flex items-center justify-center text-white"
              onClick={() => {
                loginWithFaceBook();
              }}
            >
              <FontAwesomeIcon icon={faFacebook} className="text-[16px] p-2" />
            </div>
            <div
              className="mr-2 cursor-pointer rounded-full bg-[var(--main-color)] flex items-center justify-center text-white"
              onClick={() => {
                signInWithGoogle();
              }}
            >
              <FontAwesomeIcon icon={faGoogle} className="text-[16px] p-2" />
            </div>
            <Link to="/register">
              <span className="mr-3">or Create your Account</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
