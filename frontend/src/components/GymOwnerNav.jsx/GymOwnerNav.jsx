import { Box, Link, Flex, Text } from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom";

import React from "react";

const GymOwnerNav = ({ route, name, onClick }) => {
  return (
    <Link as={ReachLink} to={route} _hover={{ textDecoration: "none" }}>
      <Flex
        alignItems="center"
        height="4rem"
        width="full"
        paddingLeft="3rem"
        cursor="pointer"
        color="neutral.100"
        fontSize="19px"
        fontWeight="600"
        transition="color 0.2s"
        onClick={onClick ? onClick : null}
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

export default GymOwnerNav;
