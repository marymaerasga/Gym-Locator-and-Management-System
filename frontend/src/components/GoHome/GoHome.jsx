import { Button, Icon } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const GoHome = () => {
  const navigate = useNavigate();

  return (
    <Button
      padding="1rem"
      position="absolute"
      bottom="8rem"
      right="8rem"
      bgColor="brand.100"
      cursor="pointer"
      height="50px"
      width="50px"
      onClick={() => navigate("/")}
    >
      <Icon as={FaArrowLeft} color="neutral.100" fontSize="1.2rem" />
    </Button>
  );
};

export default GoHome;
