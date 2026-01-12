import React, { useState } from "react";
import { addFeedback } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Textarea,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
} from "@chakra-ui/react";
import { FiSend, FiCheckCircle } from "react-icons/fi";

const Feedback = () => {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // All hooks at the top level
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("purple.500", "purple.400");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const tipsBg = useColorModeValue("blue.50", "blue.900");
  const pageTextColor = useColorModeValue("gray.900", "gray.50");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim()) return setError("Please enter your feedback");

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user")) || null;
      addFeedback({
        id: Date.now().toString(),
        userId: user?.id || null,
        userName: user?.name || "Guest",
        message: text.trim(),
        date: new Date().toISOString(),
      });
      setText("");
      setSent(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (e) {
      console.error(e);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      bg={bgColor}
      minH="80vh"
      py={12}
      color={pageTextColor}
      w="100%"
      position="relative"
      zIndex={10}
      display="block"
    >
      <Container maxW="2xl" w="100%" px={4}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={2} align="start" mb={4}>
            <Heading
              size="2xl"
              bgGradient="linear(to-r, purple.400, pink.600)"
              bgClip="text"
            >
              Share Your Feedback
            </Heading>
            <Text color="gray.500" fontSize="lg">
              We value your thoughts and suggestions to improve our quiz
              application
            </Text>
          </VStack>

          {/* Success Message */}
          {sent && (
            <Alert
              status="success"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="auto"
              borderRadius="lg"
              py={6}
            >
              <AlertIcon as={FiCheckCircle} boxSize={8} mb={2} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Thank you for your feedback!
              </AlertTitle>
              <AlertDescription fontSize="md">
                Your message has been submitted successfully. Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && !sent && (
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Feedback Form */}
          {!sent && (
            <Box
              bg={cardBg}
              p={8}
              borderRadius="xl"
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Text
                      mb={3}
                      fontWeight="600"
                      fontSize="md"
                      color={textColor}
                    >
                      Your Feedback
                    </Text>
                    <Textarea
                      placeholder="Tell us about your experience with the quiz app. What did you like? What can we improve?"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      minH="160px"
                      p={4}
                      borderColor={borderColor}
                      borderWidth="2px"
                      borderRadius="lg"
                      _focus={{
                        borderColor: accentColor,
                        boxShadow: `0 0 0 1px ${accentColor}`,
                      }}
                      _placeholder={{
                        color: "gray.400",
                      }}
                      resize="vertical"
                    />
                    <Text mt={2} fontSize="sm" color="gray.500">
                      {text.length} characters
                    </Text>
                  </Box>

                  <Button
                    type="submit"
                    bgGradient="linear(to-r, purple.500, pink.500)"
                    color="white"
                    size="lg"
                    fontWeight="bold"
                    isDisabled={!text.trim() || loading}
                    _hover={{
                      bgGradient: "linear(to-r, purple.600, pink.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                    transition="all 0.3s ease"
                  >
                    {loading ? (
                      <HStack spacing={2}>
                        <Spinner size="sm" />
                        <Text>Sending...</Text>
                      </HStack>
                    ) : (
                      <HStack spacing={2}>
                        <Icon as={FiSend} />
                        <Text>Send Feedback</Text>
                      </HStack>
                    )}
                  </Button>
                </VStack>
              </form>
            </Box>
          )}

          {/* Tips Section */}
          {!sent && (
            <Box
              bg={tipsBg}
              p={6}
              borderRadius="lg"
              borderLeftWidth="4px"
              borderLeftColor="blue.500"
            >
              <Heading size="sm" mb={3} color="blue.600">
                Helpful Tips
              </Heading>
              <VStack align="start" spacing={2} fontSize="sm" color="gray.600">
                <Text>• Be specific about what you liked or didn't like</Text>
                <Text>• Suggest features you'd like to see</Text>
                <Text>
                  • Let us know about any bugs or issues you encountered
                </Text>
                <Text>
                  • Your feedback helps us improve the app for everyone
                </Text>
              </VStack>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Feedback;
