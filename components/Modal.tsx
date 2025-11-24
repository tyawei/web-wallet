import { Box, chakra, Text, ChakraProps, Flex, } from "@chakra-ui/react";
import React, { ReactNode } from "react"

export default React.memo(function Modal({
    headerTitle = "提示",
    titleStyle,
    headerStyle,
    containerStyle,
    onClose,
    isOpen = false,
    children,
}: {
    headerTitle?: string,
    titleStyle?: ChakraProps,
    headerStyle?: ChakraProps,
    containerStyle?: ChakraProps,
    onClose: () => void, 
    isOpen: boolean,
    children: ReactNode,
}) {

    return isOpen? <Mask>
        <Container {...containerStyle}>
            <Header {...headerStyle}>
                <Text {...titleStyle}>{headerTitle}</Text>
                <CloseIcon onClick={onClose}>✕</CloseIcon>
            </Header>
            {children}
        </Container>
    </Mask> : null
})

const CloseIcon = chakra(Box, {
    baseStyle: {
        pos: "absolute",
        top: "0px",
        right: "10px", 
        boxSize: "24px",
        lineHeight: "24px",
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "700",
        cursor: "pointer"
    }
})

const Header = chakra(Box, {
    baseStyle: {
        pos: "relative",
        w: "100%",
        h: "36px",
        lineHeight: "36px",
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "600",
        pb: "24px",
    }
})

const Container = chakra(Box, {
    baseStyle: {
        w: "400px",
        h: "400px",
        borderRadius: "24px",
        p: "0 24px 20px",
        bgColor: "#fff",
    }
})

const Mask = chakra(Flex, {
    baseStyle: {
        w: "100%",
        h: "100%",
        pos: "fixed",
        top: 0,
        left: 0,
        bgColor: "rgba(0, 0, 0, 0.75)",
        zIndex: "100",
        justifyContent: "center",
        alignItems: "center",
    }
})