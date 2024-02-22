import { Box, HStack } from "@chakra-ui/react";

import NavButton from "../../components/NavButton/NavButton";
import NavMenuButton from "../../components/NavButton/NavMenuButton";
import TokenService from "../../services/token";

const Nav = ({ isScrolled }) => {
  return (
    <Box as="nav">
      <HStack spacing="">
        <NavButton isScrolled={isScrolled} buttonName="Home" route="/" />
        <NavButton
          isScrolled={isScrolled}
          buttonName="Find a Gym"
          route="/explore"
        />

        {!TokenService.getUserLocal() ? (
          <>
            <NavButton
              isScrolled={isScrolled}
              buttonName="Own a Gym"
              route="/gym/signup"
            />
            <NavMenuButton
              isScrolled={isScrolled}
              buttonName="Login"
              route={null}
            />
          </>
        ) : (
          <NavButton
            isScrolled={isScrolled}
            buttonName="Profile"
            route="/user"
          />
        )}

        {/* <NavButton
          isScrolled={isScrolled}
          buttonName="Login"
          route="/gym/login"
        /> */}
      </HStack>
    </Box>
  );
};

export default Nav;
