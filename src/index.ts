import axios from "axios";
import { useState, useCallback, useMemo } from "react";

const useAjaxRequest = <T>({
  instance,
  options = {},
}: {
  instance: Function;
  options: { url: string; method: string; data?: any; [key: string]: any } | {};
}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const config = useMemo(() => options, [options]);
  const depInstance = useMemo(() => instance, [instance]);

  const sendRequest = useCallback(
    async (
      onSuccess: (response: { data: T }) => void,
      onError: (error: { response: { data: any } }) => void
    ) => {
      setLoading(true);
      setError(false);

      let response;

      const catchError = (e: any) => {
        setError(e);
        setLoading(false);
        setData(null);
        if (typeof onError === "function") onError(e);
      };

      if (typeof instance === "function") {
        response = await instance(config).catch(catchError);
      } else {
        throw new Error("Expected instance to be a function, but it's not");
      }

      if (response) {
        setLoading(false);
        setError(false);
        setData(response?.data);
        if (typeof onSuccess === "function") onSuccess(response);
      }

      return response;
    },
    [depInstance, config]
  );

  return {
    data,
    loading,
    error,
    sendRequest,
  };
};

export default useAjaxRequest;
