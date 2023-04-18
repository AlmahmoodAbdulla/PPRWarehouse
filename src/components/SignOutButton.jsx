import React from "react";
import { Button } from "@chakra-ui/react";
import { useMsal } from "@azure/msal-react";

export default function SignOutButton() {
  const { instance } = useMsal();
  const handleLogOut = () => {
    instance.logoutRedirect();
  };
  return (
    <Button
      as={"a"}
      display={{ base: "inline-flex", md: "inline-flex" }}
      fontSize={"sm"}
      fontWeight={600}
      color={"white"}
      bg={"#3091b9"}
      href={"#"}
      _hover={{
        bg: "#73ac41",
        color: "white",
      }}
      onClick={handleLogOut}
    >
      Sign Out
    </Button>
  );
}
