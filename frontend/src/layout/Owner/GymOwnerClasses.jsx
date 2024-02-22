import { useEffect, useState } from "react";
import {
  Text,
  Box,
  Flex,
  Button,
  Input,
  Textarea,
  Table,
  TableContainer,
  Td,
  Th,
  Thead,
  Tr,
  Tbody,
  Modal,
  Select,
  Stack,
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
  getGymTrainers,
  getGymClasses,
  addGymClass,
  updateGymClass,
  deleteGymClass,
} from "../../api/ownerApi/privateOwnerApi";
import convertTo12HourFormat from "../../utils/convertTo12HourFormat";
import { format, parseISO } from "date-fns";

const GymOwnerClasses = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDeleteClass, setSelectedDeleteClass] = useState(null);
  const [listOfTrainers, setListOfTrainers] = useState([]);
  const [newClass, setNewClass] = useState({
    classname: "",
    instructor: "",
    instructorId: "",
    date: "",
    starttime: "",
    endtime: "",
    capacity: "",
    description: "",
    equipment: "",
  });

  const parsedDate = parseISO(selectedClass?.date ?? "2001-01-01");
  const defaultDate = format(parsedDate, "yyyy-MM-dd");

  const {
    isOpen: isAddClassOpen,
    onOpen: openAddClass,
    onClose: closeAddClass,
  } = useDisclosure();
  const {
    isOpen: isEditClassOpen,
    onOpen: openEditClass,
    onClose: closeEditClass,
  } = useDisclosure();
  const {
    isOpen: isDeleteClassOpen,
    onOpen: openDeleteClass,
    onClose: closeDeleteClass,
  } = useDisclosure();

  const { data: trainers, isLoading: isLoadingTrainers } = useQuery(
    "trainerData",
    async () => {
      return getGymTrainers();
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

  const { data: classes, isLoading: isLoadingClasses } = useQuery(
    "gymClassData",
    async () => {
      return getGymClasses();
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

  const addGymClassMutation = useMutation(
    async (formData) => {
      return addGymClass(
        formData.classname,
        formData.instructor,
        formData.instructorId,
        formData.date,
        formData.starttime,
        formData.endtime,
        formData.capacity,
        formData.description,
        formData.equipment
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
        queryClient.invalidateQueries("gymClassData");
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

  const updateGymClassMutation = useMutation(
    async (formData) => {
      return updateGymClass(
        formData._id,
        formData.classname,
        formData.instructor,
        formData.instructorId,
        formData.date,
        formData.starttime,
        formData.endtime,
        formData.capacity,
        formData.description,
        formData.equipment
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
        queryClient.invalidateQueries("gymClassData");
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

  const deleteGymClassMutation = useMutation(
    async (formData) => {
      return deleteGymClass(formData.classId, formData.instructorId);
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
        queryClient.invalidateQueries("gymClassData");
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

  useEffect(() => {
    setListOfTrainers(trainers);
    setPosts(classes);
  }, [trainers, classes]);

  const handleSubmitNewClass = () => {
    addGymClassMutation.mutate(newClass);
    setNewClass({
      classname: "",
      instructor: "",
      instructorId: "",
      date: "",
      starttime: "",
      endtime: "",
      capacity: "",
      description: "",
      equipment: "",
    });
    closeAddClass();
  };

  const handleCloseAddClass = () => {
    setNewClass({
      classname: "",
      instructor: "",
      instructorId: "",
      date: "",
      starttime: "",
      endtime: "",
      capacity: "",
      description: "",
      equipment: "",
    });
    closeAddClass();
  };

  const handleOpenEdit = (selectedClass) => {
    setSelectedClass(selectedClass);
    openEditClass();
  };

  const handleSaveEdit = () => {
    updateGymClassMutation.mutate(selectedClass);
    setSelectedClass(null);
    closeEditClass();
  };

  const handleCloseEdit = () => {
    setSelectedClass(null);
    closeEditClass();
    // Reset the edited data to the original data or fetch from your backend
  };

  const handleOpenDelete = (item) => {
    setSelectedDeleteClass(item);
    openDeleteClass();
  };

  const handleDeleteClass = () => {
    deleteGymClassMutation.mutate({
      classId: selectedDeleteClass?._id,
      instructorId: selectedDeleteClass?.instructorId,
    });
    // console.log(selectedDeleteClass);
    setSelectedDeleteClass(null);
    closeDeleteClass();
  };

  const handleCloseDelete = () => {
    setSelectedDeleteClass(null);
    closeDeleteClass();
    // Reset the edited data to the original data or fetch from your backend
  };

  return (
    <Box padding="2rem">
      {/* Add Class */}
      <Modal isOpen={isAddClassOpen} onClose={handleCloseAddClass}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Add Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">Class Name</Text>
                <Input
                  value={newClass.classname}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      classname: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Class Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Instructor</Text>
                <Select
                  placeholder="Select trainer"
                  value={newClass?.instructor}
                  onChange={(e) => {
                    const selectedTrainer = listOfTrainers.find(
                      (trainer) =>
                        trainer.firstname + " " + trainer.lastname ===
                        e.target.value
                    );

                    setNewClass({
                      ...newClass,
                      instructor: e.target.value,
                      instructorId: selectedTrainer
                        ? selectedTrainer._id
                        : null,
                    });
                  }}
                >
                  {listOfTrainers?.map((trainer) => (
                    <option
                      key={trainer._id}
                      value={trainer.firstname + " " + trainer.lastname}
                    >
                      {trainer.firstname} {trainer.lastname}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text fontWeight="bold">Date</Text>
                <Input
                  value={newClass.date}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      date: e.target.value,
                    })
                  }
                  type="date"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Start Time</Text>
                <Input
                  value={newClass.starttime}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      starttime: e.target.value,
                    })
                  }
                  type="time"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">End Time</Text>
                <Input
                  value={newClass.endtime}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      endtime: e.target.value,
                    })
                  }
                  type="time"
                />
              </Box>

              <Box>
                <Text fontWeight="bold">Capacity</Text>
                <Input
                  value={newClass.capacity}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      capacity: e.target.value,
                    })
                  }
                  type="number"
                  placeholder="Capacity"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Description</Text>
                <Textarea
                  value={newClass.description}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      description: e.target.value,
                    })
                  }
                  placeholder="Type your description here..."
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Equipment</Text>
                <Input
                  value={newClass.equipment}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      equipment: e.target.value,
                    })
                  }
                  required
                  type="text"
                  placeholder="Equipment"
                />
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeAddClass}>
              Close
            </Button>
            <Button
              bgColor="brand.100"
              color="neutral.100"
              onClick={handleSubmitNewClass}
              isLoading={addGymClassMutation.isLoading}
            >
              Add Class
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Class */}

      <Modal isOpen={isEditClassOpen} onClose={handleCloseEdit}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Edit Class</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">Class Name</Text>
                <Input
                  value={selectedClass?.classname}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      classname: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Class Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Instructor</Text>
                <Select
                  placeholder="Select trainer"
                  value={selectedClass?.instructor}
                  onChange={(e) => {
                    const selectedTrainer = listOfTrainers.find(
                      (trainer) =>
                        trainer.firstname + " " + trainer.lastname ===
                        e.target.value
                    );

                    setSelectedClass({
                      ...selectedClass,
                      instructor: e.target.value,
                      instructorId: selectedTrainer
                        ? selectedTrainer._id
                        : null,
                    });
                  }}
                >
                  {listOfTrainers?.map((item) => (
                    <option
                      key={item._id}
                      value={item.firstname + " " + item.lastname}
                    >
                      {item.firstname} {item.lastname}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text fontWeight="bold">Date</Text>
                <Input
                  defaultValue={defaultDate}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      date: e.target.value,
                    })
                  }
                  type="date"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Start Time</Text>
                <Input
                  value={selectedClass?.starttime}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      starttime: e.target.value,
                    })
                  }
                  type="time"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">End Time</Text>
                <Input
                  value={selectedClass?.endtime}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      endtime: e.target.value,
                    })
                  }
                  type="time"
                />
              </Box>

              <Box>
                <Text fontWeight="bold">Capacity</Text>
                <Input
                  value={selectedClass?.capacity}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      capacity: e.target.value,
                    })
                  }
                  type="number"
                  placeholder="Capacity"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Description</Text>
                <Textarea
                  value={selectedClass?.description}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      description: e.target.value,
                    })
                  }
                  placeholder="Type your description here..."
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Equipment</Text>
                <Input
                  value={selectedClass?.equipment}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      equipment: e.target.value,
                    })
                  }
                  required
                  type="text"
                  placeholder="Equipment"
                />
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeEditClass}>
              Close
            </Button>
            <Button
              bgColor="brand.100"
              color="neutral.100"
              onClick={handleSaveEdit}
              // isLoading={updateGymClassMutation.isLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Class */}

      <Modal isOpen={isDeleteClassOpen} onClose={handleCloseDelete}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Delete Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete {selectedDeleteClass?.classname}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleCloseDelete}>
              No
            </Button>
            <Button
              bgColor="red"
              color="neutral.100"
              onClick={handleDeleteClass}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Text color="brand.200" fontSize="2rem" marginBottom="1rem">
        Classes
      </Text>
      <Button bgColor="brand.100" color="neutral.100" onClick={openAddClass}>
        Add Class
      </Button>

      <TableContainer marginTop="2rem">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th whiteSpace="normal">Class Name</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Instructor</Th>
              <Th>Capacity</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {classes?.length === 0 ? (
              <Tr>
                <Td textAlign="center" colSpan="6">
                  n/a
                </Td>
              </Tr>
            ) : (
              currentPosts?.map((item) => (
                <Tr key={item._id}>
                  <Td whiteSpace="normal">{item.classname}</Td>
                  <Td whiteSpace="normal">
                    {format(item.date, "MMMM d, yyyy")}
                  </Td>
                  <Td whiteSpace="normal">
                    {convertTo12HourFormat(item.starttime)} -{" "}
                    {convertTo12HourFormat(item.endtime)}
                  </Td>
                  <Td whiteSpace="normal">{item.instructor}</Td>
                  <Td>{`${item.joinedMember.length}/${item.capacity}`}</Td>
                  <Td display="flex" gap="0.5rem">
                    <Button
                      bgColor="blue"
                      color="neutral.100"
                      marginBottom="1rem"
                      onClick={() => handleOpenEdit(item)}
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
      {classes?.length !== 0 && !isLoadingClasses ? (
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
          {currentPage} of {Math.ceil(classes?.length / itemsPerPage)}
          <Button
            isDisabled={
              currentPage === Math.ceil(classes?.length / itemsPerPage)
            }
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

export default GymOwnerClasses;
