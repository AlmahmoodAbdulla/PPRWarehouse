import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Input,
  Flex,
  Button,
  IconButton,
  useBreakpointValue,
  Spacer,
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Bars } from "react-loading-icons";
export default function RectifyViolation(props) {
  const [data, setData] = useState([]);
  const [violationData, setViolationData] = useState([]);
  const [rectifiedViolationData, setRectifiedViolationData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isRectifiedOpen,
    onOpen: onRectifiedOpen,
    onClose: onRectifiedClose,
  } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = useBreakpointValue({ base: 5, md: 10, lg: 15 });
  const [loading, setLoading] = useState(false);
  const [inspID, setInspID] = useState();
  const filteredData = data.filter((item) =>
    item.pharmacy_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pageCount = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  useEffect(() => {
    props.RequestAccessToken();
    if (props.accessToken != null) {
      axios
        .get(props.apiURL + "getAllInspections", {
          headers: { Authorization: `Bearer ${props.accessToken}` },
        })
        .then((response) => {
          setData(response.data.recordset);
        });
    }
  }, [, props.accessToken]);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) setCurrentPage(currentPage + 1);
  };

  const handleViewViolations = async (inspectionId) => {
    setInspID(inspectionId);
    setLoading(!loading);
    props.RequestAccessToken();
    if (props.accessToken != null) {
      await axios
        .get(props.apiURL + "getWarehouseViolation", {
          headers: {
            Authorization: `Bearer ${props.accessToken}`,
            inspID: inspectionId,
          },
        })
        .then((response) => {
          setViolationData(response.data.recordset);
          onOpen();
          setLoading(false);
        });
    } else {
      handleViewViolations(inspectionId);
      setLoading(false);
    }
  };

  const handleViewRectified = async (inspectionId) => {
    setInspID(inspectionId);
    props.RequestAccessToken();
    if (props.accessToken != null) {
      await axios
        .get(props.apiURL + "getWarehouseRectifiedViolation", {
          headers: {
            Authorization: `Bearer ${props.accessToken}`,
            inspID: inspectionId,
          },
        })
        .then((response) => {
          setRectifiedViolationData(response.data.recordset);
          onRectifiedOpen();
        });
    } else {
      handleViewRectified(inspectionId);
    }
  };

  async function handleRectifyClick(params) {
    props.RequestAccessToken();
    if (props.accessToken != null) {
      await axios
        .post(
          props.apiURL + "rectifyViolation",
          { checkListID: params },
          {
            headers: {
              Authorization: `Bearer ${props.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.status == 200) {
            handleViewViolations(inspID);
          }
        });
    } else {
      handleRectifyClick(params);
    }
  }

  function CompliantStatus(props) {
    const { status } = props;
    const badgeColor = status === "Partially Compliant" ? "yellow" : "red";
    return <Badge colorScheme={badgeColor}>{status}</Badge>;
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="full"
        drawerStyle={{ background: "red" }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Inspection ID</Th>
                  <Th>Standard ID</Th>
                  <Th>Standard</Th>
                  <Th>Compliant Status</Th>
                  <Th>Memo</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {violationData.map((data, index) => (
                  <Tr key={index}>
                    <Td>{data.inspection_id}</Td>
                    <Td>{data.standard_id}</Td>
                    <Td>{data.standard}</Td>
                    <Td>
                      <CompliantStatus status={data.compliant_status} />
                    </Td>
                    <Td>{data.memo}</Td>
                    <Td>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={(e) =>
                          handleRectifyClick(data.inspection_check_list_id)
                        }
                      >
                        Rectify
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer
        isOpen={isRectifiedOpen}
        placement="left"
        onClose={onRectifiedClose}
        size="full"
        drawerStyle={{ background: "red" }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Inspection ID</Th>
                  <Th>Standard ID</Th>
                  <Th>Standard</Th>
                  <Th>Compliant Status</Th>
                  <Th>Memo</Th>
                  <Th>Rectification Date</Th>
                  <Th>Rectified by</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rectifiedViolationData.map((data, index) => (
                  <Tr key={index}>
                    <Td>{data.inspection_id}</Td>
                    <Td>{data.standard_id}</Td>
                    <Td>{data.standard}</Td>
                    <Td>
                      <CompliantStatus status={data.compliant_status} />
                    </Td>
                    <Td>{data.memo}</Td>
                    <Td>
                      {data.rectification_date}
                    </Td>
                    <Td>{data.rectified_by}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onRectifiedClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Flex direction="row" justify="space-between" align="center" p={5}>
        <Box width="89vw">
          <Input
            placeholder="Search by pharmacy name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        <Spacer />
        <Box>
          <Text>
            Showing {pageData.length} of {filteredData.length} results
          </Text>
        </Box>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Pharmacy Name</Th>
            <Th>Inspection Date</Th>
            <Th>Violation Count</Th>
            <Th>Rectified Violations</Th>
            <Th>Created By</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pageData.map((item) => (
            <Tr key={item.inspection_id}>
              <Td>{item.pharmacy_name}</Td>
              <Td>{new Date(item.date).toLocaleDateString()}</Td>
              <Td>{item.violation}</Td>
              <Td>{item.rectified}</Td>
              <Td>{item.created_by}</Td>
              <Td>
                {inspID == item.inspection_id && loading ? (
                  "Loading..."
                ) : (
                  <Button
                    id={item.inspection_id}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleViewViolations(item.inspection_id)}
                  >
                    View Violations
                  </Button>
                )}
              </Td>
              <Td>
                <Button
                  id={item.inspection_id}
                  size="sm"
                  colorScheme="green"
                  isDisabled={item.rectified == 0? true: false}
                  onClick={() => handleViewRectified(item.inspection_id)}
                >
                  View Rectified
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {pageCount > 1 && (
        <Flex direction="row" justify="space-between" align="center" mt={4}>
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            leftIcon={<ChevronLeftIcon />}
          >
            Previous
          </Button>
          <Text>
            Page {currentPage} of {pageCount}
          </Text>
          <IconButton
            variant="outline"
            disabled={currentPage === pageCount}
            onClick={handleNextPage}
            icon={<ChevronRightIcon />}
          />
        </Flex>
      )}
    </>
  );
}
