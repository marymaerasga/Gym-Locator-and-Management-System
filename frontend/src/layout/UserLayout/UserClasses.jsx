import { useState, useEffect } from "react";
import {
  Text,
  Box,
  Flex,
  Button,
  Spinner,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getUserClasses,
  postUserJoinClass,
  postUserWithdrawClass,
} from "../../api/userApi/privateUserApi";
import formatDateToCustomFormat from "../../utils/formatDateToCustomFormat";
import convertTo12HourFormat from "../../utils/convertTo12HourFormat";
import combineDateAndTime from "../../utils/combineDateAndTime";
import TokenService from "../../services/token";

const UserClasses = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const { data, isLoading, isError } = useQuery(
    "userClasses",
    async () => {
      return getUserClasses();
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

  const userWithdrawClassMutation = useMutation(
    async (formData) => {
      return postUserWithdrawClass(formData);
    },
    {
      onSuccess: (data) => {
        toast({
          title: data?.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("userClasses");
      },
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

  const userJoinClassMutation = useMutation(
    async (formData) => {
      return postUserJoinClass(formData);
    },
    {
      onSuccess: (data) => {
        toast({
          title: data?.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("userClasses");
      },
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

  const handleJoinNow = (classItem) => {
    userJoinClassMutation.mutate(classItem._id);
  };

  const handleWithdrawClass = (classItem) => {
    userWithdrawClassMutation.mutate(classItem._id);
  };

  useEffect(() => {
    setPosts(data);
  }, [data]);

  console.log(data);

  return (
    <Box padding="2rem">
      <Text color="brand.200" fontSize="2rem" marginBottom="2rem">
        Classes
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Gym Name</Th>
              <Th>Class Name</Th>
              <Th>Trainer</Th>
              <Th>Schedule</Th>
              <Th>Slots</Th>
              <Th>Status/Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* !isLoading ? ( */}
            {data?.length !== 0 && !isLoading ? (
              currentPosts?.map((item) => (
                <Tr key={item._id}>
                  <Td whiteSpace="normal">{item.gymname}</Td>
                  <Td whiteSpace="normal">{item.classname}</Td>
                  <Td whiteSpace="normal">{item.instructor}</Td>
                  <Td
                    whiteSpace="normal"
                    display="flex"
                    flexDir="column"
                    gap="5px"
                  >
                    <Text>{formatDateToCustomFormat(item.date)}</Text>
                    <Text>
                      {convertTo12HourFormat(item.starttime)} -{" "}
                      {convertTo12HourFormat(item.endtime)}
                    </Text>
                  </Td>
                  <Td>{`${item.joinedMember.length}/${item.capacity}`}</Td>
                  <Td display="flex">
                    {new Date() >
                    combineDateAndTime(item.date, item.endtime) ? (
                      "Ended"
                    ) : new Date() <
                        combineDateAndTime(item.date, item.endtime) &&
                      new Date() >
                        combineDateAndTime(item.date, item.starttime) ? (
                      "Ongoing"
                    ) : item.joinedMember.includes(
                        JSON.parse(TokenService.getUserLocal())._id
                      ) ? (
                      <Button
                        bgColor="red"
                        color="neutral.100"
                        _hover={{ color: "red", bgColor: "gray.200" }}
                        onClick={() => handleWithdrawClass(item)}
                        isLoading={userWithdrawClassMutation.isLoading}
                      >
                        Withdraw
                      </Button>
                    ) : (
                      <Button
                        bgColor="brand.100"
                        color="neutral.100"
                        _hover={{ color: "brand.100", bgColor: "gray.200" }}
                        onClick={() => handleJoinNow(item)}
                        isLoading={userJoinClassMutation.isLoading}
                      >
                        Join Now
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="6" textAlign="center">
                  n/a
                </Td>
              </Tr>
            )}
            {/* ) : (
              <Spinner mt="1rem" ml="1rem" size="lg" />
            ) */}
          </Tbody>
        </Table>
      </TableContainer>
      {posts?.length !== 0 && !isLoading ? (
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

export default UserClasses;
