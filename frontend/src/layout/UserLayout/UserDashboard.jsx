import React from "react";
import {
  Text,
  Box,
  Flex,
  Button,
  Input,
  Tr,
  Td,
  Table,
  TableContainer,
  Thead,
  Th,
  Tbody,
} from "@chakra-ui/react";
import TokenService from "../../services/token";

const userInfo = JSON.parse(TokenService.getUserLocal());

const UserDashboard = () => {
  return (
    <Box padding="2rem">
      <Text color="brand.200" fontSize="2rem" marginBottom="1rem">
        Good day,{" "}
        <Text as="span" color="brand.100">
          {userInfo?.firstname} {userInfo?.lastname}
        </Text>
      </Text>
      <Text fontSize="1.5rem" marginBottom="0.5rem">
        Welcome to Personal Dashboard
      </Text>

      <Box marginBlock="2rem">
        <Text fontSize="1.2rem">Booking Schedule</Text>
        <Flex marginBlock="1rem" gap="1.5rem">
          <TableContainer>
            <Table>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Trainer</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>2023-11-25</Td>
                  <Td>Tristan Chiu</Td>
                  <Td>Pending</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Box
            maxWidth="25rem"
            border=" 1px solid"
            borderColor="gray.400"
            padding="7px 10px"
          >
            <Text>Gym Announcements</Text>
            <Text whiteSpace="normal">
              Stay updated with the latest announcements and news from our gym
            </Text>
            <Text
              color="brand.100"
              cursor="pointer"
              _hover={{ color: "green" }}
            >
              View All
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default UserDashboard;
