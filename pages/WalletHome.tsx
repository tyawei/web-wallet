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
import { getWalletsFromLocal } from "@/utils/tool";
import Link from "next/link";
import { testnetConfigs } from "@/config/test";
import WalletManager from "@/utils/WalletManager";
import { textEllipsis } from "@/utils/tool";
import Modal from "@/components/Modal";
import Loading from "@/components/Loading";
import { showResult } from "@/components/ShowResult";
import TriangleIcon from "@/components/TriangleIcon";
import { SAVELOCALKEY } from "@/utils/enum";

interface Addr {
  wallet: string;
  address: string;
  [key: string]: string;
}

export default function WalletHome() {
  const [walletList, setWalletList] = useState<Array<Addr>>([])
  const [curWalletInfo, setCurWalletInfo] = useState<Addr>({} as Addr)
  const [balance, setBalance] = useState("")
  const [receiveAddr, setReceiveAddr] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isShow, setIsShow] = useState(false)

  const { copy } = useCopy();
  const { isOpen, onClose, onOpen } = useDisclosure()

  const walletManager = WalletManager.getInstance()
  // 当前最先登录过的钱包，和其他钱包区分开 ，当切换到其他钱包并即将交易时，用来判断是否输入密码
  const curAddress = walletManager.getWalletInfo()?.address
  // 0xe3ff...23neik格式
  const ellipsisAddr = useMemo(() => {
    return textEllipsis(curWalletInfo?.address || "", {
      preDigits: 6,
      endDigits: 6,
    })
  }, [curWalletInfo.address])
  // 钱包名称
  const curWallet = useMemo(() => {
    return curWalletInfo?.wallet
  }, [curWalletInfo.address, curWalletInfo.wallet])  

  useEffect(() => {
    const walletList = getWalletsFromLocal();
    if (!walletList || !walletList.length) return alert("账户不存在");
    setWalletList(walletList);

    const curWallet = walletList.filter((item: Addr) => item.address === curAddress) 
    setCurWalletInfo(curWallet[0])
  }, [])

  // 连接钱包并获取余额
  useEffect(() => {
    const connectAndBalance = async () => {
      // 默认sepolia参数
      await walletManager.connectToTestnet()

      const balance = await walletManager.getBalance(curWalletInfo.address)
      setBalance(balance)
    }
    connectAndBalance()
  }, [curWalletInfo.address]);

  const copyAddress = (address: string | undefined) => {
    if (address) {
      copy(address);
      alert("拷贝成功");
    } else {
      alert("地址不存在");
    }
  };

  // 转账交易
  const sendTransaction = async () => {
    const isValidAddr = walletManager.isValidAddress(receiveAddr)
    if (!isValidAddr) return alert("输入地址不正确")
    if (!sendAmount.trim() || isNaN(Number(sendAmount)) ) return alert("请输入正确的数字")

    if (curWalletInfo.address !== curAddress && ellipsisAddr) {
      const password = await promptForPassword(ellipsisAddr)
      const encryptoKey = localStorage.getItem(SAVELOCALKEY.KEY) || ""

      // 非首次登录的钱包，将其wallet对象在walletManager对象中保存下来，用于交易
      await walletManager.decryptPrivateKey(encryptoKey, password)
    }
    setIsLoading(true)

    try {
      const transaction: any = await walletManager.sendTransaction(receiveAddr, sendAmount)

      if (transaction && transaction.hash) {
        // 需要先确认交易状态，然后获取余额，否则余额可能不会更新
        const receipt = await transaction.wait();
        console.log("交易已确认:blockNumber=", receipt.blockNumber)
        
        setIsLoading(false)
        alert("发送成功")
        onClose()

        const balance = await walletManager.getBalance(curWalletInfo.address)
        setBalance(balance)
      } else {
        setIsLoading(false)
        alert("发送失败")
      }
    } catch(e) {
      console.log("ee===========", e)
      setIsLoading(false)
      showResult(false, JSON.stringify(e))
    }
  }

  const promptForPassword = (address: string): Promise<string> => {
    return new Promise((resolve) => {
      // 如果 当前选中钱包不是 登录钱包，需要额外确认密码
      const password = window.prompt(`请输入钱包${address}的密码`);
      


      resolve(password || '');
    });
  }

  const selectWallet = (address: string) => {
    const curWallet = walletList.filter((item: Addr) => item.address === address) 
    setCurWalletInfo(curWallet[0])
    setIsShow(false)
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
                <Text mx="10px">({ellipsisAddr})</Text>
                <Box mt="-7px">
                  <TriangleIcon isShow={isShow} onClick={() => setIsShow(!isShow)} />
                </Box>
                <Btn w="50px" h="30px" cursor={"pointer"} ml="10px" onClick={() => copyAddress(curWalletInfo?.address)}>
                  拷贝
                </Btn>
              </> : <Text>暂未登录</Text>
            }
          </Flex>
          
          {curWallet ? <Btn w="50px" h="30px" onClick={onOpen}>发送</Btn> : null}
        </Flex>

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

      <Modal isOpen={isShow} onClose={() => setIsShow(false)} headerTitle="选择钱包" containerStyle={{width: "500px", height: "300px"}}>
      {walletList.length? walletList.map(({address, wallet}) => (
        <Flex key={address} cursor={"pointer"} justifyContent={"center"}
              bgColor={address === curWalletInfo.address ? "#eee" : "none"}
              borderRadius="6px"
              onClick={() => selectWallet(address)}
              >
          <Text fontWeight={600}>{wallet}：</Text>
          <Text>{address}</Text>
        </Flex>
        ))  : <Text>暂无钱包</Text>}          
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
