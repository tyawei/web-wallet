import React, { useEffect, useState, useRef } from "react";
import './index.css';

const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
  >
    <circle cx="22" cy="22" r="18" fill="#22C55E" />
    <circle
      cx="22"
      cy="22"
      r="20"
      stroke="white"
      stroke-opacity="0.1"
      stroke-width="4"
    />
    <path
      d="M13.9492 21.0237L19.9867 27.0343L30.049 17.0166"
      stroke="white"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="44"
    viewBox="0 0 44 44"
    fill="none"
  >
    <circle cx="22" cy="22" r="18" fill="#ED096F" />
    <circle
      cx="22"
      cy="22"
      r="20"
      stroke="white"
      stroke-opacity="0.1"
      stroke-width="4"
    />
    <path
      d="M16.002 28L19.993 24.0809L28.002 16"
      stroke="white"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M28 28L24.0089 24.0809L16 16"
      stroke="white"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Notification = ({
  type = "success",
  title = "",
  message = "",
  duration = 3000,
  onClose = () => {},
  visible = false,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
    }
  };

  const handleMouseEnter = () => {
    clearTimer();
  };

  const handleMouseLeave = () => {
    startTimer();
  };

  useEffect(() => {
    setIsVisible(visible);

    if (visible && duration > 0) {
      startTimer();
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [visible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <SuccessIcon />;
      case "error":
        return <ErrorIcon />;
      default:
        return <SuccessIcon />;
    }
  };

  return (
    <div
      className="notification-container"
      style={{
        animation: "slideInRight 0.3s ease-out",
        borderRadius: "16px 0 0 16px",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-content">
        <div className="notification-title">{title}</div>
        {message && <div className="notification-message">{message}</div>}
      </div>
    </div>
  );
};

export const useNotification = () => {
  const [notification, setNotification] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
    duration: 3000,
  });

  const showNotification = (config?: any) => {
    setNotification({
      visible: true,
      type: "success",
      title: "",
      message: "",
      duration: 3000,
      ...config,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  const NotificationComponent = () => (
    <Notification
      visible={notification.visible}
      type={notification.type}
      title={notification.title}
      message={notification.message}
      duration={notification.duration}
      onClose={hideNotification}
    />
  );

  return {
    NotificationComponent,
    showNotification,
    hideNotification,
  };
};

export default Notification;
