import { Outlet } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import Header from "../layout/Header/Header";
import HomeSearch from "../layout/HomeSearch/HomeSearch";
import Feature from "../layout/Feature/Feature";
import HomeFooter from "../layout/Footer/HomeFooter";

const Home = () => {
  return (
    <Flex flexDirection="column">
      <Header />
      <HomeSearch />
      <Feature />
      <HomeFooter />
    </Flex>
  );
};

export default Home;
