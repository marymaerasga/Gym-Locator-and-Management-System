import { Center, Link } from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom";

const NavButton = ({ buttonName, route, isScrolled }) => {
  return (
    <Link as={ReachLink} to={route}>
      <Center
        padding="0 1rem"
        marginBlock="1rem"
        cursor="pointer"
        color={isScrolled ? "brand.200" : "neutral.100"}
        fontSize="18px"
        fontWeight="600"
        transition="color 0.2s"
        _hover={{ color: "brand.100" }}
        _active={{ color: "brand.100" }}
      >
        {buttonName}
      </Center>
    </Link>
  );
};

export default NavButton;
