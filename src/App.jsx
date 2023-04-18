import { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { MsalProvider } from "@azure/msal-react";
import PageLayout from "./PageLayout";
import { Flex, Spacer, Box, Grid, GridItem } from "@chakra-ui/react";
import Statistics from "./components/Statistics";
import Inspection from "./components/Inspection";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { loginRequest } from "../src/auth/msalConfig";
import {Button} from '@chakra-ui/react';
import InspectionSteps from './components/InspectionSteps';
import RectifyViolation from "./components/RectifyViolation";
function App({ msalInstance }) {

  return (
    <MsalProvider instance={msalInstance}>
      <PageLayout>
        <Pages />
      </PageLayout>
    </MsalProvider>
  );
}






const Pages = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [apiURL, setApiURL] = useState("http://10.193.147.55:8083/");
  const { instance, accounts, inProgress } = useMsal();


  const name = accounts[0] && accounts[0].name;
  function RequestAccessToken() {

    const request = {
        ...loginRequest,
        account: accounts[0]
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance.acquireTokenSilent(request).then((response) => {
      setAccessToken(response.accessToken)
    }).catch((e) => {
        instance.acquireTokenRedirect(request).then((response) => {
          setAccessToken(response.accessToken)
        });
    });
    
}
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact element={<ProtectedRoute />}>
        <Route path="/stats" element={<Statistics apiURL={apiURL} RequestAccessToken={RequestAccessToken} accessToken={accessToken}/>} />
      </Route>
      <Route exact element={<ProtectedRoute />}>
        <Route path="/inspection" element={<InspectionSteps apiURL={apiURL} RequestAccessToken={RequestAccessToken} accessToken={accessToken}/>} />
      </Route>
      <Route exact element={<ProtectedRoute />}>
        <Route path="/rectify" element={<RectifyViolation apiURL={apiURL} RequestAccessToken={RequestAccessToken} accessToken={accessToken}/>} />
      </Route>
    </Routes>
  );
};

export default App;
