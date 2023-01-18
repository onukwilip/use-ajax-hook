const { default: axios } = require("axios");
const { useState, useCallback, useMemo } = require("react");

const useAjaxHook = (options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { instance, url, headers, body, withCredentials, otherProps } =
    useMemo(options);

  let other = {};

  if (typeof otherProps === "object") other = { ...otherProps };

  const sendRequest = useCallback(
    async ({ onSuccess, onError }) => {
      setLoading(true);
      setError(false);

      let response;
      const config = {
        url,
        headers,
        data: body ? body : null,
        withCredentials,
        ...other,
      };
      const catchError = (e) => {
        setError(e);
        setLoading(false);
        setData(null);
        if (typeof onError === "function") onError();
      };

      if (instance) {
        response = await instance(config).catch(catchError);
      } else {
        response = await axios(config).catch(catchError);
      }

      if (response) {
        setLoading(false);
        setError(false);
        setData(response?.data);
        if (typeof onSuccess === "function") onSuccess();
      }
    },
    [instance, url, headers, body, withCredentials, otherProps]
  );

  return {
    data,
    loading,
    error,
    sendRequest,
  };
};

export default useAjaxHook;
