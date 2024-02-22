import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Box,
  Text,
  Flex,
  Input,
  Textarea,
  Select,
  ModalFooter,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { postUserJoinGym } from "../../api/userApi/privateUserApi";
import { useMutation, useQueryClient } from "react-query";
import { useEffect } from "react";

const UserJoinOtherGymModal = ({ isModalOpen, closeModal, selectedGym }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [signUpUser, setSignUpUser] = useState({
    gymId: null,
    plan: null,
    paymentImage: "",
  });

  useEffect(() => {
    setSignUpUser((prevUser) => ({
      ...prevUser,
      gymId: selectedGym?._id,
    }));

    return () => {
      setSignUpUser({
        gymId: null,
        plan: null,
        paymentImage: "",
      });
    };
  }, [selectedGym]);

  const userJoinGymMutation = useMutation(
    async (formData) => {
      return postUserJoinGym(
        formData.plan,
        formData.gymId,
        formData.paymentImage
      );
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("gymOwners");
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });
        closeModal();
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

  const handlePlanChange = (event) => {
    const selectedPlanId = event.target.value;

    const selectedPlanObject = selectedGym?.gym?.plans.find(
      (plan) => plan._id === selectedPlanId
    );

    setSignUpUser({
      ...signUpUser,
      plan: selectedPlanObject,
    });
  };

  const handleUserJoinGym = () => {
    userJoinGymMutation.mutate(signUpUser);
    // closeModal();
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
      setSignUpUser((form) => {
        return {
          ...form,
          paymentImage: reader.result,
          paymentImageName:
            file.name.length > 15
              ? file.name.split(".")[0]
              : file.name.split(".")[0],
          paymentImageType: file.type.split("/")[1],
        };
      });
    };
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent paddingInline="2rem" maxWidth="35rem">
        <ModalHeader>Join at {selectedGym?.gym.gymname}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="1rem">
            <Box>
              <Text fontWeight="bold">Membership Type</Text>
              <Select
                onChange={handlePlanChange}
                placeholder="Select Membership Type"
              >
                {selectedGym?.gym?.plans.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.planName} ({item.duration} days)
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text fontWeight="bold">Duration</Text>
              <Input
                color="black"
                variant="filled"
                value={
                  signUpUser.plan ? `${signUpUser.plan?.duration} days` : "n/a"
                }
                type="text"
                disabled
              />
            </Box>
            <Box>
              <Text fontWeight="bold">Membership Fee</Text>
              <Input
                color="black"
                variant="filled"
                value={
                  signUpUser.plan ? `PHP ${signUpUser.plan?.amount}` : "n/a"
                }
                type="text"
                disabled
              />
            </Box>
            <Box>
              <Text fontWeight="bold">Proof of Payment</Text>
              <Text>Owner GCash Number: {selectedGym?.gym.gcashNumber}</Text>
              <Flex alignItems="center" mt="1rem">
                <Input
                  id="upload-payment"
                  type="file"
                  display="none"
                  onChange={handleFileChange}
                />
                <Button
                  as="label"
                  htmlFor="upload-payment"
                  marginInline="0.8rem 1.2rem"
                  cursor="pointer"
                  // disabled={registerMutation.isLoading}
                >
                  Choose file
                </Button>

                {signUpUser?.paymentImageName?.length > 0 ? (
                  <Text>
                    {signUpUser?.paymentImageName?.length > 10
                      ? signUpUser?.paymentImageName
                          .slice(0, 10)
                          .concat(`...${signUpUser?.paymentImageType}`)
                      : signUpUser?.paymentImageName?.concat(
                          `.${signUpUser?.paymentImageType}`
                        )}
                  </Text>
                ) : (
                  <Text>No file uploaded</Text>
                )}
              </Flex>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={closeModal}>
            Close
          </Button>
          <Button
            bgColor="brand.100"
            color="neutral.100"
            isLoading={userJoinGymMutation.isLoading}
            onClick={handleUserJoinGym}
          >
            Sign Up
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserJoinOtherGymModal;
