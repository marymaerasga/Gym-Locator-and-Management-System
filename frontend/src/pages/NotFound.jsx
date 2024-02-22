import React, { useEffect } from "react";
import { Text, Center } from "@chakra-ui/react";
import gym from "../assets/images/background.webp";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate("/");
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <Center
      minHeight="100vh"
      width="100%"
      backgroundImage={`url(${gym})`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
    >
      <Text fontSize="5rem" fontWeight="800" color="brand.100">
        404 Page Not Found
      </Text>
    </Center>
  );
};

export default NotFound;
