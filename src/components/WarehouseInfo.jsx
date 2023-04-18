import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Stack,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";
import "react-bootstrap-typeahead/css/Typeahead.css";
const WarehouseInfo = (props) => {
  const [pickerItemsData, setPickerItemsData] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);
  async function getData(accessToken) {
    try {
      const response = await axios.get(props.apiURL + "getPharmacyData", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const records = response.data.recordset;
      setData(records);
      const result = records.map((item) => {
        return {
          id: item.pharmacy_id,
          label: item.pharmacy_name,
        };
      });
      setPickerItemsData(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    props.RequestAccessToken();
    if (props.accessToken) {
      getData(props.accessToken);
    }
  }, [props.accessToken]);

  const handleWarehouseChange = (selected) => {
    setSelectedItem(selected);
    if (selected) {
      const results = data.filter((item) => item.pharmacy_id === selected.id);
      setResult(results);
      localStorage.setItem("selectedWarehouse", JSON.stringify(selected))
    } else {
      setResult([]);
    }
  };

  return (
    <Box p={10}>
      <Typeahead
        clearButton
        labelKey="label"
        id="warehouse-info"
        placeholder="Choose a warehouse..."
        onChange={(selected) => {
          handleWarehouseChange(selected[0]);
        }}
        options={pickerItemsData}
      />
      <Box mt={4}>
        { result.length > 0 &&
        <Card bg="#e2e8f0">
          <CardHeader>
            <Heading size="md">Warehouse Information</Heading>
          </CardHeader>
          <Divider color="#747e8d"/>
          <CardBody >
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              {result?.map((warehouse) => {
                return Object.keys(warehouse).map((key) => {
                  if (key === "pharmacy_id" || key === "status") {
                    return null;
                  }
                  return (
                    <GridItem key={key}>
                      <Heading size="xs" textTransform="uppercase">
                        {key.replace(/_/g, " ")}
                      </Heading>
                      <Text pt="2" pb="2" fontSize="sm">
                        {warehouse[key]}
                      </Text>
                    </GridItem>
                  );
                });
              })}
            </Grid>
          </CardBody>
        </Card>
}
      </Box>
    </Box>
  );
};

export default WarehouseInfo;
