const axios = require("axios");
const { useState, useCallback, useMemo } = require("react");

const useAjaxHook = ({ instance, options = {} }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const config = useMemo(() => options, [options]);
  const depInstance = useMemo(() => instance, [instance]);

  const sendRequest = useCallback(
    async (onSuccess, onError) => {
      setLoading(true);
      setError(false);

      let response;

      const catchError = (e) => {
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

module.exports = useAjaxHook;
