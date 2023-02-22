import { useContext, useEffect, useState, useRef } from "react";
import { UploadContext } from "../../providers/UploadFile";
import "./fileUpload.css";
import { storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  getMutipleDocuments,
  listenDocument,
  updateArrayField,
  updateField,
} from "../../firebase/util";
import { UserContext } from "../../providers/Users";
import moment from "moment";
import uuid from "react-uuid";
import FileUploader from "../FileUploader";
import { NotificationsContext } from "../../providers/Notifications";

const fileTypes = ["JPG", "PNG", "GIF"];

function FileUploaded({ className = "" }) {
  const [file, setFile] = useState(null);
  const UploadData = useContext(UploadContext);
  const { showUpload, setShowUpload, caseUpload } = UploadData;
  const uploadRef = useRef();
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const [currentUser, setCurrentUser] = useState(null);
  const [process, setProcess] = useState(0);
  const [currentChat, setCurrentChat] = useState(null);
  const NotificationsData = useContext(NotificationsContext);
  const { setNotifications } = NotificationsData;
  const overlayRef = useRef();

  useEffect(() => {
    if (currentUser !== null && currentUser.currentChat !== "") {
      listenDocument("Users", currentUser.currentChat, (data) => {
        if (data !== undefined) {
          setCurrentChat(data);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (user !== null) {
      listenDocument("Users", user.id, (data) => {
        if (data !== undefined) {
          setCurrentUser(data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (showUpload) {
      uploadRef.current.classList.add("show");
      overlayRef.current.classList.add("show");
    } else {
      uploadRef.current.classList.remove("show");
      overlayRef.current.classList.remove("show");
    }
  }, [showUpload]);

  // Send a image for other user
  const sendImageMes = (url) => {
    updateArrayField("UserChat", currentUser.currentChat, "users", {
      file: url,
      text: "",
      author: {
        id: currentUser.id,
        username: currentUser.username,
        photo: currentUser.photo,
      },
      key: uuid(),
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    setNotifications({
      type: "success",
      message: "Gửi thành công",
      title: "Thành công",
    });
  };

  const handleChange = (file) => {
    setFile(file);
    setProcess(0);
  };

  const updateAvatar = (newAvatar) => {
    if (currentUser !== null && currentChat !== null) {
      getMutipleDocuments("Users", "username", ">=", "").then((users) => {
        users.forEach((user) => {
          let dataUpdate = user;
          dataUpdate.chats.forEach((e) => {
            if (e.id === currentUser.id) {
              e.photo = newAvatar;
            }
          });
          updateField("Users", user.id, "chats", dataUpdate.chats);
        });
      });
    }
  };

  const handleUpload = () => {
    if (file !== null) {
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, "images/" + uuid() + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProcess(progress);

          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (caseUpload !== "") {
              if (caseUpload === "ChangeAvatar") {
                updateField("Users", currentUser.id, "photo", downloadURL);
                updateAvatar(downloadURL);
                setNotifications({
                  type: "success",
                  message: "Tải ảnh lên thành công",
                  title: "Thành công",
                });
              } else if (caseUpload === "SendFile") {
                sendImageMes(downloadURL);
              }
            }
          });
        }
      );
    } else {
      setNotifications({
        type: "warning",
        title: "Chú ý",
        message: "Bạn chưa chọn File !!!",
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFile(file);
  };

  // Handle file dragover event
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div
        className="overlay fixed w-full top-0 bottom-0 right-0 left-0 bg-[var(--overlay)] hidden z-[999]"
        ref={overlayRef}
      ></div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        ref={uploadRef}
        className={`${className} z-[999] flex flex-col items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[20px] file-upload `}
      >
        <FileUploader
          className="file"
          file={file}
          process={process}
          handleChange={handleChange}
        />
        <div className="w-full flex items-center justify-center mt-2 pl-4 pr-4">
          <button
            className="p-2 bg-[var(--sub-color)] rounded-lg text-center mr-2 min-w-[60px] w-[48%]"
            onClick={handleUpload}
          >
            Upload
          </button>
          <button
            className="p-2 bg-[var(--error-color)] rounded-lg text-center min-w-[60px] w-[48%]"
            onClick={() => {
              setShowUpload(false);
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
}

export default FileUploaded;
