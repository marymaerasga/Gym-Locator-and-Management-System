import { useState, useEffect } from "react";
import {
  Text,
  Box,
  Flex,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Spinner,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  TableContainer,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getUserAnnouncements } from "../../api/userApi/privateUserApi";
import formatDateToCustomFormat from "../../utils/formatDateToCustomFormat";
import convertTo12HourFormat from "../../utils/convertTo12HourFormat";
import { formattedTime } from "../../utils/convertToAmericanTime";
import { format, parseISO } from "date-fns";

const UserAnnouncements = () => {
  const toast = useToast();
  const [selectedItem, setSelectedItem] = useState(null);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const {
    isOpen: isSelectedItemOpen,
    onOpen: openSelectedItem,
    onClose: closeSelectedItem,
  } = useDisclosure();

  const { data, isLoading, isError } = useQuery(
    "userAnnouncements",
    async () => {
      return getUserAnnouncements();
    },
    {
      refetchOnWindowFocus: false,
      onError: (error) => {
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
    }
  );

  const handleOpenItem = (item) => {
    setSelectedItem(item);
    openSelectedItem();
  };

  const handleCloseItem = () => {
    setSelectedItem(null);
    closeSelectedItem();
  };

  useEffect(() => {
    setPosts(data);
  }, [data]);

  return (
    <Box padding="2rem">
      {/* Show Gym Announcement Modal */}

      <Modal isOpen={isSelectedItemOpen} onClose={handleCloseItem}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>{selectedItem?.gymname}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{selectedItem?.announcement}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleCloseItem}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Text color="brand.200" fontSize="2rem" marginBottom="2rem">
        Announcements
      </Text>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Gym Name</Th>
              <Th>Announcement</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!isLoading ? (
              data?.length !== 0 ? (
                currentPosts?.map((item) => (
                  <Tr
                    key={item._id}
                    _hover={{ bgColor: "gray.300" }}
                    cursor="pointer"
                    onClick={() => handleOpenItem(item)}
                  >
                    <Td whiteSpace="normal">{item.gymname}</Td>
                    <Td whiteSpace="normal">
                      {item.announcement.length > 20
                        ? item.announcement.slice(0, 20).concat("...")
                        : item.announcement}
                    </Td>
                    <Td>{`${formatDateToCustomFormat(
                      item.createdAt
                    )} - ${format(parseISO(item.createdAt), "h:mm a")}`}</Td>
                  </Tr>
                ))
              ) : (
                <Td colSpan="3" textAlign="center">
                  n/a
                </Td>
              )
            ) : (
              <Spinner mt="1rem" ml="1rem" size="lg" />
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {data?.length !== 0 && !isLoading ? (
        <Flex
          alignItems="center"
          gap={5}
          mt={5}
          justifyContent="center"
          mr={10}
        >
          <Button
            isDisabled={currentPage === 1}
            onClick={() => {
              if (currentPage !== 1) setCurrentPage(currentPage - 1);
            }}
          >
            Previous
          </Button>
          {currentPage} of {Math.ceil(data?.length / itemsPerPage)}
          <Button
            isDisabled={currentPage === Math.ceil(data?.length / itemsPerPage)}
            onClick={() => {
              if (currentPage !== posts.length) setCurrentPage(currentPage + 1);
            }}
          >
            Next
          </Button>
        </Flex>
      ) : null}
    </Box>
  );
};

export default UserAnnouncements;
