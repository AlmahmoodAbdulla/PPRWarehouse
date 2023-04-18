import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react"

const ViolationCount = (props) => {
    console.log(props)
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Standard</Th>
          <Th>Number of Violations</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.data.map((row, index) => (
          <Tr key={index}>
            <Td whiteSpace="normal" wordBreak="normal">{row.standard}</Td>
            <Td>{row.numOfViolations}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default ViolationCount;