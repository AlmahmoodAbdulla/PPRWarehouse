import React from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { Flex, Center } from "@chakra-ui/react";
export default function Home() {
  return (
    <>
      <Flex minWidth="max-content" alignItems="center">
        <AuthenticatedTemplate>
          You're logged in, please choose a service from the top menu bar
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          You're not signed in, please use the sign in button located on the top
          menu bar
        </UnauthenticatedTemplate>
      </Flex>
    </>
  );
}
