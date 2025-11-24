import { ethers } from 'ethers';

// 测试网配置
export const PROJECT_ID = "f70c5095d84b336b24fa72fab4313453"
export const testnetConfigs = {
  sepolia: {
    chainId: '11155111', // 11155111
    name: 'Sepolia',
    // rpcUrl: 'https://sepolia.infura.io/v3/'+PROJECT_ID,
    rpcUrl: "https://1rpc.io/sepolia",
    explorer: 'https://sepolia.etherscan.io',
    iconUrl: "https://rainlink.co/_next/static/media/eth.5aaa3207.png",
  },

};

// // 以太坊新的测试网
// holesky: {
//   chainId: '0x4268', // 17000
//   name: 'Holesky',
//   rpcUrl: 'https://holesky.infura.io/v3/'+PROJECT_ID,
//   explorer: 'https://holesky.etherscan.io',
//   iconUrl: "https://rainlink.co/_next/static/media/eth.5aaa3207.png",
// }