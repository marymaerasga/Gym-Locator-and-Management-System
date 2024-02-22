import { create } from "zustand";

const useStore = create((set) => ({
  wordSearch: "",
}));

export default useStore;
