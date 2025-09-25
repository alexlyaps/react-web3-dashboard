import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { theme } from "@/theme/theme.ts";
import { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";

export function Tokens() {
  const { provider, address, status } = useWallet();

  const TokensContainer = styled(Stack)(() => ({
    backgroundColor: theme.palette.primary.main,
    padding: "1rem",
    gap: "1rem",
    alignItems: "center",
    margin: "20px",
    borderRadius: "0.25rem",
  }));

  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (!provider) {
      setBalance("N/A");
      return;
    }
    const fetchBalance = async () => {
      try {
        if (!address) return;
        const blnc = await provider.getBalance(address);
        setBalance(ethers.formatEther(blnc));
      } catch (err) {
        console.error("fetchBalance", err);
      }
    };

    fetchBalance();
  }, [provider]);

  return (
    <>
      <TokensContainer maxWidth="sm">
        <div> {address ? address : "No address"}</div>
        <div> {balance ? balance : "No access"}</div>
        <div> {status}</div>
      </TokensContainer>
    </>
  );
}
