import { Step, Steps, useSteps } from "chakra-ui-steps";
import { Flex, Button, Box } from "@chakra-ui/react";
import WarehouseInfo from "./WarehouseInfo";
import SelectInspectors from "./SelectInspectors";
import Inspection from "./Inspection";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
export default function InspectionSteps(props) {
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(0);
  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  useEffect(() => {
    if (activeStep === 3) {
      const selectedWarehouse = JSON.parse(
        localStorage.getItem("selectedWarehouse")
      );
      const selectedInspectors = JSON.parse(
        localStorage.getItem("selectedInspectors")
      );
      const checkListValues = JSON.parse(
        localStorage.getItem("checklistStatus")
      );
      console.log(checkListValues)
      localStorage.removeItem('selectedWarehouse');
      localStorage.removeItem('selectedInspectors');
      localStorage.removeItem('checklistStatus');

      axios.post(props.apiURL+"insertInspection", {
        selectedWarehouse: selectedWarehouse,
        selectedInspectors: selectedInspectors,
        checkListValues: checkListValues
      }, {
        headers: {
          'Authorization': 'Bearer ' + props.accessToken,
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        if (response.status == 200){
          navigate("/stats")
        }
      }, (error) => {
        console.log(error);
      });
    }
  }, [activeStep]);

  const steps = [
    {
      label: "Warehouse Information",
      content: (
        <WarehouseInfo
          apiURL={props.apiURL}
          RequestAccessToken={props.RequestAccessToken}
          accessToken={props.accessToken}
        />
      ),
    },
    {
      label: "Inspectors Information",
      content: (
        <SelectInspectors
          apiURL={props.apiURL}
          RequestAccessToken={props.RequestAccessToken}
          accessToken={props.accessToken}
        />
      ),
    },
    {
      label: "Inspection Checklist",
      content: (
        <Inspection
          apiURL={props.apiURL}
          RequestAccessToken={props.RequestAccessToken}
          accessToken={props.accessToken}
          percentage={percentage}
          setPercentage={setPercentage}
        />
      ),
    },
  ];

  return (
    <Box p={5}>
      <Flex flexDir="column" width="100%">
        <Steps activeStep={activeStep}>
          {steps.map(({ label, content }) => (
            <Step label={label} key={label}>
              {content}
            </Step>
          ))}
        </Steps>
        {activeStep === steps.length ? (
          <Flex p={4}>
            <Button mx="auto" size="sm" onClick={reset}>
              Reset
            </Button>
          </Flex>
        ) : (
          <Flex width="100%" pt={5} justify="flex-end">
            {/* <Button
            isDisabled={activeStep === 0}
            mr={4}
            onClick={prevStep}
            size="sm"
            variant="ghost"
          >
            Prev
          </Button> */}
            <Button size="sm" onClick={nextStep} isDisabled={activeStep === steps.length - 1 && percentage !== 100}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
