import React from "react";
import { Button } from "@chakra-ui/react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

export default function SignInButton() {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const handleSignIn = async () => {
    await instance.loginRedirect();
    navigate(0);
  };
  return (
    <Button as={"a"} fontSize={"sm"} fontWeight={400} onClick={handleSignIn}>
      Sign In
    </Button>
  );
}
