import { defineChain } from "thirdweb/chains";

/**
 * @chain
 */
export const etherlink_testnet = /*@__PURE__*/ defineChain({
  id: 1320,
  name: "AIA Testnet",
  rpc: "https://aia-dataseed1-testnet.aiachain.org",
  nativeCurrency: { name: "AIA", symbol: "AIA", decimals: 18 },
  blockExplorers: [
    {
      name: "AIA Testnet explorer",
      url: "https://testnet.aiascan.com/",
    },
  ],
  testnet: true,
});

export const etherlink_mainnet = /*@__PURE__*/ defineChain({
  id: 42793,
  name: "Etherlink Mainnet",
  rpc: "https://node.mainnet.etherlink.com",
  nativeCurrency: { name: "Etherlink", symbol: "AIA", decimals: 18 },
  blockExplorers: [
    {
      name: "Etherlink Mainnet beta explorer",
      url: "https://explorer.etherlink.com/",
    },
  ],
  testnet: false,
});