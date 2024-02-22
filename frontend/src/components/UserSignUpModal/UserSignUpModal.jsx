import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  Box,
  Flex,
  Text,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  Select,
  ModalFooter,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { postRegisterUser } from "../../api/userApi/userApi";
import { useMutation } from "react-query";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const UserSignUpModal = ({
  isModalOpen,
  closeModal,
  selectedGym,
  modalName,
  mutationFunc,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [show, setShow] = useState(false);
  const handleShowPassword = () => setShow(!show);

  const [signUpUser, setSignUpUser] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    contact: "",
    address: "",
    dateOfBirth: "",
    gymId: null,
    plan: null,
    gender: "",
    password: "",
    paymentImage: "",
  });

  useEffect(() => {
    setSignUpUser((prevUser) => ({
      ...prevUser,
      gymId: selectedGym?._id,
    }));

    return () => {
      setSignUpUser({
        firstname: "",
        middlename: "",
        lastname: "",
        email: "",
        contact: "",
        address: "",
        dateOfBirth: "",
        gymId: null,
        plan: null,
        gender: "",
        password: "",
        paymentImage: "",
      });
      setShow(false);
    };
  }, [selectedGym]);

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

  const handleCloseModal = () => {
    setShow(false);
    closeModal();
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
    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent paddingInline="2rem" maxWidth="35rem">
        <ModalHeader>{modalName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="1rem">
            <Box>
              <Text fontWeight="bold">First Name</Text>
              <Input
                onChange={(e) =>
                  setSignUpUser({
                    ...signUpUser,
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
                  setSignUpUser({
                    ...signUpUser,
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
                  setSignUpUser({
                    ...signUpUser,
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
                  setSignUpUser({
                    ...signUpUser,
                    email: e.target.value,
                  })
                }
                type="email"
                placeholder="Email"
              />
            </Box>
            <Box>
              <Text fontWeight="bold">Phone Number</Text>
              <Input
                onChange={(e) =>
                  setSignUpUser({
                    ...signUpUser,
                    contact: e.target.value,
                  })
                }
                type="text"
                placeholder="Phone Number"
              />
            </Box>
            <Box>
              <Text fontWeight="bold">Address</Text>
              <Textarea
                onChange={(e) =>
                  setSignUpUser({
                    ...signUpUser,
                    address: e.target.value,
                  })
                }
                placeholder="Type your address here..."
              />
            </Box>
            <Box>
              <Text fontWeight="bold">Birthdate</Text>
              <Input
                onChange={(e) =>
                  setSignUpUser({
                    ...signUpUser,
                    dateOfBirth: e.target.value,
                  })
                }
                type="date"
              />
            </Box>
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
            {modalName !== "Add New Member" ? (
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
            ) : null}

            <Box>
              <Text fontWeight="bold">Gender</Text>
              <Select
                onChange={(e) =>
                  setSignUpUser({
                    ...signUpUser,
                    gender: e.target.value,
                  })
                }
                placeholder="Select Gender"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </Box>
            <Box>
              <Text fontWeight="bold">Password</Text>
              <InputGroup>
                <Input
                  onChange={(e) =>
                    setSignUpUser({
                      ...signUpUser,
                      password: e.target.value,
                    })
                  }
                  type={show ? "text" : "password"}
                  placeholder="Password"
                />
                <InputRightElement width="4.5rem" bgColor="none" height="100%">
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
          <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            bgColor="brand.100"
            color="neutral.100"
            isLoading={mutationFunc.isLoading}
            onClick={() => mutationFunc.mutate(signUpUser)}
            // onClick={() => console.log(signUpUser)}
          >
            Sign Up
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserSignUpModal;
