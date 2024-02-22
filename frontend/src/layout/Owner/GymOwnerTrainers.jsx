import { useState, useEffect } from "react";
import {
  CloseButton,
  Box,
  Flex,
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  TableContainer,
  Table,
  Text,
  Textarea,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Stack,
  UnorderedList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  addGymTrainers,
  getGymTrainers,
  deleteGymTrainer,
} from "../../api/ownerApi/privateOwnerApi";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const GymOwnerTrainers = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const handleShowPassword = () => setShow(!show);

  const newUniqueId = uuidv4();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  // const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedDeleteTrainer, setSelectedDeleteTrainer] = useState(null);
  const [newCertificate, setNewCertificate] = useState({
    certificateName: "",
    key: "",
  });
  const [newSpecialty, setNewSpecialty] = useState({
    specialtyName: "",
    key: "",
  });
  const [newTrainer, setNewTrainer] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    contact: "",
    address: "",
    dateOfBirth: null,
    gender: "",
    certifications: [],
    specialties: [],
    yearsOfExperience: "",
    biography: "",
    password: "",
  });

  const {
    isOpen: isAddNewTrainerOpen,
    onOpen: openAddNewTrainer,
    onClose: closeAddNewTrainer,
  } = useDisclosure();
  const {
    isOpen: isEditTrainerOpen,
    onOpen: openEditTrainer,
    onClose: closeEditTrainer,
  } = useDisclosure();
  const {
    isOpen: isDeleteTrainerOpen,
    onOpen: openDeleteTrainer,
    onClose: closeDeleteTrainer,
  } = useDisclosure();

  const { data, isLoading, isError } = useQuery(
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

  const addGymTrainerMutation = useMutation(
    async (formData) => {
      return addGymTrainers(
        formData.firstname,
        formData.middlename,
        formData.lastname,
        formData.email,
        formData.contact,
        formData.address,
        formData.dateOfBirth,
        formData.gender,
        formData.certifications,
        formData.specialties,
        formData.yearsOfExperience,
        formData.biography,
        formData.password
      );
    },
    {
      onSuccess: (data) => {
        setNewTrainer({
          firstname: "",
          middlename: "",
          lastname: "",
          email: "",
          contact: "",
          address: "",
          dateOfBirth: null,
          gender: "",
          certifications: [],
          specialties: [],
          yearsOfExperience: "",
          biography: "",
          password: "",
        });
        closeAddNewTrainer();
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("trainerData");
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

  const deleteGymTrainerMutation = useMutation(
    async (formData) => {
      return deleteGymTrainer(formData._id);
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
        queryClient.invalidateQueries("trainerData");
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

  const handleDeleteCertification = (index) => {
    setNewTrainer((prevTrainer) => {
      const updatedCertifications = [...prevTrainer.certifications];
      updatedCertifications.splice(index, 1);

      return {
        ...prevTrainer,
        certifications: updatedCertifications,
      };
    });
  };

  const handleDeleteSpecialty = (index) => {
    setNewTrainer((prevTrainer) => {
      const updatedSpecialties = [...prevTrainer.specialties];
      updatedSpecialties.splice(index, 1);

      return {
        ...prevTrainer,
        specialties: updatedSpecialties,
      };
    });
  };

  const handleSubmitNewTrainer = () => {
    addGymTrainerMutation.mutate(newTrainer);
  };

  const handleCloseNewTrainer = () => {
    setNewTrainer({
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      contact: "",
      address: "",
      dateOfBirth: null,
      gender: "",
      certifications: [],
      specialties: [],
      yearsOfExperience: "",
      biography: "",
      password: "",
    });
    closeAddNewTrainer();
  };

  // const handleOpenEdit = (trainer) => {
  //   setSelectedTrainer(trainer);
  //   openEditTrainer();
  // };

  // const handleSaveEdit = () => {
  //   updateTrainerMutation.mutate(selectedTrainer);
  //   setSelectedTrainer(null);
  //   closeEditTrainer();
  // };

  // const handleCloseEdit = () => {
  //   setSelectedTrainer(null);
  //   closeEditTrainer();
  //   // Reset the edited data to the original data or fetch from your backend
  // };

  const handleOpenDelete = (trainer) => {
    setSelectedDeleteTrainer(trainer);
    openDeleteTrainer();
  };

  const handleDeleteTrainer = () => {
    deleteGymTrainerMutation.mutate(selectedDeleteTrainer);
    setSelectedDeleteTrainer(null);
    closeDeleteTrainer();
  };

  const handleCloseDelete = () => {
    setSelectedDeleteTrainer(null);
    closeDeleteTrainer();
  };

  useEffect(() => {
    setPosts(data);
  }, [data]);

  return (
    <Box padding="2rem">
      {/* New Trainer  */}

      <Modal isOpen={isAddNewTrainerOpen} onClose={handleCloseNewTrainer}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Add Trainer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">First Name</Text>
                <Input
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      firstname: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="First Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Middle Name</Text>
                <Input
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      middlename: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Middle Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Last Name</Text>
                <Input
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      lastname: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Last Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Email</Text>
                <Input
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      email: e.target.value,
                    })
                  }
                  type="email"
                  placeholder="Email"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Contact</Text>
                <Input
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      contact: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Contact"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Address</Text>
                <Input
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      address: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Address"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">BirthDate</Text>
                <Input
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      dateOfBirth: e.target.value,
                    })
                  }
                  type="date"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Gender</Text>
                <Select
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      gender: e.target.value,
                    })
                  }
                  placeholder="Select Gender"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>
              </Box>
              <Stack spacing="0.8rem">
                <Text fontWeight="bold">Certifications</Text>
                <InputGroup>
                  <Input
                    placeholder="Type your certification"
                    value={newCertificate.certificateName}
                    onChange={(e) =>
                      setNewCertificate({
                        certificateName: e.target.value,
                        key: newUniqueId,
                      })
                    }
                    type="text"
                  />
                  <InputRightElement>
                    <Button
                      height="70%"
                      bgColor="brand.100"
                      marginRight="1rem"
                      onClick={() => {
                        if (newCertificate.certificateName !== "") {
                          setNewTrainer((prevTrainer) => ({
                            ...prevTrainer,
                            certifications: [
                              ...prevTrainer.certifications,
                              newCertificate,
                            ],
                          }));
                          setNewCertificate({
                            certificateName: "",
                            key: "",
                          });
                        }
                      }}
                    >
                      Add
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <UnorderedList>
                  {newTrainer.certifications?.map((item, index) => (
                    <Flex key={item.key} justify="space-between" align="center">
                      <ListItem>{item.certificateName}</ListItem>
                      <CloseButton
                        onClick={() => handleDeleteCertification(index)}
                      />
                    </Flex>
                  ))}
                </UnorderedList>
              </Stack>
              <Stack spacing="0.8rem">
                <Text fontWeight="bold">Specialties</Text>
                <InputGroup>
                  <Input
                    placeholder="Type your specialty"
                    value={newSpecialty.specialtyName}
                    onChange={(e) =>
                      setNewSpecialty({
                        specialtyName: e.target.value,
                        key: newUniqueId,
                      })
                    }
                    type="text"
                  />
                  <InputRightElement>
                    <Button
                      height="70%"
                      bgColor="brand.100"
                      marginRight="1rem"
                      onClick={() => {
                        if (newSpecialty.specialtyName !== "") {
                          setNewTrainer((prevTrainer) => ({
                            ...prevTrainer,
                            specialties: [
                              ...prevTrainer.specialties,
                              newSpecialty,
                            ],
                          }));
                          setNewSpecialty({
                            specialtyName: "",
                            key: "",
                          });
                        }
                      }}
                    >
                      Add
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <UnorderedList>
                  {/* {newTrainer.specialties?.map((item) => {
                    return (
                      <ListItem key={item.key}>{item.specialtyName}</ListItem>
                    );
                  })} */}

                  {newTrainer.specialties?.map((item, index) => (
                    <Flex key={item.key} justify="space-between" align="center">
                      <ListItem>{item.specialtyName}</ListItem>
                      <CloseButton
                        onClick={() => handleDeleteSpecialty(index)}
                      />
                    </Flex>
                  ))}
                </UnorderedList>
              </Stack>
              <Box>
                <Text fontWeight="bold">Years of Experience</Text>
                <Input
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      yearsOfExperience: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    const isNumeric = /^[0-9\b]+$/.test(e.key);

                    // Allow Backspace (keyCode 8) and Tab (keyCode 9)
                    if (
                      !isNumeric &&
                      e.key !== "Backspace" &&
                      e.key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  type="number"
                  placeholder="Type your experience"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Biography</Text>
                <Textarea
                  onChange={(e) =>
                    setNewTrainer({
                      ...newTrainer,
                      biography: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Type your biography"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Password</Text>
                <InputGroup>
                  <Input
                    onChange={(e) =>
                      setNewTrainer({
                        ...newTrainer,
                        password: e.target.value,
                      })
                    }
                    type={show ? "text" : "password"}
                    placeholder="Type your password"
                  />
                  <InputRightElement
                    width="4.5rem"
                    bgColor="none"
                    height="100%"
                  >
                    <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                      {show ? (
                        <Icon as={IoEye} boxSize={6} bgColor="none" />
                      ) : (
                        <Icon as={IoEyeOff} boxSize={6} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseNewTrainer}>
              Close
            </Button>
            <Button
              bgColor="brand.100"
              color="neutral.100"
              onClick={handleSubmitNewTrainer}
              isLoading={addGymTrainerMutation.isLoading}
            >
              Add Trainer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Trainer */}

      {/* Delete Trainer */}

      <Modal isOpen={isDeleteTrainerOpen} onClose={handleCloseDelete}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Delete Trainer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete {selectedDeleteTrainer?.firstname}{" "}
              {selectedDeleteTrainer?.lastname}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleCloseDelete}>
              No
            </Button>
            <Button
              bgColor="red"
              color="neutral.100"
              onClick={handleDeleteTrainer}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Text color="brand.200" fontSize="2rem" marginBottom="2rem">
        Trainers
      </Text>
      <Button
        bgColor="brand.100"
        color="neutral.100"
        onClick={openAddNewTrainer}
        // isLoading={addGymTrainerMutation.isLoading}
      >
        Add Trainer
      </Button>
      <TableContainer marginTop="2rem">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Certifications</Th>
              <Th>Specialties</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.length === 0 ? (
              <Tr>
                <Td textAlign="center" colSpan="5">
                  n/a
                </Td>
              </Tr>
            ) : (
              currentPosts?.map((item) => (
                <Tr key={item._id}>
                  <Td whiteSpace="normal">{item.firstname}</Td>
                  <Td whiteSpace="normal">{item.lastname}</Td>
                  <Td whiteSpace="normal">
                    {item.certifications.length !== 0
                      ? item.certifications.reduce(
                          (acc, curr) =>
                            acc + (acc ? ", " : "") + curr.certificateName,
                          ""
                        )
                      : "n/a"}
                  </Td>
                  <Td whiteSpace="normal">
                    {item.specialties.length !== 0
                      ? item.specialties.reduce(
                          (acc, curr) =>
                            acc + (acc ? ", " : "") + curr.specialtyName,
                          ""
                        )
                      : "n/a"}
                  </Td>

                  <Td>
                    <Flex gap="1rem">
                      {/* <Button
                      bgColor="blue"
                      color="neutral.100"
                      onClick={() => handleOpenEdit(item)}
                    >
                      Edit
                    </Button> */}
                      <Button
                        bgColor="red"
                        color="white"
                        onClick={() => handleOpenDelete(item)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))
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

export default GymOwnerTrainers;
