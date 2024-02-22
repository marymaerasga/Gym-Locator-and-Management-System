import React from "react";
import { Flex, Box, Text, ListItem, ListIcon, List } from "@chakra-ui/react";
import { FaAngleRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

// FaAngleRight

const HomeFooter = () => {
  return (
    <Flex
      flexDir="column"
      bgColor="brand.200"
      color="neutral.100"
      padding="1.2rem 8rem"
      alignItems="center"
    >
      {/* <Flex flexDirection="column" marginRight="25rem">
        <Text fontSize="1.5rem" fontWeight="800" marginBottom="1rem">
          Company
        </Text>
        <List spacing={3}>
          <ListItem cursor="pointer" _hover={{ color: "brand.100" }}>
            <ListIcon as={FaAngleRight} />
            About Us
          </ListItem>
          <ListItem cursor="pointer" _hover={{ color: "brand.100" }}>
            <ListIcon as={FaAngleRight} />
            Contact Us
          </ListItem>
          <ListItem cursor="pointer" _hover={{ color: "brand.100" }}>
            <ListIcon as={FaAngleRight} />
            Privacy Policy
          </ListItem>
          <ListItem cursor="pointer" _hover={{ color: "brand.100" }}>
            <ListIcon as={FaAngleRight} />
            Terms & Condition
          </ListItem>
          <ListItem cursor="pointer" _hover={{ color: "brand.100" }}>
            <ListIcon as={FaAngleRight} />
            FAQs & Help
          </ListItem>
        </List>
      </Flex> */}
      {/* <Flex flexDirection="column">
        <Text fontSize="1.5rem" fontWeight="800" marginBottom="1rem">
          Contact
        </Text>
        <List spacing={3}>
          <ListItem cursor="pointer" _hover={{ color: "brand.100" }}>
            <ListIcon as={FaLocationDot} />
            123 Street, Philippines
          </ListItem>
          <ListItem cursor="pointer" _hover={{ color: "brand.100" }}>
            <ListIcon as={FaPhoneAlt} />
            +63 965 345 6789
          </ListItem>
          <ListItem cursor="pointer" _hover={{ color: "brand.100" }}>
            <ListIcon as={MdEmail} />
            gymlocator@gmail.com
          </ListItem>
        </List>
      </Flex> */}
      {/* <Box fontWeight="800" fontSize="1.2rem" mb="1rem">
        Contact
      </Box> */}
      <Flex>
        <Box>
          <Text as="span" fontWeight="800">
            Gym Locator
          </Text>{" "}
          © Copyright 2024, Inc. All rights reserved.
        </Box>
        {/* <Box>123 Street, Philippines</Box>
        <Box>+63 965 345 6789</Box>
        <Box>gymlocator@gmail.com</Box> */}
      </Flex>
    </Flex>
  );
};

export default HomeFooter;
