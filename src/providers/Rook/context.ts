import { createContext } from "react";
import { RookContextProps } from "./types";

export const RookContext = createContext<RookContextProps>({
  availability: null,
  granted: false,
  requestPermissions: () => {
    throw new Error("requestPermissions");
  },
});
