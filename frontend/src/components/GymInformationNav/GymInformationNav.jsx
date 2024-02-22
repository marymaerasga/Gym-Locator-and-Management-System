import React from "react";
import { Link as ReachLink } from "react-router-dom";
import { Flex, Text, Link } from "@chakra-ui/react";

const GymInformationNav = ({ name, route }) => {
  return (
    <Link as={ReachLink} to={route} _hover={{ textDecoration: "none" }}>
      <Flex
        alignItems="center"
        height="3rem"
        width="full"
        paddingLeft="5.5rem"
        cursor="pointer"
        color="neutral.100"
        fontSize="18px"
        fontWeight="600"
        transition="color 0.2s"
        _hover={{
          bgColor: "neutral.100",
          color: "brand.100",
          borderRight: "1px solid #86B817",
        }}
      >
        <Text>{name}</Text>
      </Flex>
    </Link>
  );
};

export default GymInformationNav;
