import React, { useEffect, useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles//ag-grid.css";
import "ag-grid-community/styles//ag-theme-alpine.css";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import InspectionReport from "./InspectionReport";
import { PDFViewer } from "@react-pdf/renderer";

export default function DataGrid(props) {
  const [pdfData, setPdfData] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  async function openModal(params) {
    console.log(params);
    onOpen();
  }
  const columnDefs = [
    {
      headerName: "Inspection ID",
      field: "inspection_id",
      filter: true,
      resizable: true,
    },
    {
      headerName: "Violation",
      field: "violation",
      filter: true,
      resizable: true,
    },
    {
      headerName: "Pharmacy Name",
      field: "pharmacy_name",
      filter: true,
      resizable: true,
    },
    {
      headerName: "Created By",
      field: "created_by",
      filter: true,
      resizable: true,
    },
    { headerName: "Year", field: "year", filter: true, resizable: true },
    { headerName: "Month", field: "month", filter: true, resizable: true },
    { headerName: "Date", field: "date", filter: true, resizable: true },
    { headerName: "License_Number", field: "license_number", hide: true, },
    {
      headerName: "Print PDF",
      field: "print",
      cellRenderer: (params) => {
        return (
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => viewPDF(params.data)}
          >
            Print
          </Button>
        );
      },
    },
  ];

  function viewPDF(data) {
    console.log(props);
    setPdfData(data);
    onOpen();
  }
  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent style={{ width: "100%", height: "100%" }}>
          <ModalCloseButton />
          <ModalBody>
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <InspectionReport pdfData={pdfData} apiURL={props.apiURL}/>
            </PDFViewer>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div
        className="ag-theme-alpine"
        style={{ height: "75vh", width: "100%" }}
      >
        <AgGridReact
          rowData={props.data}
          columnDefs={columnDefs}
          animateRows={true}
          defaultColDef={defaultColDef}
        />
      </div>
    </>
  );
}
