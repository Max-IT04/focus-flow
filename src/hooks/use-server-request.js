import { useCallback } from "react";
import { server } from "../bff";

export const useServerRequest = () => {
  return useCallback((operation, ...params) => {
    return server[operation](...params);
  }, []);
};
