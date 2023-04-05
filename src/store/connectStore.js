// Les valeurs qui ne changent pas sont stockées dans le store
import { create } from "zustand";

const connectStore = create((set) => ({
    connected: false,
    setConnected: () => set(() => ({ connected: true })),
    setDisconnected: () => set(() => ({ connected: false })),
}));

export default connectStore;