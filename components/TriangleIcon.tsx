import { Box } from "@chakra-ui/react";

export default function TriangleIcon({ isShow = false, onClick }: {isShow: boolean, onClick: () => void}) {
  return (
    <Box onClick={onClick}>
      <svg
        width={"10"}
        height={"6"}
        viewBox="0 0 10 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={isShow ? "M0 6L5 0L10 6H0Z" : "M0 0L5 6L10 0H0Z"}
          fill="#000"
        />
      </svg>
    </Box>
  );
}
