import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Users from "./providers/Users";
import "./index.css";
import UploadFile from "./providers/UploadFile";
import ImagePrivew from "./providers/ImagePreview";
import IconsMessage from "./providers/IconsMessage";
import Modal from "./providers/Modal";
import ChatSetting from "./providers/ChatSetting";
import Themes from "./providers/Themes";
import Mobile from "./providers/Mobile";
import ShowChat from "./providers/ShowChat";
import Notifications from "./providers/Notifications";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Notifications>
    <Users>
      <Mobile>
        <ShowChat>
          <Themes>
            <UploadFile>
              <ImagePrivew>
                <IconsMessage>
                  <ChatSetting>
                    <Modal>
                      <App />
                    </Modal>
                  </ChatSetting>
                </IconsMessage>
              </ImagePrivew>
            </UploadFile>
          </Themes>
        </ShowChat>
      </Mobile>
    </Users>
  </Notifications>
);
