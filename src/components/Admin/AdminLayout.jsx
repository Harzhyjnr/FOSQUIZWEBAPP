import React from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/logo.png";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("#212832", "gray.900");
  const textColor = useColorModeValue("white", "gray.50");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Admin Header */}
      <Flex
        bg={bgColor}
        borderBottom="1px solid"
        borderColor={useColorModeValue("gray.300", "gray.700")}
        p={4}
        align="center"
        justify="space-between"
        boxShadow="sm"
      >
        {/* Logo */}
        <Flex align="center" gap={3}>
          <Box as="img" src={logo} h="10" w="10" />
          <Heading size="lg" color={textColor}>
            Admin Dashboard
          </Heading>
        </Flex>

        {/* Logout Button */}
        <Button colorScheme="red" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>

      {/* Content */}
      <Box width="100%" minHeight="100vh">
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
