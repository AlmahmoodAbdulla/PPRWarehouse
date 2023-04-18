import React, {useState, useEffect} from 'react'
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import axios from 'axios'
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
export default function SelectInspectors(props) {
    const [data, setData] = useState([]);
    const [pickerItemsData, setPickerItemsData] = useState([]);
    const [selectedItem, setSelectedItem] = useState();
    async function getData(accessToken) {
        try {
          const response = await axios.get(props.apiURL + "getInspectors", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          console.log(response)
          const records = response.data.recordset;
          setData(records);
          const result = records.map((item) => {
            return {
              id: item.inspector_id,
              label: item.inspector_name,
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
      const handleInspectorChange = (selected) => {
        setSelectedItem(selected)
        if (selected) {
            localStorage.setItem("selectedInspectors", JSON.stringify(selected))
        }
      };
  return (
    <Box p={10}>
        <Typeahead
        multiple
        clearButton
        labelKey="label"
        id="inspectors-info"
        placeholder="Choose inspectors..."
        onChange={(selected) => {
            handleInspectorChange(selected);
        }}
        options={pickerItemsData}
      />
    </Box>
  )
}
