import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
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
  getGymAmenities,
  addGymAmenities,
  updateGymAmenities,
  deleteGymAmenity,
} from "../../api/ownerApi/privateOwnerApi";

const GymOwnerAmenities = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const [newAmenity, setNewAmenity] = useState({
    amenityName: "",
    description: "",
    amenityImage: "",
    imageName: "",
    imageType: "",
  });
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [selectedDeleteAmenity, setSelectedDeleteAmenity] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const {
    isOpen: isAddAmenityOpen,
    onOpen: openAddAmenity,
    onClose: closeAddAmenity,
  } = useDisclosure();
  const {
    isOpen: isEditAmenityOpen,
    onOpen: openEditAmenity,
    onClose: closeEditAmenity,
  } = useDisclosure();
  const {
    isOpen: isDeleteAmenityOpen,
    onOpen: openDeleteAmenity,
    onClose: closeDeleteAmenity,
  } = useDisclosure();
  const {
    isOpen: isImageOpen,
    onOpen: openImage,
    onClose: closeImage,
  } = useDisclosure();

  const { data, isLoading, isError } = useQuery(
    "amenityData",
    async () => {
      return getGymAmenities();
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

  const addAmenityMutation = useMutation(
    async (formData) => {
      return addGymAmenities(
        formData.amenityName,
        formData.description,
        formData.amenityImage
      );
    },
    {
      onSuccess: (data) => {
        handleCloseNewAmenity();

        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("amenityData");
      },
      onError: (error) => {
        handleCloseNewAmenity();
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
    }
  );

  const updateAmenityMutation = useMutation(
    async (formData) => {
      return updateGymAmenities(
        formData._id,
        formData.amenityName,
        formData.description,
        formData.newAmenityImage,
        formData.amenityImage.public_id
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
        queryClient.invalidateQueries("amenityData");
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

  const deleteAmenityMutation = useMutation(
    async (formData) => {
      return deleteGymAmenity(formData._id, formData.amenityImage.public_id);
    },
    {
      onSuccess: (data) => {
        setSelectedDeleteAmenity(null);
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("amenityData");
      },
      onError: (error) => {
        setSelectedDeleteAmenity(null);
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
    }
  );

  const handleAddNewAmenity = () => {
    addAmenityMutation.mutate(newAmenity);
  };

  const handleCloseNewAmenity = () => {
    setNewAmenity({
      amenityName: "",
      description: "",
      amenityImage: "",
      imageName: "",
      imageType: "",
    });

    closeAddAmenity();
  };

  const handleOpenEdit = (amenity) => {
    setSelectedAmenity({ ...amenity, newAmenityImage: "" });

    openEditAmenity();
  };

  const handleSaveEdit = async () => {
    updateAmenityMutation.mutate(selectedAmenity);
  };

  const handleCloseEdit = () => {
    setSelectedAmenity(null);
    closeEditAmenity();
    // Reset the edited data to the original data or fetch from your backend
  };

  const handleOpenDelete = (amenity) => {
    setSelectedDeleteAmenity(amenity);
    openDeleteAmenity();
  };

  const handleDeleteAmenity = () => {
    deleteAmenityMutation.mutate(selectedDeleteAmenity);
    setSelectedDeleteAmenity(null);
    closeDeleteAmenity();
  };

  const handleCloseDelete = () => {
    setSelectedDeleteAmenity(null);
    closeDeleteAmenity();
    // Reset the edited data to the original data or fetch from your backend
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length === 0) {
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
      setNewAmenity((prevAmenity) => {
        return {
          ...prevAmenity,
          amenityImage: reader.result,
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
      setSelectedAmenity((prevAmenity) => {
        return {
          ...prevAmenity,
          newAmenityImage: reader.result,
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

      <Modal isOpen={isAddAmenityOpen} onClose={handleCloseNewAmenity}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Add Amenity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">Amenity Name</Text>
                <Input
                  onChange={(e) =>
                    setNewAmenity({
                      ...newAmenity,
                      amenityName: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Amenity Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Description</Text>
                <Textarea
                  onChange={(e) =>
                    setNewAmenity({
                      ...newAmenity,
                      description: e.target.value,
                    })
                  }
                  placeholder="Type your amenity description here..."
                />
              </Box>
              <Box>
                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontWeight="bold">Upload Amenity Image:</Text>
                  <Input
                    id="upload-amenity"
                    type="file"
                    display="none"
                    onChange={handleFileChange}
                  />
                  <Text>
                    Image Name:{" "}
                    {newAmenity.imageName.length !== 0
                      ? newAmenity.imageName.concat(`.${newAmenity.imageType}`)
                      : "No image uploaded"}
                  </Text>

                  <Button as="label" htmlFor="upload-amenity" cursor="pointer">
                    Choose file
                  </Button>
                </Flex>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseNewAmenity}>
              Close
            </Button>
            <Button
              bgColor="brand.100"
              color="neutral.100"
              onClick={handleAddNewAmenity}
              isLoading={addAmenityMutation.isLoading}
            >
              Add Amenity
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Amenity */}

      <Modal isOpen={isEditAmenityOpen} onClose={handleCloseEdit}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Edit Amenity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">Amenity Name</Text>
                <Input
                  spellCheck={false}
                  value={selectedAmenity?.amenityName}
                  onChange={(e) =>
                    setSelectedAmenity({
                      ...selectedAmenity,
                      amenityName: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Amenity Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Description</Text>
                <Textarea
                  spellCheck={false}
                  value={selectedAmenity?.description}
                  onChange={(e) =>
                    setSelectedAmenity({
                      ...selectedAmenity,
                      description: e.target.value,
                    })
                  }
                  placeholder="Type your equipment description here..."
                />
              </Box>
              <Box>
                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontWeight="bold">Upload Amenity Image:</Text>
                  <Input
                    id="upload-edit-amenity"
                    type="file"
                    display="none"
                    onChange={handleEditFileChange}
                  />

                  <Text>
                    Image Name:{" "}
                    {selectedAmenity?.imageName?.length !== 0
                      ? selectedAmenity?.imageName?.concat(
                          `.${selectedAmenity?.imageType}`
                        )
                      : "No image uploaded"}
                  </Text>

                  <Button
                    as="label"
                    htmlFor="upload-edit-amenity"
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
              isLoading={updateAmenityMutation.isLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Amenity*/}

      <Modal isOpen={isDeleteAmenityOpen} onClose={handleCloseDelete}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Delete Amenity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete{" "}
              {selectedDeleteAmenity?.amenityName}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleCloseDelete}>
              No
            </Button>
            <Button
              bgColor="red"
              color="neutral.100"
              onClick={handleDeleteAmenity}
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
        Amenities
      </Text>
      <Button bgColor="brand.100" color="neutral.100" onClick={openAddAmenity}>
        Add Amenity
      </Button>

      <Box>
        {isLoading ? (
          <Spinner size="lg" mt="4rem" />
        ) : (
          <TableContainer marginTop="1.5rem">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Amenity Name</Th>
                  <Th>Description</Th>
                  <Th>Image</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentPosts?.length !== 0 ? (
                  currentPosts?.map((item) => (
                    <Tr key={item._id}>
                      <Td>{item.amenityName}</Td>
                      <Td>{item.description}</Td>
                      <Td color="brand.100">
                        <Text
                          _hover={{ textDecoration: "underline" }}
                          cursor="pointer"
                          onClick={() => handleOpenImage(item.amenityImage.url)}
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
                            updateAmenityMutation.isLoading &&
                            updateAmenityMutation.variables?._id === item._id
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          bgColor="red"
                          color="white"
                          onClick={() => handleOpenDelete(item)}
                          isLoading={
                            deleteAmenityMutation.isLoading &&
                            deleteAmenityMutation.variables?._id === item._id
                          }
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

export default GymOwnerAmenities;
