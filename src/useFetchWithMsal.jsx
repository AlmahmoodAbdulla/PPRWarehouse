import { useState, useCallback } from "react";

import { InteractionType } from "@azure/msal-browser";
import { useMsal, useMsalAuthentication } from "@azure/msal-react";

/**
 * Custom hook to call a web API using bearer token obtained from MSAL
 */
const useFetchWithMsal = (msalRequest) => {
  console.log(msalRequest)
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const { result, error: msalError } = useMsalAuthentication(
    InteractionType.Redirect,
    {
      ...msalRequest,
      account: instance.getActiveAccount(),
    }
  );
  console.log("result "+result+" Error "+error)
  /**
   * Execute a fetch request with the given options
   * @param {string} method: GET, POST, PUT, DELETE
   * @param {String} endpoint: The endpoint to call
   * @param {Object} data: The data to send to the endpoint, if any
   * @returns JSON response
   */
  const execute = async (method, endpoint, data = null) => {
    console.log(method+" "+endpoint)
    if (msalError) {
      setError(msalError);
      console.log(msalError)
      return;
    }

    console.log(instance.getActiveAccount())

    if (result) {
      try {
        let response = null;

        const headers = new Headers();
        const bearer = `Bearer ${result.accessToken}`;
        headers.append("Authorization", bearer);

        if (data) headers.append("Content-Type", "application/json");

        let options = {
          method: method,
          headers: headers,
          body: data ? JSON.stringify(data) : null,
        };

        setIsLoading(true);

        response = await (await fetch(endpoint, options)).json();
        setData(response);

        setIsLoading(false);
        return response;
      } catch (e) {
        setError(e);
        setIsLoading(false);
        throw e;
      }
    }
  };

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, [result, msalError]), // to avoid infinite calls when inside a `useEffect`
  };
};

export default useFetchWithMsal;
