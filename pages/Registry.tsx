import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import {
  Flex,
  Box,
  Button,
  Input,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import WalletManager from "@/utils/WalletManager";
import Modal from "@/components/Modal";
import { useRouter } from "next/router";
import { SAVELOCALKEY } from "@/utils/enum";
import { downloadJSONFile } from "@/utils/tool";

const { KEY } = SAVELOCALKEY

export default function Registry() {
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPsd, setConfirmPsd] = useState("");
  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();
  const { reset } = router.query;

  // 创建钱包
  const createWallet = () => {
    if (!password.trim() || !confirmPsd.trim()) {
      return alert("请输入或确认密码");
    } else if (password !== confirmPsd) {
      return alert("两次输入密码不一致");
    }

    const walletManager = WalletManager.getInstance();
    const walletInfo = reset
      ? walletManager.getWalletInfo()
      : walletManager.createWalletAndMnemonic();

    console.log("walletInfo==", walletInfo);

    if (walletInfo || reset) {
      // address/privateKey/mnemonic
      //  展示助记词Modal、调用加密私钥并保存方法、index.tsx页面需要判断local是否有信息
      !reset && setMnemonic(walletInfo.mnemonic);
      walletManager.encryptPKeyAndSaveLocal(password);

      if (reset) {
        alert("重置成功！");
        confirmMnemonic();
      } else {
        onOpen();
      }
    }
  };

  const confirmMnemonic = () => {
    router.replace("/WalletHome");
  };

  const downloadEncryptKey = () => {
    const key = localStorage.getItem(KEY) || ""
    if (!key) return alert("文件不存在");
    downloadJSONFile(key, "walletEncryptPrivateKey.json")
  };

  return (
    <Container>
      <Flex
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"24px"}
      >
        <InputBox>
          <InputPsd
            placeholder="输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputBox>
        <InputBox>
          <InputPsd
            placeholder="确认密码"
            value={confirmPsd}
            onChange={(e) => setConfirmPsd(e.target.value)}
          />
        </InputBox>
        <InputBox>
          <Btn onClick={createWallet}>确定</Btn>
        </InputBox>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Box>请务必备份助记词:</Box>
        <Box>{mnemonic}</Box>
        <Box mt="20px">
          <Box>
            下载加密私钥数据文件，可以在丢失缓存的私钥数据后，导入此文件结合密码可以找回钱包：
          </Box>
          <Btn onClick={downloadEncryptKey}>下载加密私钥</Btn>
        </Box>
        <Btn onClick={confirmMnemonic} bgColor="#3381e3" color={"#fff"}>
          确定
        </Btn>
      </Modal>
    </Container>
  );
}

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
