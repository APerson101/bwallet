import type {TokenType} from "./utils";

export const TOKENADDRESSES: TokenType[] = [{
  address: "0x6308fa9545126237158778e74AE1b6b89022C5c0",
  decimals: 18,
  name:"USDT",
  value: "1.0", //get from chain link,
  type:"ERC20"
},
{
  address: "0x18fB38404DADeE1727Be4b805c5b242B5413Fa40",
  name:"USDC",
  decimals: 18,
  type: "ERC20",
  value: "1.0",
},

{
  address: "0x49F65C3FfC6e45104ff5cB00e6030C626157a90b",
  type: "ERC20",
  name: "DAI",
  decimals:18,
    value:"1.0"
},

{
  address: "0x46A5e3Fa4a02B9Ae43D9dF9408C86eD643144A67",
  type: "ERC20",
  name: "WBTC",
  decimals: 18,
    value:"42665.70"
},

{
  address: "0x7EbeF2A4b1B09381Ec5B9dF8C5c6f2dBECA59c73",
  type: "ERC20",
  name: "WETH",
  decimals: 18,
    value: "2537.83"
}]