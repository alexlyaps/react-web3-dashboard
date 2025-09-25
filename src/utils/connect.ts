import { ethers } from "ethers";

export async function connect() {
  let provider;
  if (window.ethereum == null) {
    console.log("Metamas is not installed; using read-only defaults");
    provider = ethers.getDefaultProvider();
  } else {
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
    } catch (e: any) {
      if (e.code === 4001) {
        console.log("Access denied");
      }
      console.error(e);
    }
  }

  return provider;
}
