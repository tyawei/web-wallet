import { Box, chakra, ChakraProviderProps,  } from "@chakra-ui/react";
import Link from "next/link";
import React, { ReactNode } from "react"

interface IProps extends ChakraProviderProps {
    children: ReactNode | string;
    hiddenHomeBtn?: boolean
}

export default React.memo(function Container(props: IProps) {
    return <Cnt {...props}>
        {props.hiddenHomeBtn ? null : <Box pos="absolute" top="10px" left="10px"><Link href="/">回到首页</Link></Box>}
        {props.children}
    </Cnt>
})

const Cnt = chakra(Box, {
    baseStyle: {
        pos: "relative",
        w: "600px",
        minH: "700px",
        m: "0 auto",
        p: "60px 20px",
        border: "2px solid #eee",
        boxShadow: "0 0 10px #ddd"
    }
})