// import React from "react";
// import { Box } from "@chakra-ui/react";

// const Pagination = () => {
//   return (
//     <Box>
//       {gymMembers?.length !== 0 && !gymMemberLoading ? (
//         <Flex
//           alignItems="center"
//           gap={5}
//           mt={5}
//           justifyContent="center"
//           mr={10}
//         >
//           <Button
//             isDisabled={currentPage === 1}
//             onClick={() => {
//               if (currentPage !== 1) setCurrentPage(currentPage - 1);
//             }}
//           >
//             Previous
//           </Button>
//           {currentPage} of {Math.ceil(gymMembers?.length / itemsPerPage)}
//           <Button
//             isDisabled={
//               currentPage === Math.ceil(gymMembers?.length / itemsPerPage)
//             }
//             onClick={() => {
//               if (currentPage !== posts.length) setCurrentPage(currentPage + 1);
//             }}
//           >
//             Next
//           </Button>
//         </Flex>
//       ) : null}
//     </Box>
//   );
// };

// export default Pagination;
