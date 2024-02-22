import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { Radio, HStack, Box } from "@chakra-ui/react";

export default function StarRating({ rating, setRating, count, size }) {
  // count:  number of stars you want, pass as props
  //size: size of star that you want

  const [hover, setHover] = useState(null);

  //   useEffect(() => {
  //     return () => {
  //       setRating(0);
  //     };
  //   }, []);

  return (
    <HStack spacing={"2px"} justify="center">
      {[...Array(count || 5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <Box
            as="label"
            key={index}
            color={ratingValue <= (hover || rating) ? "brand.100" : "#e4e5e9"}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          >
            <Radio
              name="rating"
              onChange={() => setRating(ratingValue)}
              value={ratingValue}
              display="none"
            />
            <FaStar
              cursor={"pointer"}
              size={size || 20}
              transition="color 200ms"
            />
          </Box>
        );
      })}
    </HStack>
  );
}
