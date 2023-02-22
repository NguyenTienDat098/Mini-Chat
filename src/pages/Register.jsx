import {
  faArrowRight,
  faEnvelope,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../providers/Users";
import registerPic from "../assets/imgs/register-bg.jpg";

import "./page.css";
function Register() {
  const UserData = useContext(UserContext);
  const { user, register } = UserData;
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [username, setUsername] = useState(null);
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
          <img src={registerPic} alt="login" />
        </div>
        <div className="login-form">
          <span className="text-center w-full block mb-[30px] font-bold text-[30px]">
            Đăng Ký
          </span>
          <div className="input-controll flex items-center justify-center bg-[#e6e6e6] rounded-[500px] mb-4">
            <FontAwesomeIcon icon={faUser} className="ml-4 mr-3" />
            <input
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              className="bg-[transparent] h-[50px] pl-[10px] pr-[20px]"
              placeholder="Nhập vào username..."
            />
          </div>
          <div className="input-controll flex items-center justify-center bg-[#e6e6e6] rounded-[500px] mb-4">
            <FontAwesomeIcon icon={faEnvelope} className="ml-4 mr-3" />
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
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
                register(email, password, username);
              }}
            >
              Register
            </button>
          </div>
          <div className="to-register text-[13px] text-center flex items-center justify-center pt-[136px]">
            <Link to="/login">
              <span className="mr-3">Create your Account</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
