import Container from "@/components/Container";
import { Button, Box, Flex, chakra, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import Modal from "@/components/Modal";
// import "tailwindcss/tailwind.css"

export default function Home() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  

  return (
    <Container hiddenHomeBtn={true}>
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"24px"}
      >
        <Box w={"80%"}>
          <Link href="/Registry">
            <Btn>创建钱包</Btn>
          </Link>
        </Box>
        <Box w={"80%"}>
          <Btn onClick={onOpen}>登录钱包</Btn>
        </Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Flex
          h="240px"
          justify="space-around"
          align="center"
          flexDir="column"
          gap="16px"
        >
          <Box w="80%">
            <Link href="/Login?type=1">
              <Btn>输入密码</Btn>
            </Link>
          </Box>
          <Box w="80%">
            <Link href="/Login?type=2">
              <Btn>使用助记词</Btn>
            </Link>
          </Box>
          <Box w="80%">
            <Link href="/Login?type=3">
              <Btn>使用密钥</Btn>
            </Link>
          </Box>
        </Flex>
      </Modal>
    </Container>
  );
}

const Btn = chakra(Button, {
  baseStyle: {
    w: "100%",
    h: "48px",
    outline: "none",
    border: "none",
    color: "#333",
    borderRadius: "12px",
    cursor: "pointer",
  },
});
