"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useAjaxRequest = ({ instance, config = {}, options, }) => {
    const [data, setData] = (0, react_1.useState)(undefined);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [isError, setIsError] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(undefined);
    // const config = useMemo(() => options, [options]);
    // const depInstance = useMemo(() => instance, [instance]);
    const displayAndResetDataAfterSeconds = (data) => {
        setData(data);
        setTimeout(() => setData(undefined), 1000 * ((options === null || options === void 0 ? void 0 : options.resetDataAfterSeconds) || 1));
    };
    const displayAndResetErrorAfterSeconds = (error) => {
        setError(error);
        setIsError(true);
        setTimeout(() => {
            setError(undefined);
            setIsError(false);
        }, 1000 * ((options === null || options === void 0 ? void 0 : options.resetErrorAfterSeconds) || 1));
    };
    /**
     * Function responsible for sending the request
     * @param onSuccess The function to be executed if the request was successfull
     * @param onError The function to be executed if the request was unsuccessfull or returned an error code
     * @param data The data to sent alongside the request. If left empty the data passed into the hook (in the config object) is used
     * @returns the response if it was successfull
     */
    const sendRequest = (0, react_1.useCallback)((onSuccess, onError, data) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setIsError(false);
        setError(undefined);
        (options === null || options === void 0 ? void 0 : options.resetDataOnSend) && setData(undefined);
        let response;
        const catchError = (e) => {
            if (options === null || options === void 0 ? void 0 : options.resetErrorAfterSeconds) {
                displayAndResetErrorAfterSeconds(e);
            }
            else {
                setError(e);
                setIsError(true);
            }
            setLoading(false);
            setData(undefined);
            if (typeof onError === "function")
                onError(e);
        };
        if (typeof instance === "function") {
            response = yield instance(Object.assign(Object.assign({}, config), (data ? { data: data } : {}))).catch(catchError);
        }
        else {
            throw new Error("Expected instance to be a function, but it's not");
        }
        if (response) {
            setLoading(false);
            setIsError(false);
            setError(undefined);
            if (options === null || options === void 0 ? void 0 : options.resetDataAfterSeconds)
                displayAndResetDataAfterSeconds(response.data);
            else
                setData(response === null || response === void 0 ? void 0 : response.data);
            if (typeof onSuccess === "function")
                onSuccess(response);
        }
        return response;
    }), [/* depInstance */ config]);
    /**
     * Function responsible for reseting the response data object
     */
    const resetData = (0, react_1.useCallback)(() => {
        setData(undefined);
    }, []);
    /**
     * Function responsible for reseting the response error states
     */
    const resetError = (0, react_1.useCallback)(() => {
        setIsError(false);
        setError(undefined);
    }, []);
    return {
        data,
        loading,
        error,
        isError,
        sendRequest,
        resetData,
        resetError,
    };
};
exports.default = useAjaxRequest;
