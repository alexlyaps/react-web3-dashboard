import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { connect } from "@/utils/connect.ts";
import { BrowserProvider, Contract } from "ethers";
import type { Signer } from "ethers";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface WalletState {
  provider: BrowserProvider | null;
  signer: Signer | null;
  address: string | null;
  status: ConnectionStatus;
  error: string | null;
  isLoading: boolean;
  contract: Contract | null;
}

interface WalletContextValue extends WalletState {
  connectMetaMask: () => Promise<void>;
  disconnect: () => void;
  getSigner: () => Promise<Signer | null>;
  getContract: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactElement }) {
  const [state, setState] = useState<WalletState>({
    provider: null,
    signer: null,
    address: null,
    status: "disconnected",
    error: null,
    isLoading: false,
    contract: null,
  });

  const updateState = useCallback((updates: Partial<WalletState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const connectMetaMask = useCallback(async () => {
    try {
      updateState({ isLoading: true, status: "connecting", error: null });
      const provider = await connect();
      updateState({ isLoading: false });

      if (!provider) {
        throw new Error("Failed to connect to MetaMask");
      }

      if (!(provider instanceof BrowserProvider)) {
        throw new Error("Provider is not a BrowserProvider");
      }

      const browserProvider = provider as BrowserProvider;
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();

      updateState({
        provider: browserProvider,
        signer,
        address,
        status: "connected",
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occured;";

      updateState({
        provider: null,
        signer: null,
        address: null,
        status: "error",
        isLoading: false,
        error: errorMessage,
      });

      console.error("MetaMask connection failed");
    }
  }, [updateState]);

  const disconnect = () => {
    updateState({
      provider: null,
      signer: null,
      address: null,
      status: "disconnected",
      error: null,
    });
  };

  const getSigner = useCallback(async () => {
    try {
      if (state.signer) return state.signer;
      if (!state.provider) throw new Error("Provider not connected");

      const signer = await state.provider.getSigner();
      updateState({ signer });
      return signer;
    } catch (error) {
      const messageError =
        error instanceof Error ? error.message : "Failed to get a signer";
      updateState({ error: messageError });
      console.error("Get signer error:", error);
      return null;
    }
  }, [state.provider, state.signer, updateState]);

  const getContract = useCallback(() => {
    const abi: string[] = [
      "function decimals() view returns (uint8)",
      "function symbol() view returns (bytes32)",
      "function balanceOf(address a) view returns (uint)",
    ];
    const contract = new Contract(
      "0x55d398326f99059fF775485246999027B3197955",
      abi,
      state.signer
    );

    updateState({ contract });
    return contract;
  }, [state.provider, state.signer, updateState]);

  useEffect(() => {
    if (!state.provider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) disconnect();
      else updateState({ address: accounts[0] });
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    const handleDisconnect = () => {
      disconnect();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
        window.ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [state.provider, connectMetaMask, disconnect]);

  const contextValue: WalletContextValue = {
    ...state,
    connectMetaMask,
    disconnect,
    getSigner,
    getContract,
  };

  return (
    <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

export function useWalletAddress(): string | null {
  const { address } = useWallet();
  return address;
}

export function useWalletStatus(): ConnectionStatus {
  const { status } = useWallet();
  return status;
}

export function useWalletConnected(): boolean {
  const { status } = useWallet();
  return status === "connected";
}
