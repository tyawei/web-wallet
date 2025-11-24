import React, { useEffect, useState, useMemo, } from "react";
import Container from "@/components/Container";
import {
  Flex,
  Box,
  Button,
  Input,
  chakra,
  Text,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { useCopy } from "@/hooks/useCopy";
import { getAddressFromLocal } from "@/utils/tool";
import Link from "next/link";
import { testnetConfigs } from "@/config/test";
import WalletManager from "@/utils/WalletManager";
import { textEllipsis } from "@/utils/tool";
import Modal from "@/components/Modal";
import Loading from "@/components/Loading";
import { showResult } from "@/components/ShowResult";


interface Addr {
  wallet: string;
  address: string;
  [key: string]: string;
}

export default function WalletHome() {
  const [addrList, setAddrList] = useState<Array<Addr>>([])
  const [curWalletInfo, setCurWalletInfo] = useState<Addr>({} as Addr)
  const [balance, setBalance] = useState("")
  const [receiveAddr, setReceiveAddr] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { copy } = useCopy();
  const { isOpen, onClose, onOpen } = useDisclosure()
  const walletManager = WalletManager.getInstance()


  useEffect(() => {
    const addrList = getAddressFromLocal();
    if (!addrList || !addrList.length) return alert("账户不存在");
    setAddrList(addrList);

    const curAddress = walletManager.getWalletInfo()?.address
    const curWallet = addrList.filter((item: Addr) => item.address === curAddress) 
    setCurWalletInfo(curWallet[0])

    const connectBalance = async () => {
      // 默认sepolia参数
      await walletManager.connectToTestnet()

      const balance = await walletManager.getBalance()
      console.log("balance==", balance)
      setBalance(balance)
    }
    connectBalance()

  }, []);

  const curWallet = useMemo(() => {
    return curWalletInfo?.wallet
  }, [curWalletInfo])

  const copyAddress = (address: string | undefined) => {
    if (address) {
      copy(address);
      alert("拷贝成功");
    } else {
      alert("地址不存在");
    }
  };

  const sendTransaction = async () => {
    const isValidAddr = walletManager.isValidAddress(receiveAddr)
    if (!isValidAddr) return alert("输入地址不正确")
    if (!sendAmount.trim() || isNaN(Number(sendAmount)) ) return alert("请输入正确的数字")

    setIsLoading(true)

    try {
      const transaction: any = await walletManager.sendTransaction(receiveAddr, sendAmount)
      setIsLoading(false)

      if (transaction && transaction.hash) {
        alert("发送成功")
        onClose()

        const balance = await walletManager.getBalance()
        setBalance(balance)
      } else {
        alert("发送失败")
      }
    } catch(e) {
      console.log("ee===========", e)
      setIsLoading(false)
      showResult(false, JSON.stringify(e))
    }
  }

  return (
    <Container>
      <Box pos="absolute" top="10px" right="10px"><Link href="/Registry">创建新钱包</Link></Box>
      {/* <Text>注意：登录后，由于当前钱包的信息，以及连接测试网相关信息保存在class对象中（即内存中），暂未做持久化功能，刷新页面后这些信息将丢失。</Text> */}
      <Box>
        <Flex justify="space-between" align="center">
          <Flex fontSize="16px" fontWeight="600" align={"center"}>
            <Text>当前钱包：</Text>
            { 
              curWallet ? 
              <>
                <Text>{curWallet}</Text>
                <Text mx="10px">
                  ({textEllipsis(curWalletInfo?.address || "", {
                    preDigits: 6,
                    endDigits: 6,
                  })})
                </Text>
                <Btn w="50px" h="30px" cursor={"pointer"} ml="10px" onClick={() => copyAddress(curWalletInfo?.address)}>
                  拷贝
                </Btn>
              </> : <Text>暂未登录</Text>
            }
          </Flex>
          
          {curWallet ? <Btn w="50px" h="30px" onClick={onOpen}>发送</Btn> : null}
        </Flex>

        

        {/* {addrList.length? addrList.map((item) => (<Box key={item.address}>
          <Box>{item.wallet}</Box>
          <Flex align="center">
            <Text>{item.address}</Text>
            <Btn cursor={"pointer"} ml="10px" onClick={() => copyAddress(item.address)}>
              拷贝
            </Btn>
          </Flex>
        </Box>))  : <Text>暂无账户</Text>} */}

        <Box>
          { Object.values(testnetConfigs).map((item, idx) => {
              return <Flex justifyContent={"space-between"} align={"center"} key={idx}>
                <Flex align={"center"}>
                  <Image src={item.iconUrl} boxSize="30px" />
                  <Text ml="20px">{item.name}</Text>
                </Flex>
                <Box>
                  {balance}
                </Box>
              </Flex>
            })
          }
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} headerTitle="发送交易" containerStyle={{width: "620px", height: "300px"}}>
        <Box>
          <FlexItem>
            <Label>接收地址:</Label>
            <InputItem value={receiveAddr} onChange={e => setReceiveAddr(e.target.value)} />
          </FlexItem>
          <FlexItem>
            <Label>发送金额:</Label>
            <InputItem value={sendAmount} onChange={e => setSendAmount(e.target.value)} />
          </FlexItem>
          <Btn w="100%" h="48px" mt="20px" onClick={sendTransaction}>确定</Btn>
        </Box>
      </Modal>
      <Loading visible={isLoading} />
    </Container>
  );
}

const Label = chakra(Text, {
  baseStyle: {
    m: "0",

  }
})

const FlexItem = chakra(Flex, {
  baseStyle: {
    gap: "10px",
    align: "center",
    h: "44px",
    lineHeight: "44px",
    mb: "20px",
  }
})

const InputItem = chakra(Input, {
  baseStyle: {
    flex: 1,
    fontSize: "22px",
    outline: "none",
    border: "none",
    bgColor: "none",
    color: "#000",
    borderBottom: "1px solid #eee",
  },
});


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
