import {
  Box,
  Button,
  Text,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  VStack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useState } from "react";

const GymSignUpDetails = ({ setState, setSignUpForm, signUpForm }) => {
  const toast = useToast();

  const [show, setShow] = useState(false);
  const handleShowPassword = () => setShow(!show);

  return (
    <Box maxWidth="40rem">
      <Text color="gray.100" fontSize="3rem" fontWeight="800">
        Welcome to{" "}
        <Text as="span" color="brand.100">
          GYM Locator
        </Text>
      </Text>
      <Text fontSize="1.1rem" color="gray.300" marginBlock="0.8rem">
        Please sign up to continue
      </Text>
      <Divider />
      <Text fontSize="1.1rem" color="gray.300" marginBlock="0.8rem">
        Owner Personal Details
      </Text>

      <VStack spacing="1rem">
        <Flex width="100%" gap="1rem">
          <Input
            type="text"
            placeholder="First name"
            bgColor="neutral.100"
            height="45px"
            onChange={(e) =>
              setSignUpForm({
                ...signUpForm,
                firstname: e.target.value,
              })
            }
            value={signUpForm.firstname}
          />
          <Input
            type="text"
            placeholder="Middle name"
            bgColor="neutral.100"
            height="45px"
            onChange={(e) =>
              setSignUpForm({
                ...signUpForm,
                middlename: e.target.value,
              })
            }
            value={signUpForm.middlename}
          />
          <Input
            type="text"
            placeholder="Last name"
            bgColor="neutral.100"
            height="45px"
            onChange={(e) =>
              setSignUpForm({
                ...signUpForm,
                lastname: e.target.value,
              })
            }
            value={signUpForm.lastname}
          />
        </Flex>
        <Input
          type="email"
          placeholder="Email Address"
          bgColor="neutral.100"
          height="45px"
          onChange={(e) =>
            setSignUpForm({
              ...signUpForm,
              email: e.target.value,
            })
          }
          value={signUpForm.email}
        />
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Password"
            bgColor="neutral.100"
            height="45px"
            onChange={(e) =>
              setSignUpForm({
                ...signUpForm,
                password: e.target.value,
              })
            }
            value={signUpForm.password}
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
      </VStack>
      <Button
        width="100%"
        bgColor="brand.100"
        color="neutral.100"
        marginTop="1rem"
        height="45px"
        _hover={{ bgColor: "gray.400", color: "brand.200" }}
        fontSize="1.1rem"
        onClick={() => {
          if (
            signUpForm.firstname.length === 0 ||
            signUpForm.middlename.length === 0 ||
            signUpForm.lastname.length === 0 ||
            signUpForm.email.length === 0 ||
            signUpForm.password.length === 0
          ) {
            toast({
              title: "All fields are required",
              status: "error",
              duration: 2000,
              position: "bottom-right",
            });
            return;
          } else {
            setState("info");
          }
        }}
      >
        Next
      </Button>
    </Box>
  );
};

export default GymSignUpDetails;
