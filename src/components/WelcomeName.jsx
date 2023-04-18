import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
export default function WelcomeName(props) {
  const { instance } = useMsal();

  useEffect(() => {
    const account = instance.getActiveAccount();
    console.log(account);
    if (account) {
      const username = account.username.split("@")[0];
      props.setUserName(username);
    }
  }, [, props.userName]);
  return props.userName && <div>Welcome {props.userName}</div>;
}
