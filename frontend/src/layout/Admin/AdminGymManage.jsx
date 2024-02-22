import { useState, useEffect } from "react";
import {
  Button,
  Text,
  Box,
  Flex,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  Table,
  Td,
  Th,
  Tbody,
  Thead,
  Tr,
  TableContainer,
  useDisclosure,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import AdminManageModal from "../../components/AdminManageModal/AdminManageModal";

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { updateGymStatus } from "../../api/adminApi/privateAdminApi";

const apiUrl =
  import.meta.env.MODE === "production"
    ? "https://gymlocator.co/api"
    : "http://localhost:5000/api";

const AdminGymManage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const {
    isOpen: isImageOpen,
    onOpen: openImage,
    onClose: closeImage,
  } = useDisclosure();

  const { data, isLoading, isError, refetch } = useQuery(
    "ownersList",
    async () => {
      return axios
        .get(`${apiUrl}/admin/owners`, {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("adminInfo")).token
            }`,
          },
        })
        .then((res) => res.data);
    }
  );

  const updateGymStatusMutation = useMutation(
    async (data) => updateGymStatus(data.action, data.id),
    {
      onSuccess: (data) => {
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        onClose();
        refetch();

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("ownersList");
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

  const handleManageClick = (owner) => {
    setSelectedOwner(owner);
    onOpen();
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
    <Box padding="3rem">
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
      <AdminManageModal
        isOpen={isOpen}
        onClose={onClose}
        owner={selectedOwner}
        updateGymStatusMutation={updateGymStatusMutation}
      />
      <Text fontSize="2rem" fontWeight="600" marginBottom="1rem">
        Gym Manage
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Gym Name</Th>
              <Th>Owner Name</Th>

              <Th>Permit</Th>

              <Th>Status</Th>
              <Th>Manage</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!isLoading ? (
              currentPosts?.map((owner) => {
                return (
                  <Tr key={owner._id}>
                    <Td whiteSpace="normal">{owner.gym.gymname}</Td>
                    <Td whiteSpace="normal">
                      {owner.firstname} {owner.lastname}
                    </Td>
                    <Td
                      color="brand.100"
                      cursor="pointer"
                      onClick={() =>
                        handleOpenImage(owner.gym.permitImage?.url)
                      }
                      _hover={{ textDecoration: "underline" }}
                    >
                      View Permit
                    </Td>
                    <Td
                      color={
                        owner.gym.isApproved === "approved"
                          ? "brand.100"
                          : owner.gym.isApproved === "pending"
                          ? "yellow.500"
                          : owner.gym.isApproved === "rejected"
                          ? "red"
                          : null
                      }
                      fontWeight="bold"
                    >
                      {owner.gym.isApproved}
                    </Td>
                    <Td>
                      <Button
                        bgColor="brand.100"
                        color="neutral.100"
                        _hover={{ color: "brand.200", bgColor: "gray.300" }}
                        onClick={() => handleManageClick(owner)}
                      >
                        Manage
                      </Button>
                    </Td>
                  </Tr>
                );
              })
            ) : (
              <Spinner margin="1rem" size="lg" />
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

export default AdminGymManage;
