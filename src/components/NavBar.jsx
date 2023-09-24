import React, {useState, useEffect} from "react";
import {
  Box,
  Flex,
  Spacer,
  ChakraProvider,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  Stack,
  Image
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import { NavLink , useLocation  } from "react-router-dom";
import { useIsAuthenticated } from '@azure/msal-react';
import WelcomeName from './WelcomeName';
import logoImage from '../assets/android-chrome-512x512.png'
import "./navbar.css"
export default function Navbar() {
  const [userName, setUserName] = useState(null);
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={4}
      bg="teal.500"
      color="white"
    >
      <Box p='2'>
        <NavLink  to="/" fontWeight="bold" fontSize="lg">
        <Image src={logoImage} alt="Logo" boxSize="50px" />
        </NavLink>
      </Box>
      
      <Box display={{ base: "block", md: "none" }}>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm" color="black">
            Menu
          </MenuButton>
          <MenuList>
            <MenuItem color="black">
              <NavLink  to="/" activeStyle={{ color: "red" }}>Home</NavLink >
            </MenuItem>
            <MenuItem color="black">
              <NavLink  to="/inspection" activeStyle={{ color: "red" }}>New inspection</NavLink >
            </MenuItem>
            <MenuItem color="black"> 
              <NavLink  to="/stats" activeStyle={{ color: "red" }}>View statistics</NavLink >
            </MenuItem>
            <MenuItem color="black">
              <NavLink  to="/rectify" activeStyle={{ color: "red" }}>Rectify violations</NavLink >
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      
      <Box ml={8} display={{ base: "none", md: "block" }} >
        <NavLink  to="/" style={{ marginRight: "1rem"}} activeClassName="active-link">
          Home
        </NavLink>
        <NavLink  to="/inspection" style={{ marginRight: "1rem"}} activeClassName="active-link">
        New inspection
        </NavLink >
        <NavLink  to="/stats" style={{ marginRight: "1rem"}} activeClassName="active-link">
        View statistics
        </NavLink >
        <NavLink  to="/rectify" activeClassName="active-link">Rectify violations</NavLink >
      </Box>
      <Spacer />
      <Box>
            <WelcomeName userName={userName} setUserName={setUserName}/>
      </Box>
   

      <Box p='2'>
      {isAuthenticated ? <SignOutButton /> : <SignInButton />}
      </Box>

    
    </Flex>
  );
}

