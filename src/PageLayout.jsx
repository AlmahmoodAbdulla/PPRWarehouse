import React from "react";
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
import { Grid, GridItem } from "@chakra-ui/react";
export default function PageLayout({ children }) {
  const headerHeight = "10vh";
  const footerHeight = "15vh";
  const minHeight = `calc(100vh - ${headerHeight} - ${footerHeight})`;
  return (
    <Grid
      h="100vh"
      templateRows={`${headerHeight} minmax(0, ${minHeight}) ${footerHeight}`}
      templateColumns={{ base: "repeat(1)" }}
    >
      <GridItem w="100%" h={headerHeight} bg="white" overflowY="auto">
        <NavBar />
      </GridItem>
      <GridItem w="100%" bg="white" overflow="auto">
        {children}
      </GridItem>
      <GridItem
        w="100%"
        h={footerHeight}
        bg="white"
        position="fixed"
        bottom="0"
        overflow="hidden"
      >
        <Footer />
      </GridItem>
    </Grid>
  );
}
