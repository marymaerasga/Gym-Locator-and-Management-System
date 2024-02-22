import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rating = 0, gap }) => {
  const maxStars = 5;
  const roundedRating = Math.min(Math.round(rating * 2) / 2, maxStars);
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;

  return (
    <Flex flexDirection="row" justifyContent="center" gap={gap}>
      {[...Array(fullStars)].map((_, index) => (
        <Icon key={index} as={FaStar} color="brand.100" boxSize={4} />
      ))}
      {hasHalfStar && fullStars < maxStars && (
        <Icon as={FaStarHalfAlt} color="brand.100" boxSize={4} />
      )}
      {[...Array(maxStars - fullStars - (hasHalfStar ? 1 : 0))].map(
        (_, index) => (
          <Icon
            key={index + fullStars}
            as={FaStar}
            color="gray.400"
            boxSize={4}
          />
        )
      )}
    </Flex>
  );
};

export default StarRating;
