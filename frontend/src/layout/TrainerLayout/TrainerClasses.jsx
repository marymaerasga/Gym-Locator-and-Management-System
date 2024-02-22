import { useEffect, useState } from "react";
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
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getTrainerClasses } from "../../api/trainerApi/privateTrainerApi";
import { format } from "date-fns";
import convertTo12HourFormat from "../../utils/convertTo12HourFormat";

const TrainerClasses = () => {
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading, isError } = useQuery(
    "trainerClasses",
    async () => {
      return getTrainerClasses();
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

  useEffect(() => {
    setPosts(data);
  }, [data]);

  console.log(data);

  return (
    <Box padding="2rem">
      <Text color="brand.200" fontSize="2rem" marginBottom="1rem">
        Classes
      </Text>
      <TableContainer marginTop="2rem">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th whiteSpace="normal">Class Name</Th>
              <Th>Description</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Slots</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.length !== 0 && !isLoading ? (
              currentPosts?.map((item) => (
                <Tr key={item._id}>
                  <Td>{item.classname}</Td>
                  <Td whiteSpace="normal">{item.description}</Td>
                  <Td>{format(item.date, "MMMM d, yyyy")}</Td>
                  <Td>
                    {convertTo12HourFormat(item.starttime)} -{" "}
                    {convertTo12HourFormat(item.endtime)}
                  </Td>
                  <Td>{`${item.joinedMember.length}/${item.capacity}`}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td>n/a</Td>
              </Tr>
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

export default TrainerClasses;
