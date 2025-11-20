import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import {
  Flex,
  Box,
  Button,
  Input,
  chakra,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCopy } from "@/hooks/useCopy";
import { getAddressFromLocal } from "@/utils/tool";

// import {Toast} from '@chakra-ui/toast'

export default function WalletHome() {
  // const { useToast } = toaster
  //   const toast = useToast()

  const toast = useToast();
  const { copy } = useCopy();
  const [address, setAddress] = useState("");

  useEffect(() => {
    const addr = getAddressFromLocal();
    if (!addr) return alert("账户不存在");
    setAddress(addr);
  }, []);

  const copyAddress = () => {
    if (address) {
      copy(address);
      alert("拷贝成功");
    } else {
      alert("地址不存在");
    }
  };

  return (
    <Container>
      <Box>
        <Text>我的钱包</Text>
        <Flex align={"center"}>
          <Text>{address}</Text>
          <Btn cursor={"pointer"} ml="10px" onClick={copyAddress}>
            拷贝
          </Btn>
        </Flex>
      </Box>
    </Container>
  );
}

const Btn = chakra(Button, {
  baseStyle: {
    w: "70px",
    h: "36px",
    outline: "none",
    border: "none",
    color: "#333",
    borderRadius: "8px",
    cursor: "pointer",
  },
});

const InputBox = chakra(Box, {
  baseStyle: {
    w: "80%",
  },
});

const InputPsd = chakra(Input, {
  baseStyle: {
    w: "100%",
    h: "48px",
    outline: "none",
    border: "none",
    bgColor: "none",
    color: "#333",
    borderBottom: "1px solid #eee",
  },
});
