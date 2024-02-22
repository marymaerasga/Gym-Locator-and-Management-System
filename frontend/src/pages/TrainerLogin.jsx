import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Image,
  Button,
  Input,
  Text,
  Center,
  Stack,
  HStack,
  InputGroup,
  InputRightElement,
  Icon,
  useToast,
} from "@chakra-ui/react";
import gym from "../assets/images/background.webp";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { Link as ReachLink, useNavigate } from "react-router-dom";
import GoHome from "../components/GoHome/GoHome";
import { useMutation } from "react-query";
import TokenService from "../services/token";
import { postLoginTrainer } from "../api/trainerApi/trainerApi";

const TrainerLogin = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const handleShowPassword = () => setShow(!show);

  const loginTrainerMutation = useMutation(
    async (formData) => {
      return postLoginTrainer(formData.email, formData.password);
    },
    {
      onSuccess: (data) => {
        TokenService.setTrainerLocal(JSON.stringify(data));
        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });
        navigate("/trainer");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // navigate("/user");
    // console.log(email, password);

    loginTrainerMutation.mutate({ email, password });
  };

  return (
    <Center
      minHeight="100vh"
      width="100%"
      backgroundImage={`url(${gym})`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      position="relative"
    >
      <Box width="22rem">
        <Stack spacing="0.5rem" marginBottom="1rem">
          <HStack spacing="0.5rem">
            <Box fontSize="2rem" color="neutral.100" fontWeight="800">
              Trainer
            </Box>
            <Box fontSize="2rem" color="brand.100" fontWeight="800">
              Login
            </Box>
          </HStack>

          <Text color="gray.200">Please sign in to continue</Text>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack spacing="0.5rem" marginBottom="1rem">
            <Input
              type="text"
              placeholder="Email Address"
              bgColor="neutral.100"
              height="50px"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Password"
                bgColor="neutral.100"
                height="50px"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </Stack>
          <Button
            color="neutral.100"
            bgColor="brand.100"
            width="full"
            _hover={{ color: "brand.100", bgColor: "gray.200" }}
            type="submit"
            // onClick={() => navigate("/trainer")}
            isLoading={loginTrainerMutation.isLoading}
          >
            Login
          </Button>
        </form>
      </Box>
      <GoHome />
    </Center>
  );
};

export default TrainerLogin;
