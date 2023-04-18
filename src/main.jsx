import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./auth/msalConfig";
import { StepsTheme as Steps } from 'chakra-ui-steps';
import "bootstrap/dist/css/bootstrap.min.css";
const theme = extendTheme({
  components: {
    Steps,
  },
});
const pca = new PublicClientApplication(msalConfig);

pca.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS) {
    console.log(event);
    pca.setActiveAccount(event.payload.account);
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <BrowserRouter>
        <App msalInstance={pca} />
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>
);
