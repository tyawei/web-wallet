import { chakra, useClipboard, useToast, Text, } from "@chakra-ui/react";
import { useEffect, useState } from "react";



export const useCopy = () => {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

  useEffect(() => {
    value && onCopy();
    setValue("");
  }, [value]);

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: title,
        status: "success",
      });
    }
  }, [hasCopied]);

  const _copy = (text: string, title: string = "拷贝成功") => {
    setValue(text);
    setTitle(title);
  };

  return {
    copy: _copy,
  };
};

