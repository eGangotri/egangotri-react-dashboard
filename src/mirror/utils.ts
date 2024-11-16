import { getBackendServer } from "utils/constants";

export const makePostCall = async (body: Record<string, unknown>, resource: string) => {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  try {
    console.log(`going to fetch ${JSON.stringify(body)}`)
    const response = await fetch(getBackendServer() + resource, requestOptions);
    console.log(`response ${JSON.stringify(response)}`)
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else {
      console.log(`response not ok ${response.statusText}`)
      return {
        success: false,
        error: response.statusText
      };
    }
  }
  catch (error) {
    const err = error as Error;
    console.log(`catch err ${err.message}`)
    return {
      success: false,
      error: "Exception thrown. May be Backend Server down." + err.message
    };
  }
};

export const replaceQuotes = (replaceable: string) => {
  //console.log(`replaceable ${JSON.stringify(replaceable)}`)
  return replaceable?.replace(/"|'/g, "")
}