import React, { useState, useEffect } from "react";
import { InteractionType } from "@azure/msal-browser";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  FormControl,
  FormLabel,
  Select,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  Text,
  Textarea,
  Divider,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Spacer,
  Button,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";
import "./style.css";
const xl = defineStyle({
  fontSize: "3xl",
});

export const textareaTheme = defineStyleConfig({
  sizes: { xl },
});

const Inspection = (props) => {
  const toast = useToast();
  const [categories, setCategories] = useState({});
  const [checklistItems, setChecklistItems] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [radioData, setRadioData] = useState([]);
  const [checklistStatus, setChecklistStatus] = useState({});
  const [listLength, setListLength] = useState(0);
  const [showToast, setShowToast] = useState(true);
  const handleChecklistChange = (event, standard_id) => {
    const newStatus = {
      ...checklistStatus,
      [standard_id]: {compliant: Number(event)},
    };
    setChecklistStatus(newStatus);
    localStorage.setItem("checklistStatus", JSON.stringify(newStatus));
  };

  useEffect(() => {
    // Load the previously saved values from local storage when the component mounts
    const savedValues = localStorage.getItem("checklistStatus");
    if (savedValues) {
      setChecklistStatus(JSON.parse(savedValues));
      displayToast();
    }
  }, []);

  function displayToast() {
    if (showToast) {
      toast({
        title: "Data has been Restored",
        description: "Your previous data has been restored successfully.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setShowToast(false);
    }
  }
  async function getData(accessToken) {
    try {
      const response = await axios.get(props.apiURL + "getAccordionData", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const records = response.data.recordset;
      setListLength(records.length);
      const newCategories = {};

      records.forEach((item) => {
        if (!newCategories[item.category]) {
          newCategories[item.category] = [];
        }
        newCategories[item.category].push(item);
      });
      console.log(newCategories);
      setCategories(newCategories);
    } catch (error) {
      console.error(error);
    }
  }

  function clearData() {
    localStorage.removeItem("checklistStatus");
    setChecklistStatus({});
  }

  useEffect(() => {
    let completedItems = 0;

    Object.keys(categories).forEach((category) => {
      categories[category].forEach((item) => {
        if (checklistStatus[item.standard_id]) {
          completedItems++;
        }
      });
    });

    const percentage = listLength
      ? Math.ceil((completedItems / listLength) * 100)
      : 0;
    props.setPercentage(percentage);
  }, [checklistStatus, categories]);

  async function getChecklistRadioData(accessToken) {
    try {
      const response = await axios.get(props.apiURL + "getCheckListRadioData", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const records = response.data.recordset;
      setRadioData(records);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    props.RequestAccessToken();
    if (props.accessToken) {
      getData(props.accessToken);
      getChecklistRadioData(props.accessToken);
    }
  }, [props.accessToken]);

  function handleMemoChange(event, standard_id) {
    const newStatus = {
      ...checklistStatus,
      [standard_id]: {
        ...checklistStatus[standard_id],
        compliant: checklistStatus[standard_id].compliant,
        memo: event.target.value,
      },
    };
    setChecklistStatus(newStatus)

  }

  return (
    <Box pt={25}>
      <Box padding={1} bg="#1e6785c7">
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="xl" color="white" p={4}>
            Inspection Check List
          </Text>
          <Stack direction="row" spacing={4}>
            <Flex alignItems="center">
              <Button onClick={clearData}>Clear Values</Button>
              <Spacer width="20px" />
              <Text color="white">Your progress so far</Text>
              <Spacer width="20px" />
              <CircularProgress value={props.percentage} color="green.400">
                <CircularProgressLabel color="white">
                  {props.percentage}%
                </CircularProgressLabel>
              </CircularProgress>
            </Flex>
          </Stack>
        </Flex>
      </Box>
      <Accordion allowToggle>
        {Object.keys(categories).map((category) => (
          <AccordionItem key={category}>
            <AccordionButton
              _expanded={{
                bg: "linear-gradient(to right, #88c345 , #00a8de)",
                color: "white",
              }}
              bg="#f0f0f0"
            >
              <Box as="span" flex="1" textAlign="left">
                <Text fontSize="xl">{`${category}`}</Text>
              </Box>
            </AccordionButton>

            <AccordionPanel pb={4} bg="#EDF2F7">
              {categories[category].map((item) => (
                <Box key={item.standard_id} mb={4}>
                  <Text as="b" fontSize="md" color="#57585b">
                    {item.standard}
                  </Text>
                  {/* <Textarea size="xl" value={item.standard}  isReadOnly="true"/> */}
                  <VStack spacing={5} alignItems="flex-start">
                    <RadioGroup
                      onChange={(e) =>
                        handleChecklistChange(e, item.standard_id)
                      }
                      value={checklistStatus[item.standard_id]?.compliant}
                      mt={4}
                      iconColor="red"
                    >
                      <Stack direction="row">
                        {radioData.map((radioItem) => {
                          return (
                            <Radio
                              key={radioItem.compliant_status_id}
                              value={radioItem.compliant_status_id}
                            >
                              {radioItem.compliant_status}
                            </Radio>
                          );
                        })}
                      </Stack>
                    </RadioGroup>

                    <Textarea
                      placeholder="Enter memo here"
                      onChange={(event) =>
                        handleMemoChange(event, item.standard_id)
                      }
                      variant="filled"
                      background="white"
                    />
                  </VStack>
                  <Divider pt="25px" />
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default Inspection;
