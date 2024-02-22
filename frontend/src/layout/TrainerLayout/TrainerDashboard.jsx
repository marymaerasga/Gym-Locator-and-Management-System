import React from "react";
import {
  Text,
  Box,
  Flex,
  Button,
  Icon,
  Input,
  Tr,
  Td,
  Table,
  TableContainer,
  Thead,
  Th,
  Tbody,
} from "@chakra-ui/react";
import { MdPeopleAlt } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { MdOutlinePendingActions } from "react-icons/md";

const TrainerDashboard = () => {
  return (
    <Box padding="2rem">
      <Text color="brand.200" fontSize="2rem" marginBottom="1rem">
        Good day,{" "}
        <Text as="span" color="brand.100">
          Erasga Mae
        </Text>
      </Text>
      <Text fontSize="1.5rem" marginBottom="0.5rem">
        Welcome to Personal Trainer Dashboard
      </Text>

      <Flex gap="10px" marginBlock="2rem">
        <Flex
          height="60px"
          width="260px"
          border="1px solid"
          borderColor="gray.400"
          boxShadow="rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px"
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="center">APPOINTMENTS</Box>
          <Icon
            as={MdPeopleAlt}
            color="gray"
            fontSize="2.5rem"
            marginInline="2rem"
          />
        </Flex>
        <Flex
          height="60px"
          width="260px"
          border="1px solid"
          borderColor="gray.400"
          boxShadow="rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px"
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="center">CLIENTS</Box>
          <Icon
            as={IoPerson}
            color="gray"
            fontSize="2.5rem"
            marginInline="2rem"
          />
        </Flex>
        <Flex
          height="60px"
          width="260px"
          border="1px solid"
          borderColor="gray.400"
          boxShadow="rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px"
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="center">PENDING REQUESTS</Box>
          <Icon
            as={MdOutlinePendingActions}
            color="gray"
            fontSize="2.5rem"
            marginInline="2rem"
          />
        </Flex>
      </Flex>

      <Flex justifyContent="end">
        <Button bgColor="brand.100" color="neutral.100">
          Generate Report
        </Button>
      </Flex>

      <Box
        marginBlock="2rem"
        padding="0.8rem"
        border="1px solid"
        borderColor="gray.200"
      >
        <Text fontSize="1.2rem">Upcoming Appointments</Text>
        <Flex marginBlock="1rem" gap="1.5rem">
          <TableContainer width="full">
            <Table>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Client</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>2023-11-25</Td>
                  <Td>Tristan Chiu</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Box>

      <Box
        marginBlock="2rem"
        padding="1rem"
        border="1px solid"
        borderColor="gray.200"
      >
        <Text fontSize="1.2rem">Client Lists</Text>
        <Flex marginBlock="1rem" gap="1.5rem">
          <TableContainer width="full">
            <Table>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Contact Number</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Enzo Garcia</Td>
                  <Td>09915684267</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Box>
    </Box>
  );
};

export default TrainerDashboard;
