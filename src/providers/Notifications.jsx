import { useMemo, createContext, useEffect, useState } from "react";
import { Store } from "react-notifications-component";

export const NotificationsContext = createContext();
function Notifications({ children }) {
  const [notifications, setNotifications] = useState(null);
  useEffect(() => {
    if (notifications !== null) {
      Store.addNotification({
        title: notifications.title,
        message: notifications.message,
        type: notifications.type,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__flipInX"],
        animationOut: ["animate__animated", "animate__flipOutX"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      });
    }
  }, [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      setNotifications,
    }),
    [notifications]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export default Notifications;
