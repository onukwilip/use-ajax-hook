import axios, { AxiosResponse, AxiosStatic } from "axios";
import { useState, useCallback, useMemo } from "react";

const useAjaxRequest = <T>({
  instance,
  options = {},
}: {
  instance: AxiosStatic;
  options: { url: string; method: string; data?: any; [key: string]: any } | {};
}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<
    { response: AxiosResponse<T, any>; [key: string]: any } | boolean
  >(false);
  const config = useMemo(() => options, [options]);
  const depInstance = useMemo(() => instance, [instance]);

  const sendRequest = useCallback(
    async (
      onSuccess?: (response: AxiosResponse<T, any>) => void,
      onError?: (error: {
        response: AxiosResponse<T, any>;
        [key: string]: any;
      }) => void
    ) => {
      setLoading(true);
      setError(false);

      let response: AxiosResponse<T, any> | void;

      const catchError = (e: any) => {
        setError(e);
        setLoading(false);
        setData(null);
        if (typeof onError === "function") onError(e);
      };

      if (typeof instance === "function") {
        response = await instance<any, AxiosResponse<T, any>>(config).catch(
          catchError
        );
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

// const { sendRequest } = useAjaxRequest<{ name: string }>({
//   instance: axios,
//   options: {},
// });
// sendRequest().then((res) => {
//   if (res) {
//     res.data
//   }
// });

export default useAjaxRequest;
