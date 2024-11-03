// src/client.ts
import { createThirdwebClient } from "thirdweb";

export const client = createThirdwebClient({
  clientId: process.env.THIRD_WEB_KEY,
});
