import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { theme } from "@/theme/theme.ts";
import { useEffect, useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { ethers } from "ethers";

export function Tokens() {
  const { provider, address, status, contract } = useWallet();

  const TokensContainer = styled(Stack)(() => ({
    backgroundColor: theme.palette.primary.main,
    padding: "1rem",
    gap: "1rem",
    alignItems: "center",
    margin: "20px",
    borderRadius: "0.25rem",
  }));

  const [balance, setBalance] = useState<string | null>(null);
  const [sym, setSym] = useState<string | null>(null);
  const [contractBalance, setContractBalance] = useState<string | null>(null);

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

    const fetchSym = async () => {
      try {
        if (!contract) return;
        const symbol = await contract.symbol();
        setSym(symbol);
      } catch (err) {
        console.error("fetchSym", err);
      }
    };

    const fetchContractBalance = async () => {
      try {
        if (!contract) return;
        const blnc = await contract.balanceOf(
          "0x05BA1DF83B488EC9A36394d215181C5aF041Fd87"
        );
        const decimals = await contract.decimals();
        const formatted = ethers.formatUnits(blnc, decimals);
        setContractBalance(formatted);
        console.log(formatted);
      } catch (err) {
        console.error("fetchContractBalance", err);
      }
    };

    fetchBalance();
    fetchSym();
    fetchContractBalance();
  }, [provider, contract]);

  return (
    <>
      <TokensContainer maxWidth="sm">
        <div> {address ? address : "No address"}</div>
        <div> {balance ? balance : "No access"}</div>
        <div> {status}</div>
        <div> {sym}</div>
        <div> {contractBalance}</div>
      </TokensContainer>
    </>
  );
}
