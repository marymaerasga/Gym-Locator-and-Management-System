import React from "react";
import {
  Text,
  Box,
  Flex,
  Button,
  Input,
  Select,
  Td,
  Th,
  Tr,
  Thead,
  Tbody,
  Table,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const TrainerBookings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box padding="2rem">
      <Text color="brand.200" fontSize="2rem" marginBottom="1rem">
        Booking
      </Text>
      <Box border="1px solid" borderColor="gray.200" padding="1rem">
        <Text fontSize="1.2rem">Booking Requests</Text>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Client</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>2023/12/20 - 9:00am</Td>
                <Td>Mae Erasga</Td>
                <Td>Pending</Td>
                <Td>
                  <Button
                    bgColor="brand.100"
                    color="neutral.100"
                    _hover={{ color: "brand.100", bgColor: "gray.200" }}
                    marginRight="0.5rem"
                  >
                    Accept
                  </Button>
                  <Button
                    bgColor="red"
                    color="neutral.100"
                    _hover={{ color: "red", bgColor: "gray.200" }}
                  >
                    Reject
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TrainerBookings;
