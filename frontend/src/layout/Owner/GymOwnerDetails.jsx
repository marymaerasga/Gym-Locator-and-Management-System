import { useState, useEffect } from "react";
import {
  Text,
  Box,
  Flex,
  Button,
  Grid,
  Input,
  Select,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getGymDetails,
  updateGymDetails,
} from "../../api/ownerApi/privateOwnerApi";
import { formattedTime } from "../../utils/convertToAmericanTime";

const GymOwnerDetails = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [gymData, setGymData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  const { data, isLoading, isError } = useQuery(
    "gymDetails",
    async () => getGymDetails(),
    {
      refetchOnWindowFocus: false,
      onSuccess: (item) => {
        setOriginalData(item);
        setGymData(item);
        console.log(item);
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
      setGymData(data);
    }
  }, [data]);

  const updateGymDetailsMutation = useMutation(
    async (formData) => {
      return updateGymDetails(
        formData.gymname,
        formData.address,
        formData.contact,
        formData.description,
        formData.schedule.startday,
        formData.schedule.endday,
        formData.schedule.opentime,
        formData.schedule.closetime
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
        queryClient.invalidateQueries("gymDetails");
      },
      onError: (error) => {
        setGymData(originalData);
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
    updateGymDetailsMutation.mutate(gymData);
  };

  const handleCloseClick = () => {
    setIsEditing(false);
    // Reset the edited data to the original data or fetch from your backend
    setGymData(originalData);
  };

  return (
    <Box padding="2rem">
      <Text color="brand.200" fontSize="2rem" marginBottom="0.5rem">
        Gym Details
      </Text>

      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <Box maxWidth="800px">
          <Grid templateColumns="repeat(2, 1fr)" columnGap="1rem" margin="auto">
            {/* <Box p="10px 0">
              <Text color="gray" fontSize="1rem">
                Gym Name
              </Text>

              {isEditing ? (
                <Input
                  maxWidth="13rem"
                  color="brand.200"
                  fontSize="1rem"
                  value={gymData?.gymname}
                  onChange={(e) =>
                    setGymData((prevData) => ({
                      ...prevData,
                      gymname: e.target.value,
                    }))
                  }
                />
              ) : (
                <Text color="brand.200" fontSize="1rem">
                  {gymData?.gymname}
                </Text>
              )}
            </Box> */}

            <Box p="10px 0">
              <Text color="gray" fontSize="1rem">
                Address
              </Text>
              {isEditing ? (
                <Input
                  maxWidth="25rem"
                  color="brand.200"
                  fontSize="1rem"
                  value={gymData?.address}
                  onChange={(e) =>
                    setGymData((prevData) => ({
                      ...prevData,
                      address: e.target.value,
                    }))
                  }
                />
              ) : (
                <Text color="brand.200" fontSize="1rem">
                  {gymData?.address}
                </Text>
              )}
            </Box>
            <Box p="10px 0">
              <Text color="gray" fontSize="1rem">
                Contact
              </Text>
              {isEditing ? (
                <Input
                  maxWidth="13rem"
                  color="brand.200"
                  fontSize="1rem"
                  value={gymData?.contact}
                  onChange={(e) =>
                    setGymData((prevData) => ({
                      ...prevData,
                      contact: e.target.value,
                    }))
                  }
                />
              ) : (
                <Text color="brand.200" fontSize="1rem">
                  {gymData?.contact}
                </Text>
              )}
            </Box>

            <Box p="10px 0">
              <Text color="gray" fontSize="1rem">
                Description
              </Text>
              {isEditing ? (
                <Input
                  maxWidth="25rem"
                  color="brand.200"
                  fontSize="1rem"
                  value={gymData?.description}
                  onChange={(e) =>
                    setGymData((prevData) => ({
                      ...prevData,
                      description: e.target.value,
                    }))
                  }
                />
              ) : (
                <Text color="brand.200" fontSize="1rem">
                  {gymData?.description}
                </Text>
              )}
            </Box>
            <Box p="10px 0">
              <Text color="gray" fontSize="1rem">
                Days Open
              </Text>
              {isEditing ? (
                <Select
                  placeholder={gymData?.schedule.startday}
                  maxWidth="13rem"
                  color="brand.200"
                  fontSize="1rem"
                  onChange={(e) =>
                    setGymData((prevData) => ({
                      ...prevData,
                      schedule: {
                        ...prevData.schedule,
                        startday: e.target.value,
                      },
                    }))
                  }
                  value={gymData?.schedule.startday}
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </Select>
              ) : (
                <Text color="brand.200" fontSize="1rem">
                  {gymData?.schedule.startday}
                </Text>
              )}
            </Box>

            <Box p="10px 0">
              <Text color="gray" fontSize="1rem">
                To
              </Text>

              {isEditing ? (
                <Select
                  placeholder={gymData?.schedule.endday}
                  maxWidth="13rem"
                  color="brand.200"
                  fontSize="1rem"
                  onChange={(e) =>
                    setGymData((prevData) => ({
                      ...prevData,
                      schedule: {
                        ...prevData.schedule,
                        endday: e.target.value,
                      },
                    }))
                  }
                  value={gymData?.schedule.endday}
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </Select>
              ) : (
                <Text color="brand.200" fontSize="1rem">
                  {gymData?.schedule.endday}
                </Text>
              )}
            </Box>

            <Box p="10px 0">
              <Text color="gray" fontSize="1rem">
                Time Open
              </Text>

              {isEditing ? (
                <Input
                  type="time"
                  maxWidth="13rem"
                  color="brand.200"
                  fontSize="1rem"
                  value={gymData?.schedule.opentime}
                  onChange={(e) =>
                    setGymData((prevData) => ({
                      ...prevData,
                      schedule: {
                        ...prevData.schedule,
                        opentime: e.target.value,
                      },
                    }))
                  }
                />
              ) : (
                <Text color="brand.200" fontSize="1rem">
                  {formattedTime(gymData?.schedule.opentime)}
                </Text>
              )}
            </Box>

            <Box p="10px 0">
              <Text color="gray" fontSize="1rem">
                Time Close
              </Text>

              {isEditing ? (
                <Input
                  type="time"
                  maxWidth="13rem"
                  color="brand.200"
                  fontSize="1rem"
                  value={gymData?.schedule.closetime}
                  onChange={(e) =>
                    setGymData((prevData) => ({
                      ...prevData,
                      schedule: {
                        ...prevData.schedule,
                        closetime: e.target.value,
                      },
                    }))
                  }
                />
              ) : (
                <Text color="brand.200" fontSize="1rem">
                  {formattedTime(gymData?.schedule.closetime)}
                </Text>
              )}
            </Box>
          </Grid>

          {/* <Flex p="10px 0">
            {isEditing ? (
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
                isLoading={updateGymDetailsMutation.isLoading}
                onClick={handleEditClick}
                colorScheme="blue"
                size="md"
                ml={2}
              >
                Edit
              </Button>
            )}
          </Flex> */}
        </Box>
      )}
    </Box>
  );
};

export default GymOwnerDetails;
