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

import formatDateToCustomFormat from "../../utils/formatDateToCustomFormat";
import TokenService from "../../services/token";
import StarRating from "../../components/StarRating/StarRating";
import ReviewStarRating from "../../components/StarRating/ReviewStarRating";
import {
  getUserReviews,
  submitUserReview,
} from "../../api/userApi/privateUserApi";

const UserReviews = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const [selectedReview, setSelectedReview] = useState(null);

  const {
    isOpen: isGymReviewOpen,
    onOpen: openGymReview,
    onClose: closeGymReview,
  } = useDisclosure();

  const { data, isLoading, isError } = useQuery(
    "userReviews",
    async () => {
      return getUserReviews();
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

  const submitReviewMutation = useMutation(
    async (formData) => {
      return submitUserReview(formData.gymId, formData.rating);
    },
    {
      onSuccess: (data) => {
        handleCloseReview();

        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("userReviews");
      },
      onError: (error) => {
        handleCloseReview();
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
    }
  );

  const handleOpenReview = (item) => {
    setSelectedReview(item);
    openGymReview();
  };

  const handleSubmitReview = () => {
    submitReviewMutation.mutate({ gymId: selectedReview._id, rating: rating });
  };

  const handleCloseReview = () => {
    setRating(0);
    closeGymReview();
  };

  useEffect(() => {
    setPosts(data);
  }, [data]);

  // console.log(data);

  return (
    <Box padding="2rem">
      {/* Review Modal*/}

      <Modal isOpen={isGymReviewOpen} onClose={handleCloseReview}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Review {selectedReview?.gymname}</ModalHeader>
          <ModalCloseButton />
          <ModalBody py="2rem">
            <ReviewStarRating rating={rating} setRating={setRating} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleCloseReview}>
              Cancel
            </Button>
            <Button
              bgColor="brand.100"
              color="neutral.100"
              onClick={handleSubmitReview}
              isLoading={submitReviewMutation.isLoading}
            >
              Give a Review
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Text color="brand.200" fontSize="2rem" marginBottom="2rem">
        Reviews
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Gym Name</Th>
              <Th>Star</Th>
              <Th>Review Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!isLoading ? (
              data?.length !== 0 ? (
                currentPosts?.map((item) => (
                  <Tr key={item._id}>
                    <Td>{item.gymname}</Td>
                    <Td>
                      <Box display="inline-block">
                        <StarRating rating={item.rating} />
                      </Box>
                    </Td>
                    <Td>
                      {!item.status ? (
                        <Button onClick={() => handleOpenReview(item)}>
                          Review
                        </Button>
                      ) : (
                        <Text>Finished</Text>
                      )}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td textAlign="center" colSpan="3">
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

export default UserReviews;
