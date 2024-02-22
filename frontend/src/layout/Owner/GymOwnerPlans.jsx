import { useState, useEffect } from "react";
import {
  Text,
  Box,
  Flex,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  TableContainer,
  Td,
  Th,
  Thead,
  Tr,
  Tbody,
  Modal,
  Stack,
  Spinner,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getGymPlans,
  addGymPlans,
  updateGymPlans,
  deleteGymPlan,
} from "../../api/ownerApi/privateOwnerApi";

const GymOwnerPlans = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDeletePlan, setSelectedDeletePlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    planName: "",
    duration: 0,
    amount: 0,
  });

  const {
    isOpen: isAddPlanOpen,
    onOpen: openAddPlan,
    onClose: closeAddPlan,
  } = useDisclosure();
  const {
    isOpen: isEditPlanOpen,
    onOpen: openEditPlan,
    onClose: closeEditPlan,
  } = useDisclosure();
  const {
    isOpen: isDeletePlanOpen,
    onOpen: openDeletePlan,
    onClose: closeDeletePlan,
  } = useDisclosure();

  const { data, isLoading, isError } = useQuery(
    "planData",
    async () => {
      return getGymPlans();
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

  const addGymPlanMutation = useMutation(
    async (formData) => {
      return addGymPlans(formData.planName, formData.duration, formData.amount);
    },
    {
      onSuccess: (data) => {
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("planData");
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

  const updateGymPlanMutation = useMutation(
    async (formData) => {
      return updateGymPlans(
        formData._id,
        formData.planName,
        formData.duration,
        formData.amount
      );
    },
    {
      onSuccess: (data) => {
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("planData");
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

  const deleteGymPlanMutation = useMutation(
    async (formData) => {
      return deleteGymPlan(formData._id);
    },
    {
      onSuccess: (data) => {
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("planData");
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

  const handleSubmitNewPlan = () => {
    addGymPlanMutation.mutate(newPlan);
    setNewPlan({
      planName: "",
      duration: 0,
      amount: 0,
    });
    closeAddPlan();
  };

  const handleCloseAddPlan = () => {
    setNewPlan({
      planName: "",
      duration: 0,
      amount: 0,
    });
    closeAddPlan();
  };

  const handleOpenEdit = (plan) => {
    setSelectedPlan(plan);
    openEditPlan();
  };

  const handleSaveEdit = () => {
    updateGymPlanMutation.mutate(selectedPlan);
    setSelectedPlan(null);
    closeEditPlan();
  };

  const handleCloseEdit = () => {
    setSelectedPlan(null);
    closeEditPlan();
    // Reset the edited data to the original data or fetch from your backend
  };

  const handleOpenDelete = (plan) => {
    setSelectedDeletePlan(plan);
    openDeletePlan();
  };

  const handleDeletePlan = () => {
    deleteGymPlanMutation.mutate(selectedDeletePlan);
    setSelectedDeletePlan(null);
    closeDeletePlan();
  };

  const handleCloseDelete = () => {
    setSelectedDeletePlan(null);
    closeDeletePlan();
    // Reset the edited data to the original data or fetch from your backend
  };

  useEffect(() => {
    setPosts(data);
  }, [data]);

  return (
    <Box padding="2rem">
      <Modal isOpen={isAddPlanOpen} onClose={handleCloseAddPlan}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Add Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">Plan Name</Text>
                <Input
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      planName: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Plan Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Duration (in days)</Text>
                <Input
                  onChange={(e) =>
                    setNewPlan({
                      ...newPlan,
                      duration: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    // Allow numeric characters, the dot (.), Tab key, and the Backspace key
                    const isNumeric =
                      /^[0-9.]$/.test(e.key) ||
                      e.key === "Backspace" ||
                      e.key === "Tab";

                    // Allow only one dot in the input
                    const hasDot = e.target.value.includes(".");
                    if (e.key === "." && hasDot) {
                      e.preventDefault();
                    }

                    // Prevent non-numeric characters
                    if (!isNumeric) {
                      e.preventDefault();
                    }
                  }}
                  type="text"
                  placeholder="Duration"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Amount</Text>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.400"
                    fontSize="1.2em"
                  >
                    ₱
                  </InputLeftElement>
                  <Input
                    onChange={(e) =>
                      setNewPlan({
                        ...newPlan,
                        amount: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      // Allow numeric characters, the dot (.), Tab key, and the Backspace key
                      const isNumeric =
                        /^[0-9.]$/.test(e.key) ||
                        e.key === "Backspace" ||
                        e.key === "Tab";

                      // Allow only one dot in the input
                      const hasDot = e.target.value.includes(".");
                      if (e.key === "." && hasDot) {
                        e.preventDefault();
                      }

                      // Prevent non-numeric characters
                      if (!isNumeric) {
                        e.preventDefault();
                      }
                    }}
                    type="text"
                    placeholder="Amount"
                  />
                </InputGroup>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseAddPlan}>
              Close
            </Button>
            <Button
              bgColor="brand.100"
              color="neutral.100"
              onClick={handleSubmitNewPlan}
            >
              Add Plan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Plan */}

      <Modal isOpen={isEditPlanOpen} onClose={handleCloseEdit}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Edit Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">Plan Name</Text>
                <Input
                  value={selectedPlan?.planName}
                  onChange={(e) =>
                    setSelectedPlan({
                      ...selectedPlan,
                      planName: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Plan Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Duration (in days)</Text>
                <Input
                  value={selectedPlan?.duration}
                  onChange={(e) =>
                    setSelectedPlan({
                      ...selectedPlan,
                      duration: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    // Allow numeric characters, the dot (.), Tab key, and the Backspace key
                    const isNumeric =
                      /^[0-9.]$/.test(e.key) ||
                      e.key === "Backspace" ||
                      e.key === "Tab";

                    // Allow only one dot in the input
                    const hasDot = e.target.value.includes(".");
                    if (e.key === "." && hasDot) {
                      e.preventDefault();
                    }

                    // Prevent non-numeric characters
                    if (!isNumeric) {
                      e.preventDefault();
                    }
                  }}
                  type="text"
                  placeholder="Duration"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Amount</Text>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.400"
                    fontSize="1.2em"
                  >
                    ₱
                  </InputLeftElement>
                  <Input
                    value={selectedPlan?.amount}
                    onChange={(e) =>
                      setSelectedPlan({
                        ...selectedPlan,
                        amount: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      // Allow numeric characters, the dot (.), Tab key, and the Backspace key
                      const isNumeric =
                        /^[0-9.]$/.test(e.key) ||
                        e.key === "Backspace" ||
                        e.key === "Tab";

                      // Allow only one dot in the input
                      const hasDot = e.target.value.includes(".");
                      if (e.key === "." && hasDot) {
                        e.preventDefault();
                      }

                      // Prevent non-numeric characters
                      if (!isNumeric) {
                        e.preventDefault();
                      }
                    }}
                    type="text"
                    placeholder="Amount"
                  />
                </InputGroup>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseEdit}>
              Close
            </Button>
            <Button
              bgColor="brand.100"
              color="neutral.100"
              onClick={handleSaveEdit}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Plan */}

      <Modal isOpen={isDeletePlanOpen} onClose={handleCloseDelete}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Delete Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete {selectedDeletePlan?.planName}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleCloseDelete}>
              No
            </Button>
            <Button
              bgColor="red"
              color="neutral.100"
              onClick={handleDeletePlan}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Text color="brand.200" fontSize="2rem" marginBottom="1rem">
        Plans
      </Text>
      <Button
        bgColor="brand.100"
        color="neutral.100"
        isLoading={addGymPlanMutation.isLoading}
        onClick={openAddPlan}
      >
        Add Plan
      </Button>

      <Box>
        {isLoading ? (
          <Spinner size="lg" mt="4rem" />
        ) : (
          <TableContainer marginTop="2rem">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th whiteSpace="normal">Plan Name</Th>
                  <Th>Duration (in days)</Th>
                  <Th>Amount</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.length === 0 ? (
                  <Tr>
                    <Td textAlign="center" colSpan="4">
                      n/a
                    </Td>
                  </Tr>
                ) : (
                  currentPosts?.map((item) => (
                    <Tr key={item._id}>
                      <Td whiteSpace="normal">{item.planName}</Td>
                      <Td whiteSpace="normal">{item.duration}</Td>
                      <Td whiteSpace="normal">
                        {item.amount.toLocaleString("en-PH", {
                          style: "currency",
                          currency: "PHP",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Td>

                      <Td display="flex" gap="0.5rem">
                        <Button
                          bgColor="blue"
                          color="neutral.100"
                          onClick={() => handleOpenEdit(item)}
                          isLoading={
                            updateGymPlanMutation.isLoading &&
                            updateGymPlanMutation.variables?._id === item._id
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          bgColor="red"
                          color="white"
                          onClick={() => handleOpenDelete(item)}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}
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
              isDisabled={
                currentPage === Math.ceil(data?.length / itemsPerPage)
              }
              onClick={() => {
                if (currentPage !== posts.length)
                  setCurrentPage(currentPage + 1);
              }}
            >
              Next
            </Button>
          </Flex>
        ) : null}
      </Box>
    </Box>
  );
};

export default GymOwnerPlans;
