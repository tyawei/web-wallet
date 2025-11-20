import React, {useState, } from "react"
import Container from "@/components/Container";
import { Flex, Box, Button, Input, chakra, Textarea, useDisclosure, Text, } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Modal from "@/components/Modal";
import { LOGINTYPE } from "@/utils/enum";
import WalletManager from "@/utils/WalletManager";
import { SAVELOCALKEY } from "@/utils/enum";
import Link from "next/link";
import { getUploadFileText } from "@/utils/tool";
// import "tailwindcss/tailwind.css"

const {KEY} = SAVELOCALKEY

export default function Login() {
  const { isOpen, onClose, onOpen, } = useDisclosure()
  const router = useRouter();
  const { type } = router.query;
  const [password, setPassword] = useState("")
  const [mnemonic, setMnemonic] = useState("")
  const [fileContent, setFileContent] = useState("")

  const encryptKeyJSON = localStorage.getItem(KEY) || ""
  const walletManager = WalletManager.getInstance()

  console.log("login===", type);

  const confirm = async () => {
    if (type === LOGINTYPE.PSD) {

      if (!password.trim()) return alert("请输入密码");
      // web页钱包数据非常依赖localStorage，如果本地localStorage没有加密的私钥数据，那么即使记得密码也登录不了，除非有备份的加密私钥文件结合密码找回钱包
      // 插件钱包会好一些，可以将账户数据永久保存在浏览器端，除非移除了
      if (!encryptKeyJSON && !fileContent) return alert("暂无账户，本地没有私钥加密JSON对象");

      const decryptKey = await walletManager.decryptPrivateKey(encryptKeyJSON || fileContent, password, !!fileContent)
      if (!decryptKey) return alert("密码不正确")

      router.replace("/WalletHome")

    } else if (type === LOGINTYPE.MNEMONIC) {
      const walletInfo = walletManager.recoverWalletFromMnemonic(mnemonic)
      console.log("是否恢复=", walletInfo)
      if (!walletInfo) return alert("助记词不正确")

      onOpen()

    } else if (type === LOGINTYPE.PRIVATE) {

    }
  };

  const fileChange = async e => {
    const file = e.target.files[0]
    const content = (await getUploadFileText(file)) as string

    console.log("file==", content, '\n', e.target.files[0])
    setFileContent(content)
    // if (content) {
    //   walletManager.decryptPrivateKey()

    // } else {
    //   alert("文件为空！")
    // }

  }

  return (
    <Container>
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"24px"}
      >
        <InputBox>
          {type === LOGINTYPE.PSD && <InputPsd placeholder="输入密码" onChange={e => setPassword(e.target.value)} />}
          {type === LOGINTYPE.PSD && !encryptKeyJSON &&
            <Box>
              <Text>缓存的加密私钥数据不存在，可以导入创建钱包时下载的加密私钥文件，结合密码找回钱包：</Text> 
              <Input type="file" onChange={fileChange} />
            </Box>
          }
          {type === LOGINTYPE.MNEMONIC && <InputArea placeholder="输入助记词以空格隔开" onChange={e => setMnemonic(e.target.value)}  />}
          {type === LOGINTYPE.PRIVATE && <InputArea placeholder="输入密钥" />}
        </InputBox>
        <InputBox>
          <Btn onClick={confirm}>确定</Btn>
        </InputBox>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} headerTitle="是否重置密码">
        <Flex
          h="200px"
          justify="space-around"
          align="center"
          flexDir="column"
          gap="16px"
        >
          <Box w="80%" mt="20px">
            <Link href="/Registry?reset=1"><Btn>是</Btn></Link>
          </Box>
          <Box w="80%">
            <Link href="/WalletHome"><Btn>不需要</Btn></Link>
          </Box>
        </Flex>
      </Modal>
    </Container>
  );
}

const InputArea = chakra(Textarea, {
  baseStyle: {
    w: "100%",
    border: "none",
    outline: "none",
  }
})

const Btn = chakra(Button, {
  baseStyle: {
    mt: "20px",
    w: "100%",
    h: "48px",
    outline: "none",
    border: "none",
    color: "#333",
    borderRadius: "12px",
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
