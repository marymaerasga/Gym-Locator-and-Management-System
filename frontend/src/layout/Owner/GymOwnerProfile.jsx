import { useState, useEffect } from "react";
import {
  Text,
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getOwnerProfile,
  updateOwnerProfile,
} from "../../api/ownerApi/privateOwnerApi";

const GymOwnerProfile = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  const { data, isLoading, isError } = useQuery(
    "ownerProfile",
    async () => {
      return getOwnerProfile();
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (item) => {
        setOriginalData(item);
        setProfileData(item);
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
    if (data) {
      setProfileData(data);
    }
  }, [data]);

  const updateOwnerMutation = useMutation(
    async (formData) => {
      return updateOwnerProfile(
        formData.firstname,
        formData.middlename,
        formData.lastname,
        formData.email
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
        queryClient.invalidateQueries("ownerProfile");
      },
      onError: (error) => {
        setProfileData(originalData);
        toast({
          title: error.response.data.error || "Something went wrong",
          status: "error",
          duration: 2000,
          position: "bottom-right",
        });
        console.log(error);
      },
    }
  );

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);

    // console.log("Edited Data:", profileData);
    updateOwnerMutation.mutate(profileData);
  };

  const handleCloseClick = () => {
    setIsEditing(false);
    // Reset the edited data to the original data or fetch from your backend
    setProfileData(originalData);
  };

  return (
    <Box padding="2rem">
      <Text color="brand.200" fontSize="2rem" marginBottom="2rem">
        Gym Owner Profile
      </Text>

      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <Flex marginBottom="1rem" gap="10rem">
            <Box>
              <Text color="gray" fontSize="1.3rem">
                Firstname
              </Text>

              {isEditing ? (
                <Input
                  maxWidth="13rem"
                  fontSize="1.3rem"
                  value={profileData?.firstname}
                  onChange={(e) =>
                    setProfileData((prevData) => ({
                      ...prevData,
                      firstname: e.target.value,
                    }))
                  }
                />
              ) : (
                <Text color="brand.200" fontSize="1.3rem">
                  {profileData?.firstname}
                </Text>
              )}
            </Box>

            <Box>
              <Text color="gray" fontSize="1.3rem">
                Middlename
              </Text>
              {isEditing ? (
                <Input
                  maxWidth="13rem"
                  fontSize="1.3rem"
                  value={profileData?.middlename}
                  onChange={(e) =>
                    setProfileData((prevData) => ({
                      ...prevData,
                      middlename: e.target.value,
                    }))
                  }
                />
              ) : (
                <Text color="brand.200" fontSize="1.3rem">
                  {profileData?.middlename}
                </Text>
              )}
            </Box>

            <Box>
              <Text color="gray" fontSize="1.3rem">
                Lastname
              </Text>
              {isEditing ? (
                <Input
                  maxWidth="13rem"
                  fontSize="1.3rem"
                  value={profileData?.lastname}
                  onChange={(e) =>
                    setProfileData((prevData) => ({
                      ...prevData,
                      lastname: e.target.value,
                    }))
                  }
                />
              ) : (
                <Text color="brand.200" fontSize="1.3rem">
                  {profileData?.lastname}
                </Text>
              )}
            </Box>
          </Flex>
          <Box marginBottom="2rem">
            <Text color="gray" fontSize="1.3rem">
              Email Address
            </Text>
            {isEditing ? (
              <Input
                maxWidth="15rem"
                fontSize="1.3rem"
                value={profileData?.email}
                onChange={(e) =>
                  setProfileData((prevData) => ({
                    ...prevData,
                    email: e.target.value,
                  }))
                }
              />
            ) : (
              <Text color="brand.200" fontSize="1.3rem">
                {profileData?.email}
              </Text>
            )}
          </Box>

          {/* {isEditing ? (
            <>
              <Button
                onClick={handleSaveClick}
                colorScheme="green"
                size="md"
                ml={2}
              >
                Save
              </Button>
              <Button
                onClick={handleCloseClick}
                colorScheme="red"
                size="md"
                ml={2}
              >
                Close
              </Button>
            </>
          ) : (
            <Button
              isLoading={updateOwnerMutation.isLoading}
              onClick={handleEditClick}
              colorScheme="blue"
              size="md"
              ml={2}
            >
              Edit
            </Button>
          )} */}
        </>
      )}
    </Box>
  );
};

export default GymOwnerProfile;
