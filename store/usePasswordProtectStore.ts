import { create } from "zustand";

export enum PasswordProtectError {
  INCORRECT_PASSWORD = "INCORRECT_PASSWORD",
  UNKNOWN = "UNKNOWN",
}

export type PasswordProtectState = {
  password: string;
  decryptedContent: any;
  error: PasswordProtectError | null;
  setPassword: (password: string) => void;
  setError: (error: PasswordProtectError) => void;
  setDecryptedContent: (decryptedContent: any) => void;
};

const usePasswordProtectStore = create<PasswordProtectState>((set) => ({
  password: "",
  decryptedContent: null,
  error: null,
  setPassword: (password: string) => set((state) => ({ ...state, password })),
  setError: (error: PasswordProtectError) =>
    set((state) => ({ ...state, error })),
  setDecryptedContent: (decryptedContent: any) =>
    set((state) => ({
      ...state,
      decryptedContent,
    })),
}));

export default usePasswordProtectStore;
