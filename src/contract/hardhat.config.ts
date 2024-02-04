import "@nomicfoundation/hardhat-toolbox";
import {HardhatUserConfig} from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {version:"0.8.19"},
  networks: {
    // for mainnet
    'lightlink-mainnet': {
      url: 'https://replicator.phoenix.lightlink.io/rpc/v1',
      accounts: ["0xd367b71d54781c4577b95634791fc003769005b909cff1e6e0d383e48ab49e08" as string],
      gasPrice: 1000000000,
    },
    // for testnet
    'lightlink-testnet': {
      url: 'https://replicator.pegasus.lightlink.io/rpc/v1',
      accounts: ["0xd367b71d54781c4577b95634791fc003769005b909cff1e6e0d383e48ab49e08" as string],
      // accounts: [process.env.WALLET_KEY as string],
      gasPrice: 1000000000,
    },
    // for local dev environment
    'base-local': {
      url: 'http://localhost:8545',
      // accounts: [process.env.WALLET_KEY as string],
      accounts: ["0xd367b71d54781c4577b95634791fc003769005b909cff1e6e0d383e48ab49e08" as string],
      gasPrice: 1000000000,
    },
  },
  defaultNetwork: 'hardhat',
};

export default config;
