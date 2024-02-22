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
  getGymServices,
  addGymServices,
  updateGymServices,
  deleteGymService,
} from "../../api/ownerApi/privateOwnerApi";

const GymOwnerServices = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);
  const [newService, setNewService] = useState({
    serviceName: "",
    description: "",
    serviceImage: "",
    imageName: "",
    imageType: "",
  });
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDeleteService, setSelectedDeleteService] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const {
    isOpen: isAddServiceOpen,
    onOpen: openAddService,
    onClose: closeAddService,
  } = useDisclosure();
  const {
    isOpen: isEditServiceOpen,
    onOpen: openEditService,
    onClose: closeEditService,
  } = useDisclosure();
  const {
    isOpen: isDeleteServiceOpen,
    onOpen: openDeleteService,
    onClose: closeDeleteService,
  } = useDisclosure();
  const {
    isOpen: isImageOpen,
    onOpen: openImage,
    onClose: closeImage,
  } = useDisclosure();

  const { data, isLoading, isError } = useQuery(
    "serviceData",
    async () => {
      return getGymServices();
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

  const addServiceMutation = useMutation(
    async (formData) => {
      return addGymServices(
        formData.serviceName,
        formData.description,
        formData.serviceImage
      );
    },
    {
      onSuccess: (data) => {
        handleCloseNewService();

        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("serviceData");
      },
      onError: (error) => {
        handleCloseNewService();
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
    }
  );

  const updateServiceMutation = useMutation(
    async (formData) => {
      return updateGymServices(
        formData._id,
        formData.serviceName,
        formData.description,
        formData.newServiceImage,
        formData.serviceImage.public_id
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
        queryClient.invalidateQueries("serviceData");
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

  const deleteServiceMutation = useMutation(
    async (formData) => {
      return deleteGymService(formData._id, formData.serviceImage.public_id);
    },
    {
      onSuccess: (data) => {
        setSelectedDeleteService(null);
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("serviceData");
      },
      onError: (error) => {
        setSelectedDeleteService(null);
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
      },
    }
  );

  const handleAddNewService = () => {
    addServiceMutation.mutate(newService);
  };

  const handleCloseNewService = () => {
    setNewService({
      serviceName: "",
      description: "",
      serviceImage: "",
      imageName: "",
      imageType: "",
    });

    closeAddService();
  };

  const handleOpenEdit = (service) => {
    setSelectedService({ ...service, newServiceImage: "" });

    openEditService();
  };

  const handleSaveEdit = async () => {
    updateServiceMutation.mutate(selectedService);
  };

  const handleCloseEdit = () => {
    setSelectedService(null);
    closeEditService();
    // Reset the edited data to the original data or fetch from your backend
  };

  const handleOpenDelete = (service) => {
    setSelectedDeleteService(service);
    openDeleteService();
  };

  const handleDeleteService = () => {
    deleteServiceMutation.mutate(selectedDeleteService);
    setSelectedDeleteService(null);
    closeDeleteService();
  };

  const handleCloseDelete = () => {
    setSelectedDeleteService(null);
    closeDeleteService();
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
      setNewService((prevService) => {
        return {
          ...prevService,
          serviceImage: reader.result,
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
      setSelectedService((prevService) => {
        return {
          ...prevService,
          newServiceImage: reader.result,
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
      {/* Add Service */}

      <Modal isOpen={isAddServiceOpen} onClose={handleCloseNewService}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Add Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">Service Name</Text>
                <Input
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      serviceName: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Service Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Description</Text>
                <Textarea
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Type your service description here..."
                />
              </Box>
              <Box>
                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontWeight="bold">Upload Service Image:</Text>
                  <Input
                    id="upload-service"
                    type="file"
                    display="none"
                    onChange={handleFileChange}
                  />
                  <Text>
                    Image Name:{" "}
                    {newService.imageName.length !== 0
                      ? newService.imageName.concat(`.${newService.imageType}`)
                      : "No image uploaded"}
                  </Text>

                  <Button as="label" htmlFor="upload-service" cursor="pointer">
                    Choose file
                  </Button>
                </Flex>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseNewService}>
              Close
            </Button>
            <Button
              bgColor="brand.100"
              color="neutral.100"
              onClick={handleAddNewService}
              isLoading={addServiceMutation.isLoading}
            >
              Add Service
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Service */}

      <Modal isOpen={isEditServiceOpen} onClose={handleCloseEdit}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Edit Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">Service Name</Text>
                <Input
                  spellCheck={false}
                  value={selectedService?.serviceName}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      serviceName: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Service Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Description</Text>
                <Textarea
                  spellCheck={false}
                  value={selectedService?.description}
                  onChange={(e) =>
                    setSelectedService({
                      ...selectedService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Type your service description here..."
                />
              </Box>
              <Box>
                <Flex flexDirection="column" gap="0.5rem">
                  <Text fontWeight="bold">Upload Service Image:</Text>
                  <Input
                    id="upload-edit-service"
                    type="file"
                    display="none"
                    onChange={handleEditFileChange}
                  />

                  <Text>
                    Image Name:{" "}
                    {selectedService?.imageName?.length !== 0
                      ? selectedService?.imageName?.concat(
                          `.${selectedService?.imageType}`
                        )
                      : "No image uploaded"}
                  </Text>

                  <Button
                    as="label"
                    htmlFor="upload-edit-service"
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
              isLoading={updateServiceMutation.isLoading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Amenity*/}

      <Modal isOpen={isDeleteServiceOpen} onClose={handleCloseDelete}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Delete Service</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete{" "}
              {selectedDeleteService?.serviceName}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={handleCloseDelete}>
              No
            </Button>
            <Button
              bgColor="red"
              color="neutral.100"
              onClick={handleDeleteService}
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
        Services
      </Text>
      <Button bgColor="brand.100" color="neutral.100" onClick={openAddService}>
        Add Service
      </Button>

      <Box>
        {isLoading ? (
          <Spinner size="lg" mt="4rem" />
        ) : (
          <TableContainer marginTop="1.5rem">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Service Name</Th>
                  <Th>Description</Th>
                  <Th>Image</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentPosts?.length !== 0 ? (
                  currentPosts?.map((item) => (
                    <Tr key={item._id}>
                      <Td>{item.serviceName}</Td>
                      <Td>{item.description}</Td>
                      <Td color="brand.100">
                        <Text
                          _hover={{ textDecoration: "underline" }}
                          cursor="pointer"
                          onClick={() => handleOpenImage(item.serviceImage.url)}
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
                            updateServiceMutation.isLoading &&
                            updateServiceMutation.variables?._id === item._id
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          bgColor="red"
                          color="white"
                          onClick={() => handleOpenDelete(item)}
                          isLoading={deleteServiceMutation.isLoading}
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

export default GymOwnerServices;
