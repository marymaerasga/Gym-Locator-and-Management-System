import { useState } from "react";
import {
  Text,
  Box,
  Flex,
  Button,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  Input,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getUserProfile,
  updateUserProfile,
} from "../../api/userApi/privateUserApi";
import { format, parseISO } from "date-fns";

const UserProfile = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [userProfile, setUserProfile] = useState(null);

  const {
    isOpen: isEditProfileOpen,
    onOpen: openEditProfile,
    onClose: closeEditProfile,
  } = useDisclosure();

  const { data, isLoading, isError } = useQuery(
    "userProfile",
    async () => {
      return getUserProfile();
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

  const updateUserProfileMutation = useMutation(
    async (formData) => {
      return updateUserProfile(
        formData.firstname,
        formData.middlename,
        formData.lastname,
        formData.dateOfBirth,
        formData.contact,
        formData.address
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
        queryClient.invalidateQueries("userProfile");
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

  const dateToFormat = new Date(data?.dateOfBirth ?? new Date());
  const formattedDate = format(dateToFormat, "MMMM d, yyyy");

  const parsedDate = parseISO(userProfile?.dateOfBirth ?? "2001-01-01");
  const defaultDate = format(parsedDate, "yyyy-MM-dd");

  const handleOpenEdit = (profile) => {
    setUserProfile(profile);
    openEditProfile();
  };

  const handleSaveEdit = () => {
    updateUserProfileMutation.mutate(userProfile);
    setUserProfile(null);
    // console.log(userProfile);
    closeEditProfile();
  };

  const handleCloseEdit = () => {
    setUserProfile(null);
    closeEditProfile();
    // Reset the edited data to the original data or fetch from your backend
  };

  return (
    <Box padding="2rem">
      {/* Edit Profile Modal */}

      <Modal isOpen={isEditProfileOpen} onClose={handleCloseEdit}>
        <ModalOverlay />
        <ModalContent paddingInline="2rem" maxWidth="35rem">
          <ModalHeader>Edit Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="1rem">
              <Box>
                <Text fontWeight="bold">First Name</Text>
                <Input
                  value={userProfile?.firstname}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
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
                  value={userProfile?.middlename}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
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
                  value={userProfile?.lastname}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      lastname: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Last Name"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Birth Date</Text>
                <Input
                  defaultValue={defaultDate}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      dateOfBirth: e.target.value,
                    })
                  }
                  type="date"
                  placeholder="Birth Date"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Phone Number</Text>
                <Input
                  value={userProfile?.contact}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      contact: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Phone Number"
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Address</Text>
                <Input
                  value={userProfile?.address}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      address: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Address"
                />
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
              // onClick={handleSaveEdit}
              onClick={handleSaveEdit}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Text color="brand.200" fontSize="2rem" marginBottom="2rem">
        Profile
      </Text>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <Flex marginBottom="1rem" gap="8rem">
            <Box width="10rem">
              <Text color="gray" fontSize="1.3rem">
                Firstname
              </Text>
              <Text color="brand.200" fontSize="1.3rem">
                {data?.firstname}
              </Text>
            </Box>

            <Box width="10rem">
              <Text color="gray" fontSize="1.3rem">
                Middlename
              </Text>
              <Text color="brand.200" fontSize="1.3rem">
                {data?.middlename}
              </Text>
            </Box>

            <Box>
              <Text color="gray" fontSize="1.3rem">
                Lastname
              </Text>
              <Text color="brand.200" fontSize="1.3rem">
                {data?.lastname}
              </Text>
            </Box>
          </Flex>
          <Flex gap="8rem">
            <Box>
              <Text color="gray" fontSize="1.3rem">
                Birth Date
              </Text>
              <Text color="brand.200" fontSize="1.3rem">
                {formattedDate}
              </Text>
            </Box>
            <Box>
              <Text color="gray" fontSize="1.3rem" width="10rem">
                Phone Number
              </Text>
              <Text color="brand.200" fontSize="1.3rem">
                {data?.contact}
              </Text>
            </Box>
            <Box>
              <Text color="gray" fontSize="1.3rem">
                Address
              </Text>
              <Text whiteSpace="normal" color="brand.200" fontSize="1.3rem">
                {data?.address}
              </Text>
            </Box>
          </Flex>
          {/* <Flex>
            <Button
              color="neutral.100"
              bgColor="brand.100"
              marginTop="5rem"
              onClick={() => handleOpenEdit(data)}
              isLoading={updateUserProfileMutation.isLoading}
            >
              Edit Profile
            </Button>
          </Flex> */}
        </>
      )}
    </Box>
  );
};

export default UserProfile;
