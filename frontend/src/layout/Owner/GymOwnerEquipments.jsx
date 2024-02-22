import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  Image,
  Stack,
  Spinner,
  Textarea,
  TableContainer,
  Table,
  Text,
  Thead,
  Td,
  Th,
  Tr,
  Tbody,
  Modal,
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
  getGymEquipments,
  addGymEquipments,
  updateGymEquipments,
  deleteGymEquipment,
} from "../../api/ownerApi/privateOwnerApi";

const GymOwnerEquipments = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);
  const [newEquipment, setNewEquipment] = useState({
    equipmentName: "",
    description: "",
    equipmentImage: "",
    imageName: "",
    imageType: "",
  });

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedDeleteEquipment, setSelectedDeleteEquipment] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const {
    isOpen: isAddEquipmentOpen,
    onOpen: openAddEquipment,
    onClose: closeAddEquipment,
  } = useDisclosure();
  const {
    isOpen: isEditEquipmentOpen,
    onOpen: openEditEquipment,
    onClose: closeEditEquipment,
  } = useDisclosure();
  const {
    isOpen: isDeleteEquipmentOpen,
    onOpen: openDeleteEquipment,
    onClose: closeDeleteEquipment,
  } = useDisclosure();
  const {
    isOpen: isImageOpen,
    onOpen: openImage,
    onClose: closeImage,
  } = useDisclosure();

  const { data, isLoading, isError } = useQuery(
    "equipmentData",
    async () => {
      return getGymEquipments();
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

  const addEquipmentMutation = useMutation(
    async (formData) => {
      return addGymEquipments(
        formData.equipmentName,
        formData.description,
        formData.equipmentImage
      );
    },
    {
      onSuccess: (data) => {
        handleCloseNewEquipment();

        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("equipmentData");
      },
      onError: (error) => {
        handleCloseNewEquipment();
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
    }
  );

  const updateEquipmentMutation = useMutation(
    async (formData) => {
      return updateGymEquipments(
        formData._id,
        formData.equipmentName,
        formData.description,
        formData.newEquipmentImage,
        formData.equipmentImage.public_id
      );
    },
    {
      onSuccess: (data) => {
        handleCloseEdit();
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("equipmentData");
      },
      onError: (error) => {
        handleCloseEdit();
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
    }
  );

  const deleteEquipmentMutation = useMutation(
    async (formData) => {
      return deleteGymEquipment(
        formData._id,
        formData.equipmentImage.public_id
      );
    },
    {
      onSuccess: (data) => {
        setSelectedDeleteEquipment(null);
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("equipmentData");
      },
      onError: (error) => {
        setSelectedDeleteEquipment(null);
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
    }
  );

  const handleAddNewEquipment = () => {
    addEquipmentMutation.mutate(newEquipment);
  };

  const handleCloseNewEquipment = () => {
    setNewEquipment({
      equipmentName: "",
      description: "",
      equipmentImage: "",
      imageName: "",
      imageType: "",
    });

    closeAddEquipment();
  };

  const handleOpenEdit = (equipment) => {
    setSelectedEquipment({ ...equipment, newEquipmentImage: "" });

    openEditEquipment();
  };

  const handleSaveEdit = async () => {
    updateEquipmentMutation.mutate(selectedEquipment);
  };

  const handleCloseEdit = () => {
    setSelectedEquipment(null);
    closeEditEquipment();
  };

  const handleOpenDelete = (equipment) => {
    setSelectedDeleteEquipment(equipment);
    openDeleteEquipment();
  };

  const handleDeleteEquipment = () => {
    deleteEquipmentMutation.mutate(selectedDeleteEquipment);
    setSelectedDeleteEquipment(null);
    closeDeleteEquipment();
  };

  const handleCloseDelete = () => {
    setSelectedDeleteEquipment(null);
    closeDeleteEquipment();
    // Reset the edited data to the original data or fetch from your backend
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length === 0) {
      // User canceled file selection
      return;
    }

    const file = files[0];
    const allowedFileTypes = ["image/jpeg", "image/jpg"];

    if (!allowedFileTypes.includes(file?.type)) {
      return toast({
        title: "Please select a valid jpg, or jpeg file.",
        status: "error",
        duration: 2000,
        position: "bottom-right",
      });
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setNewEquipment((prevEquipment) => {
        return {
          ...prevEquipment,
          equipmentImage: reader.result,
          imageName:
            file.name.length > 15
              ? file.name.split(".")[0].concat("...")
              : file.name.split(".")[0],
          imageType: file.type.split("/")[1],
        };
      });
    };
  };

  const handleEditFileChange = (event) => {
    const files = event.target.files;

    if (files.length === 0) {
      // User canceled file selection
      return;
    }

    const file = files[0];
    const allowedFileTypes = ["image/jpeg", "image/jpg"];

    if (!allowedFileTypes.includes(file?.type)) {
      return toast({
        title: "Please select a valid jpg, or jpeg file.",
        status: "error",
        duration: 2000,
        position: "bottom-right",
      });
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setSelectedEquipment((prevEquipment) => {
        return {
          ...prevEquipment,
          newEquipmentImage: reader.result,
          imageName:
            file.name.length > 15
              ? file.name.split(".")[0].concat("...")
              : file.name.split(".")[0],
          imageType: file.type.split("/")[1],
        };
      });
    };
  };

  const handleOpenImage = (url) => {
    setSelectedImageUrl(url);
    openImage();
  };

  const handleCloseImage = () => {
    setSelectedImageUrl(null);
    closeImage();
  };

  useEffect(() => {
    setPosts(data);
  }, [data]);

  return (
    <Box padding="2rem">
      {/* Add Amenity */}

      <Modal isOpen={isAddEquipmentOpen} onClose={handleCloseNewEquipment}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Add Equipment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">Equipment Name</Text>
                <Input
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      equipmentName: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Equipment Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Description</Text>
                <Textarea
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      description: e.target.value,
                    })
                  }
                  placeholder="Type your equipment description here..."
                />
              </Box>
              <Box>
                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontWeight="bold">Upload Equipment Image:</Text>
                  <Input
                    id="upload-equipment"
                    type="file"
                    display="none"
                    onChange={handleFileChange}
                  />
                  <Text>
                    Image Name:{" "}
                    {newEquipment.imageName.length !== 0
                      ? newEquipment.imageName.concat(
                          `.${newEquipment.imageType}`
                        )
                      : "No image uploaded"}
                  </Text>

                  <Button
                    as="label"
                    htmlFor="upload-equipment"
                    cursor="pointer"
                  >
                    Choose file
                  </Button>
                </Flex>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseNewEquipment}>
              Close
            </Button>
            <Button
              bgColor="brand.100"
              color="neutral.100"
              onClick={handleAddNewEquipment}
              isLoading={addEquipmentMutation.isLoading}
            >
              Add Equipment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Amenity */}

      <Modal isOpen={isEditEquipmentOpen} onClose={handleCloseEdit}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Edit Equipment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">Equipment Name</Text>
                <Input
                  spellCheck={false}
                  value={selectedEquipment?.equipmentName}
                  onChange={(e) =>
                    setSelectedEquipment({
                      ...selectedEquipment,
                      equipmentName: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Equipment Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Description</Text>
                <Textarea
                  spellCheck={false}
                  value={selectedEquipment?.description}
                  onChange={(e) =>
                    setSelectedEquipment({
                      ...selectedEquipment,
                      description: e.target.value,
                    })
                  }
                  placeholder="Type your equipment description here..."
                />
              </Box>
              <Box>
                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontWeight="bold">Upload Equipment Image:</Text>
                  <Input
                    id="upload-edit-equipment"
                    type="file"
                    display="none"
                    onChange={handleEditFileChange}
                  />

                  <Text>
                    Image Name:{" "}
                    {selectedEquipment?.imageName?.length !== 0
                      ? selectedEquipment?.imageName?.concat(
                          `.${selectedEquipment?.imageType}`
                        )
                      : "No image uploaded"}
                  </Text>

                  <Button
                    as="label"
                    htmlFor="upload-edit-equipment"
                    cursor="pointer"
                  >
                    Choose file
                  </Button>
                </Flex>
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
              isLoading={updateEquipmentMutation.isLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Equipment*/}

      <Modal isOpen={isDeleteEquipmentOpen} onClose={handleCloseDelete}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Delete Equipment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete{" "}
              {selectedDeleteEquipment?.equipmentName}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleCloseDelete}>
              No
            </Button>
            <Button
              bgColor="red"
              color="neutral.100"
              onClick={handleDeleteEquipment}
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Open Image Modal */}

      <Modal isOpen={isImageOpen} onClose={handleCloseImage}>
        <ModalOverlay />
        <ModalContent>
          <Image
            src={selectedImageUrl}
            alt=""
            boxSize="100%"
            position="absolute"
            width="600px"
            height="400px"
            top="0"
            left="0"
          />
        </ModalContent>
      </Modal>

      <Text color="brand.200" fontSize="2rem" marginBottom="1rem">
        Equipments
      </Text>
      <Button
        bgColor="brand.100"
        color="neutral.100"
        onClick={openAddEquipment}
      >
        Add Equipment
      </Button>

      <Box>
        {isLoading ? (
          <Spinner size="lg" mt="4rem" />
        ) : (
          <TableContainer marginTop="1.5rem">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Equipment Name</Th>
                  <Th>Description</Th>
                  <Th>Image</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentPosts?.length !== 0 ? (
                  currentPosts?.map((item) => (
                    <Tr key={item._id}>
                      <Td>{item.equipmentName}</Td>
                      <Td>{item.description}</Td>
                      <Td color="brand.100">
                        <Text
                          _hover={{ textDecoration: "underline" }}
                          cursor="pointer"
                          onClick={() =>
                            handleOpenImage(item.equipmentImage.url)
                          }
                        >
                          View
                        </Text>
                      </Td>
                      <Td display="flex" gap="0.5rem">
                        <Button
                          bgColor="blue"
                          color="neutral.100"
                          marginBottom="1rem"
                          onClick={() => handleOpenEdit(item)}
                          isLoading={
                            updateEquipmentMutation.isLoading &&
                            updateEquipmentMutation.variables?._id === item._id
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          bgColor="red"
                          color="white"
                          onClick={() => handleOpenDelete(item)}
                          isLoading={deleteEquipmentMutation.isLoading}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td textAlign="center" colSpan="4">
                      n/a
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
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

export default GymOwnerEquipments;
