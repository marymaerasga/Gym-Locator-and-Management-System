import {
  Button,
  Center,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Link as ReachLink, useNavigate } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";
import { useState } from "react";

const NavMenuButton = ({ buttonName, route, isScrolled }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    // <Link as={ReachLink} to={route}>
    <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <MenuButton
        as={Button}
        onMouseEnter={handleMouseEnter}
        rightIcon={<IoChevronDown />}
        padding="0 1rem"
        marginBlock="1rem"
        cursor="pointer"
        color={isScrolled ? "brand.200" : "neutral.100"}
        fontSize="18px"
        fontWeight="600"
        transition="color 0.2s"
        _hover={{ color: "brand.100" }}
        _active={{ color: "brand.100" }}
        bgColor="transparent"
        _focusVisible={{ outline: "none" }}
      >
        {buttonName}
      </MenuButton>
      <MenuList onMouseLeave={handleMouseLeave}>
        <MenuItem onClick={() => navigate("/userlogin")}>User Login</MenuItem>
        <MenuItem onClick={() => navigate("/gym/login")}>
          Gym Owner Login
        </MenuItem>
        <MenuItem onClick={() => navigate("/trainerlogin")}>
          Trainer Login
        </MenuItem>
      </MenuList>
    </Menu>
    // </Link>
  );
};

export default NavMenuButton;
