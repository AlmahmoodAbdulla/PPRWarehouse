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
export default function WarehouseRectifiedViolationsDrawer(props) {
  return (
    <div>
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
    </div>
  )
}
