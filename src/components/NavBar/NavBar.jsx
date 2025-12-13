import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Button,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, InfoIcon } from '@chakra-ui/icons';
import logo from './../../Assets/logo.png';
import { Link as ReachLink } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

export default function BetterNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        bg={useColorModeValue('#212832', 'gray.900')}
        px={4}
        borderBottom="1px solid"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Left: Logo */}
          <Avatar size="sm" src={logo} w={10} h={10} />

          {/* Center: Navigation Links (Desktop only) */}
          <HStack
            as="nav"
            spacing={8}
            display={{ base: 'none', md: 'flex' }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            <ReachLink
              px={3}
              py={2}
              rounded="md"
              _hover={{ textDecoration: 'none', bg: 'rgba(102, 126, 234, 0.1)' }}
              to="/"
            >
              <HStack spacing={2}>
                <FaHome />
                <Text fontWeight="bold">Home</Text>
              </HStack>
            </ReachLink>
            <ReachLink
              px={3}
              py={2}
              rounded="md"
              _hover={{ textDecoration: 'none', bg: 'rgba(102, 126, 234, 0.1)' }}
              to="/about"
            >
              <HStack spacing={2}>
                <InfoIcon />
                <Text fontWeight="bold">About</Text>
              </HStack>
            </ReachLink>
          </HStack>

          {/* Right: Signup Button and Hamburger Menu */}
          <HStack spacing={2}>
            {/* Signup Button (Desktop) */}
            <ReachLink to="/signup">
              <Button
                display={{ base: 'none', md: 'flex' }}
                colorScheme="purple"
                variant="solid"
                size="sm"
                fontWeight="bold"
                _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)' }}
                transition="all 0.3s ease"
              >
                Sign Up
              </Button>
            </ReachLink>

            {/* Signup Button (Mobile) - beside hamburger menu */}
            <ReachLink to="/signup">
              <Button
                display={{ base: 'flex', md: 'none' }}
                colorScheme="purple"
                variant="solid"
                size="xs"
                fontWeight="bold"
                _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)' }}
                transition="all 0.3s ease"
              >
                Sign Up
              </Button>
            </ReachLink>

            {/* Hamburger Menu Icon (Mobile only) */}
            <IconButton
              bg="transparent"
              _hover={{
                bg: 'rgba(102, 126, 234, 0.1)',
              }}
              size="md"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label="Open Menu"
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
          </HStack>
        </Flex>

        {/* Mobile Menu */}
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={4}>
              <ReachLink
                px={2}
                py={1}
                rounded="md"
                _hover={{ textDecoration: 'none', bg: 'rgba(102, 126, 234, 0.1)' }}
                to="/"
              >
                <HStack spacing={2}>
                  <FaHome />
                  <Text fontWeight="bold">Home</Text>
                </HStack>
              </ReachLink>
              <ReachLink
                px={2}
                py={1}
                rounded="md"
                _hover={{ textDecoration: 'none', bg: 'rgba(102, 126, 234, 0.1)' }}
                to="/about"
              >
                <HStack spacing={2}>
                  <InfoIcon />
                  <Text fontWeight="bold">About</Text>
                </HStack>
              </ReachLink>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
