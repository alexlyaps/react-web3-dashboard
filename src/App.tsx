import "./App.css";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Tokens } from "@/components/Tokens";
import { WalletProvider } from "@/context/WalletContext";

function App() {
  return (
    <WalletProvider>
      <>
        <ConnectWallet />
        <Tokens />
      </>
    </WalletProvider>
  );
}

export default App;
