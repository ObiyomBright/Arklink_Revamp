import React, { createContext, useState, useContext } from "react";
import AlertPopup from "../../components/AlertPopUp/AlertPopUp.jsx"; 
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const notify = ({ message, type = "info", duration = 3000 }) => {
    setAlert({ message, type, duration });
  };

  const closeAlert = () => setAlert(null);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {alert && (
        <AlertPopup
          message={alert.message}
          type={alert.type}
          duration={alert.duration}
          onClose={closeAlert}
        />
      )}
    </NotificationContext.Provider>
  );
};
