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
const useAjaxHook = ({ instance, options = {}, }) => {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(false);
    const config = (0, react_1.useMemo)(() => options, [options]);
    const depInstance = (0, react_1.useMemo)(() => instance, [instance]);
    const sendRequest = (0, react_1.useCallback)((onSuccess, onError) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        setError(false);
        let response;
        const catchError = (e) => {
            setError(e);
            setLoading(false);
            setData(null);
            if (typeof onError === "function")
                onError(e);
        };
        if (typeof instance === "function") {
            response = yield instance(config).catch(catchError);
        }
        else {
            throw new Error("Expected instance to be a function, but it's not");
        }
        if (response) {
            setLoading(false);
            setError(false);
            setData(response === null || response === void 0 ? void 0 : response.data);
            if (typeof onSuccess === "function")
                onSuccess(response);
        }
        return response;
    }), [depInstance, config]);
    return {
        data,
        loading,
        error,
        sendRequest,
    };
};
module.exports = useAjaxHook;
