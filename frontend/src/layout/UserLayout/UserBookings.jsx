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

const UserBookings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box padding="2rem">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Booking</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box marginBottom="1rem">
              <Text>Gym Name</Text>
              <Select placeholder="Select GYM">
                <option value="option1">Dolby Fitness</option>
                <option value="option2">Gold's Gym</option>
                <option value="option3">Anytime Fitness</option>
              </Select>
            </Box>
            <Box marginBottom="1rem">
              <Text>Trainer</Text>
              <Select placeholder="Select Trainer">
                <option value="option1">Larry Wheels</option>
                <option value="option2">Arnold Schwarzenegger</option>
              </Select>
            </Box>
            <Box>
              <Text>Date and Time</Text>
              <Input type="datetime-local" />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button bgColor="brand.100" color="neutral.100">
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Text color="brand.200" fontSize="2rem" marginBottom="2rem">
        Booking Appointment
      </Text>
      <Button
        color="neutral.100"
        bgColor="brand.100"
        marginBottom="2rem"
        onClick={onOpen}
      >
        Add Appointment
      </Button>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Gym Name</Th>
              <Th>Date and Time</Th>
              <Th>Trainer</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td whiteSpace="normal">Dolby Fitness</Td>
              <Td>2023/12/20 - 9:00am</Td>
              <Td>Trainer</Td>
              <Td>
                <Button
                  bgColor="brand.100"
                  color="neutral.100"
                  _hover={{ color: "brand.100", bgColor: "gray.200" }}
                  marginRight="0.5rem"
                >
                  Details
                </Button>
                <Button
                  bgColor="red"
                  color="neutral.100"
                  _hover={{ color: "red", bgColor: "gray.200" }}
                >
                  Cancel
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserBookings;
