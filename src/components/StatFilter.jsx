import React, { useState, useEffect } from "react";
import { Stack, HStack, VStack, Box, Heading, Select } from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";

export default function StatFilter(props) {
  const [data, setData] = useState([]);
  const [distinctPharmacies, setDistinctPharmacies] = useState([]);

  //   const distinctPharmacies = data?.reduce((acc, current) => {
  //     const pharmacy = acc.find(item => item.pharmacy_id === current.pharmacy_id);
  //     if (!pharmacy) {
  //       acc.push({
  //         pharmacy_id: current.pharmacy_id,
  //         pharmacy_name: current.pharmacy_name.trim()
  //       });
  //     }
  //     return acc;
  //   }, []);

  useEffect(() => {
    console.log(props.data);
    setData(props.data);
    const distinctPharmacies = [];
    for (const row in props.data) {
      const pharmacy_id = props.data[row].pharmacy_id;
      const pharmacy = distinctPharmacies.find(
        (item) => item.pharmacy_id === pharmacy_id
      );
      if (!pharmacy) {
        distinctPharmacies.push({
          pharmacy_id: props.data[row].pharmacy_id,
          pharmacy_name: props.data[row].pharmacy_name.trim(),
        });
      }
    }
    setDistinctPharmacies(distinctPharmacies);
    console.log(distinctPharmacies);
  }, [, props.data]);


  return (
    <>
     
      <VStack p={5} spacing={25}>
      <Box>
          <Button
            onClick={() => props.handleClick()}
            m={4}
            colorScheme='teal'
          >View inspections and generate PDF</Button>
        </Box>
        <Box>
          <Heading as="h5" size="sm">
            Filter by date:
          </Heading>
        </Box>
        <Box>
          <RangeDatepicker
            selectedDates={props.selectedDates}
            onDateChange={props.setSelectedDates}
            propsConfigs={{
                inputProps: {
                  size: "md"
                },

                popoverCompProps: {
                  popoverContentProps: {
                    background: "#ecf8fd    ",
                    color: "black",
                  },

                },
              }}
          />
        </Box>

        <Box>
          <Heading as="h5" size="sm">
            Filter by warehouse:
          </Heading>
        </Box>
        <Box>
          <Select
            placeholder="Select a warehouse"
            onChange={(e) => props.setPharmacySelect(e.target.value)}
          >
            {distinctPharmacies?.map((pharmacy) => (
              <option key={pharmacy.pharmacy_id} value={pharmacy.pharmacy_id}>

                {pharmacy.pharmacy_name}{" "}
              </option>
            ))}
          </Select>
        </Box>

      </VStack>
    </>
  );
}
