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
import Link from "next/link";

// import {Toast} from '@chakra-ui/toast'

interface Addr {
  wallet: string;
  address: string;
}

export default function WalletHome() {
  // const { useToast } = toaster
  //   const toast = useToast()
  const [addrList, setAddrList] = useState<Array<Addr>>([])
  const { copy } = useCopy();

  useEffect(() => {
    const addrList = getAddressFromLocal();
    if (!addrList || !addrList.length) return alert("账户不存在");
    setAddrList(addrList);
  }, []);

  const copyAddress = (address: string) => {
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
        <Flex justify="space-between" align="center">
          <Text fontSize="16px" fontWeight="600">我的钱包</Text>
          <Link href="/Registry">创建新钱包</Link>
        </Flex>
        {addrList.length? addrList.map((item) => (<Box key={item.address}>
          <Box>{item.wallet}</Box>
          <Flex align="center">
            <Text>{item.address}</Text>
            <Btn cursor={"pointer"} ml="10px" onClick={() => copyAddress(item.address)}>
              拷贝
            </Btn>
          </Flex>
        </Box>))  : <Text>暂无账户</Text>}
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
