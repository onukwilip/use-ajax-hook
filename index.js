const { default: axios } = require("axios");
const { useState, useCallback, useMemo } = require("react");

const useAjaxHook = ({ instance, options = {} }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const configOptions = useMemo(options);

  const sendRequest = useCallback(
    async ({ onSuccess, onError }) => {
      setLoading(true);
      setError(false);

      let response;
      const config = {
        ...configOptions,
      };
      const catchError = (e) => {
        setError(e);
        setLoading(false);
        setData(null);
        if (typeof onError === "function") onError();
      };

      if (typeof instance === "function") {
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
