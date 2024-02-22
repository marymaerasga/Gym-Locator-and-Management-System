import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Spinner,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  TableContainer,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getUserSubscription,
  // updateUserSub,
} from "../../api/userApi/privateUserApi";
import formatDateToCustomFormat from "../../utils/formatDateToCustomFormat";
import TokenService from "../../services/token";

const UserSubscriptions = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const [selectedSub, setSelectedSub] = useState(null);

  const {
    isOpen: isCancelSubOpen,
    onOpen: openCancelSub,
    onClose: closeCancelSub,
  } = useDisclosure();

  const { data, isLoading, isError } = useQuery(
    "userSubscription",
    async () => {
      return getUserSubscription();
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

  // const updateUserSubMutation = useMutation(
  //   async (formData) => {
  //     return updateUserSub(formData.gymId, formData.userId);
  //   },
  //   {
  //     onSuccess: (data) => {
  //       console.log(data);
  //       toast({
  //         title: data.message,
  //         status: "success",
  //         duration: 2000,
  //         position: "bottom-right",
  //       });

  //       // Invalidate and refetch any queries that depend on the user data
  //       queryClient.invalidateQueries("userSubscription");
  //     },
  //     onError: (error) => {
  //       toast({
  //         title: error.response.data.error || "Something went wrong",
  //         status: "error",
  //         duration: 2000,
  //         position: "bottom-right",
  //       });
  //     },
  //   }
  // );

  // const handleOpenSub = (subscription) => {
  //   setSelectedSub(subscription);
  //   openCancelSub();
  // };

  // const handleCancelSub = () => {
  //   updateUserSubMutation.mutate({
  //     gymId: selectedSub?.gym.ownerId,
  //     userId: JSON.parse(TokenService.getUserLocal())._id,
  //   });

  //   // setSelectedSub(null);
  //   // closeCancelSub();
  // };

  // const handleCloseSub = () => {
  //   setSelectedSub(null);
  //   closeCancelSub();
  //   // Reset the edited data to the original data or fetch from your backend
  // };

  useEffect(() => {
    setPosts(data);
  }, [data]);

  return (
    <Box padding="2rem">
      {/* Cancel Sub Modal*/}

      {/* <Modal isOpen={isCancelSubOpen} onClose={handleCloseSub}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Cancel Subscription</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to cancel subscription in{" "}
              <Text as="span" fontWeight="bold">
                {selectedSub?.gym.gymname}
              </Text>
              ?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleCloseSub}>
              No
            </Button>
            <Button bgColor="red" color="neutral.100" onClick={handleCancelSub}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}

      <Text color="brand.200" fontSize="2rem" marginBottom="2rem">
        Subscriptions
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Gym Name</Th>
              <Th>End Date</Th>
              <Th>Plan</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!isLoading ? (
              data?.length !== 0 && !isLoading ? (
                currentPosts?.map((item) => (
                  <Tr key={item._id}>
                    <Td whiteSpace="normal">{item.gym.gymname}</Td>
                    <Td>
                      {item.myPlan.endTime !== null
                        ? formatDateToCustomFormat(item.myPlan.endTime)
                        : "n/a"}
                    </Td>

                    <Td>{item.myPlan.planName}</Td>
                    <Td
                      color={
                        item.myPlan.planStatus === "active"
                          ? "brand.100"
                          : item.myPlan.planStatus === "pending"
                          ? "yellow.500"
                          : item.myPlan.planStatus === "expired"
                          ? "black"
                          : item.myPlan.planStatus === "rejected"
                          ? "red"
                          : null
                      }
                      fontWeight="bold"
                    >
                      {item.myPlan.planStatus}
                    </Td>
                    <Td>n/a</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="5" textAlign="center">
                    n/a
                  </Td>
                </Tr>
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

export default UserSubscriptions;
