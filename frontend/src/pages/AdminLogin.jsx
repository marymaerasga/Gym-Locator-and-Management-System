import { useEffect, useState } from "react";
import {
  Box,
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

// import useAdmin from "../store/admin";
import { useMutation, useQueryClient } from "react-query";
import { postLoginAdmin } from "../api/adminApi/adminApi";
import TokenService from "../services/token";

const AdminLogin = () => {
  const toast = useToast();

  // const { admin, loginAdmin, addAdmin, updateAdmin, removeAdmin } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const handleShowPassword = () => setShow(!show);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("adminInfo")) {
      navigate("/admin");
    }
  }, [navigate, localStorage.getItem("adminInfo")]);

  const queryClient = useQueryClient();

  const loginMutation = useMutation(
    async (formData) => {
      return postLoginAdmin(formData.email, formData.password);
    },
    {
      onSuccess: (data) => {
        // Save the data to localStorage or perform other actions
        TokenService.setAdminLocal(JSON.stringify(data));

        toast({
          title: data.message,
          status: "success",
          duration: 2000,
          position: "bottom-right",
        });

        // Invalidate and refetch any queries that depend on the user data
        queryClient.invalidateQueries("adminData");
      },
      onError: (error) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      loginMutation.mutate({ email, password });
    } catch (error) {
      console.error("Login failed:", error);
    }
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
              Admin
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
            isLoading={loginMutation.isLoading}
          >
            Login
          </Button>
        </form>
      </Box>
      <GoHome />
    </Center>
  );
};

export default AdminLogin;

// {
// headers: {
//   Authorization: `Bearer ${localStorage.getItem("adminInfo").token}`}`,

// },
// }

// const { data } = useQuery(["cat"], () => {
//   return Axios.get("https://catfact.ninja/fact").then((res) => res.data);
// });

// const { data } = useQuery(["cat"], () => {
//   return Axios.get("https://catfact.ninja/fact", {}).then((res) => res.data);
// });

// const { data, isLoading } = useQuery(["ownersList"], async () => {
//   return axios
//     .get("", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("adminInfo").token}`,
//       },
//     })
//     .then((res) => res.data);
// });
