import { defineChain } from "thirdweb/chains";

/**
 * @chain
 */
export const etherlink_testnet = /*@__PURE__*/ defineChain({
  id: 128123,
  name: "Etherlink Testnet",
  rpc: "https://node.ghostnet.etherlink.com",
  nativeCurrency: { name: "Ghostnet", symbol: "XTZ", decimals: 18 },
  blockExplorers: [
    {
      name: "Etherlink Testnet explorer",
      url: "https://testnet.explorer.etherlink.com/",
    },
  ],
  testnet: true,
});

export const etherlink_mainnet = /*@__PURE__*/ defineChain({
  id: 42793,
  name: "Etherlink Mainnet",
  rpc: "https://node.mainnet.etherlink.com",
  nativeCurrency: { name: "Etherlink", symbol: "XTZ", decimals: 18 },
  blockExplorers: [
    {
      name: "Etherlink Mainnet beta explorer",
      url: "https://explorer.etherlink.com/",
    },
  ],
  testnet: false,
});