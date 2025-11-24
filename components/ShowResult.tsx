import React, { useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { useDisclosure } from "@chakra-ui/react";
import { useNotification } from "./Notification";

const ResultModal = ({
  remove,
  isSuccess,
  message,
}: {
  remove: () => void;
  isSuccess: boolean;
  message: string,
}) => {
  const { onOpen, onClose } = useDisclosure();
  const { NotificationComponent, showNotification } = useNotification();

  useEffect(() => {
    onOpen();
  }, []);

  useEffect(() => {
    showNotification({
      type: isSuccess ? "success" : "error",
      title: isSuccess ? "操作成功" : "操作失败",
      message: message,
    });
  }, [message]);

  const _onClose = () => {
    onClose();
    remove();
  };

  return <NotificationComponent />;
};

export const showResult = (
  isSuccess: boolean = true,
  message: string = "",
) => {
  const domNode = document.createElement("div");
  document.body.append(domNode);

  const root = createRoot(domNode);

  const remove = () => {
    root.unmount();
    domNode.remove();
  };

  root.render(
    <ResultModal
      message={message}
      remove={remove}
      isSuccess={isSuccess}
    />,
  );

  return {
    remove,
  };
};
