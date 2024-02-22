import React from "react";
import { Flex, Text, Box, Link, Icon } from "@chakra-ui/react";
import { IoLocationSharp } from "react-icons/io5";
import Nav from "../Nav/Nav";
import { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Flex
      justifyContent="space-between"
      paddingInline="2rem"
      height="97px"
      position="fixed"
      width="full"
      zIndex="1000"
      transition="background-color 0.3s ease"
      bgColor={isScrolled ? "neutral.100" : "black"}
      boxShadow={isScrolled ? "md" : "none"}
    >
      <Flex justifyContent="center" alignItems="center">
        <Icon
          as={IoLocationSharp}
          color="brand.100"
          fontSize="3rem"
          marginInline="1rem"
        />
        <Text
          color="brand.100"
          marginInline="auto"
          cursor="pointer"
          fontSize="2.5rem"
          fontWeight="800"
        >
          Gym Locator
        </Text>
      </Flex>
      <Box marginBlock="auto">
        <Nav isScrolled={isScrolled} />
      </Box>
    </Flex>
  );
};

export default Header;
