import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { theme } from "@/theme/theme.ts";
import { useWallet } from "@/context/WalletContext";

export function ConnectWallet() {
  const { connectMetaMask, disconnect } = useWallet();

  const ConnectWalletContainer = styled(Stack)(() => ({
    backgroundColor: theme.palette.primary.main,
    padding: "1rem",
    gap: "1rem",
    alignItems: "center",
    margin: "20px",
    borderRadius: "0.25rem",
  }));

  return (
    <>
      <ConnectWalletContainer maxWidth="sm">
        <Button color="secondary" variant="contained" onClick={connectMetaMask}>
          Connect wallet
        </Button>
        <Button color="secondary" variant="contained" onClick={disconnect}>
          Disconnect wallet
        </Button>
      </ConnectWalletContainer>
    </>
  );
}
