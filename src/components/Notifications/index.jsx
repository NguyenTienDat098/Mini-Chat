import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
// preferred way to import (from `v4`). Uses `animate__` prefix.
import "animate.css/animate.min.css";
// Alternate way to use classes without prefix like `animated fadeIn`
import "animate.css/animate.compat.css";
function Notifications() {
  return <ReactNotifications />;
}

export default Notifications;
