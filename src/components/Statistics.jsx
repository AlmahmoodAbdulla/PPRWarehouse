import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Grid, GridItem, HStack, VStack, Heading } from "@chakra-ui/react";
import { FcSearch, FcHighPriority } from "react-icons/fc";
import StatFilter from "./StatFilter";
import axios from "axios";
import BarChartComponent from "./BarChartComponent";
import ViolationCount from "./ViolationCount";
import {
  Divider,
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
import DataGrid from "./DataGrid";
const Statistics = (props) => {
  const [allInspections, setAllInspections] = useState([]);
  const [numOfViolations, setNumOfViolations] = useState(0);
  const [selectedDates, setSelectedDates] = useState([
    new Date(new Date().getFullYear(), 0, 1),
    new Date(),
  ]);
  const [violationCountData, setViolationCountData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [filteredNumOfViolations, setFilteredNumOfViolations] = useState(0);
  const [pharmacySelect, setPharmacySelect] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  async function getData(accessToken) {
    try {
      const response = await axios.get(props.apiURL + "getAllInspections", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const records = response.data.recordset;
      console.log(records);
      let numOfViolations = 0;
      setAllInspections(records);
      for (const row in records) {
        numOfViolations += records[row].violation;
      }
      setNumOfViolations(numOfViolations);
    } catch (error) {
      console.error(error);
    }
  }

  async function getViolationCountData(accessToken, filteredData) {
    const inspIds = await filteredData.map((inspection) => {
      return inspection.inspection_id;
    });

    try {
      const response = await axios.get(props.apiURL + "getViolationCount", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          data: JSON.stringify({ inspIds: inspIds }),
        },
      });
      const records = response.data.recordset;
      setViolationCountData(records);
      console.log(records);
    } catch (error) {
      console.error(error);
    }
  }

  const handleClick = () => {
    onOpen();
  };

  useEffect(() => {
    props.RequestAccessToken();
    if (props.accessToken) {
      getData(props.accessToken);
    }
  }, [props.accessToken]);

  useEffect(() => {
    if (props.accessToken) {
      getViolationCountData(props.accessToken, filteredData);
    }
  }, [filteredData]);

  useEffect(() => {
    // const startDate = new Date(selectedDates[0]).toISOString().slice(0, 4);
    // const startMonth = new Date(selectedDates[0]).toISOString().slice(5, 7);
    // const endDate = new Date(selectedDates[1]).toISOString().slice(0, 4);
    // const endMonth = new Date(selectedDates[1]).toISOString().slice(5, 7);
    const startDate = new Date(selectedDates[0]);
    const endDate = new Date(selectedDates[1]);
    const filteredData = allInspections?.filter((inspection) => {
      const insDate = new Date(inspection.date);
      return insDate >= startDate && insDate <= endDate;
    });
    setFilteredData(filteredData);
    let numOfFilteredViolations = 0;
    for (const row in filteredData) {
      numOfFilteredViolations += filteredData[row].violation;
    }
    setNumOfViolations(numOfFilteredViolations);
    //Filter Based on pharmacy
    if (pharmacySelect) {
      numOfFilteredViolations = 0;
      const filteredDataPharmacy = filteredData?.filter((inspection) => {
        return inspection.pharmacy_id == pharmacySelect;
      });
      setFilteredData(filteredDataPharmacy);
      for (const row in filteredDataPharmacy) {
        // console.log(`*** Number of violations: ${numOfFilteredViolations}`)
        numOfFilteredViolations += filteredDataPharmacy[row].violation;
      }
      setNumOfViolations(numOfFilteredViolations);
    }
  }, [, selectedDates, allInspections, pharmacySelect]);

  return (
    <>
      <Drawer onClose={onClose} isOpen={isOpen} size="full">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>View Inspections</DrawerHeader>
          <DrawerBody>
            <DataGrid data={allInspections} apiURL={props.apiURL} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Grid
        templateColumns="repeat(1, 1fr)"
        bg="linear-gradient(to right, #88c34526 , #00a8de1a)!important"
        alignItems="center"
      >
        <GridItem w="100%" h="5vh">
          <HStack justifyContent="center" spacing="70px" p="1">
            <HStack justifyContent="center" spacing="10px">
              <FcSearch size={40} />
              <VStack>
                <Heading as="h5" size="xs" color="black">
                  Number of inspections
                </Heading>
                <Heading as="h5" size="xs" color="black">
                  {filteredData.length}
                </Heading>
              </VStack>
            </HStack>
            <HStack justifyContent="center" spacing="10px">
              <FcHighPriority size={40} />
              <VStack>
                <Heading as="h5" size="xs" color="black">
                  Number of violations
                </Heading>
                <Heading as="h5" size="xs" color="black">
                  {numOfViolations}
                </Heading>
              </VStack>
            </HStack>
          </HStack>
        </GridItem>
      </Grid>
      <Grid
        h="70vh"
        templateColumns="repeat(5, 1fr)"
        templateRows="repeat(5, 1fr)"
      >
        <GridItem
          rowSpan={5}
          colSpan={1}
          bg="linear-gradient(to bottom, #88c34526 , #00a8de1a)!important"
        >
          <StatFilter
            data={allInspections}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            setPharmacySelect={setPharmacySelect}
            handleClick={handleClick}
          />
        </GridItem>
        <GridItem rowSpan={5} colSpan={2} p="1" m="1">
          <BarChartComponent
            data={filteredData ? filteredData : allInspections}
          />
        </GridItem>

        <GridItem
          rowSpan={5}
          colSpan={2}
          overflowY="scroll"
          m="1"
          p="1"
          bg="#e5f6fcba"
        >
          <ViolationCount data={violationCountData} />
        </GridItem>
      </Grid>
    </>
  );
};

export default Statistics;
