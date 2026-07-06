import React, { useEffect, useState } from "react";
import { getProfile, getUserAttempts } from "../../utils/api";
import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  VStack,
  HStack,
  useColorModeValue,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.900", "gray.50");
  const mutedText = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const profileResponse = await getProfile();
        const attemptsResponse = await getUserAttempts();
        setUser(profileResponse.user || null);
        setAttempts(attemptsResponse.attempts || []);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <Box
        bg={bgColor}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="lg" color={textColor}>
          Loading...
        </Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        bg={bgColor}
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Heading color={textColor}>Not Logged In</Heading>
          <Text color={mutedText}>Please log in to view your profile</Text>
        </VStack>
      </Box>
    );
  }

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  };

  const stats = {
    attempts: attempts.length,
    correct: attempts.reduce((sum, a) => sum + (a.correct || 0), 0),
    total: attempts.reduce((sum, a) => sum + (a.total || 0), 0),
  };

  const avgScore =
    stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(2) : 0;

  return (
    <Box
      bg={bgColor}
      minH="100vh"
      py={{ base: 4, sm: 6, md: 8 }}
      px={{ base: 3, sm: 4, md: 0 }}
      color={textColor}
    >
      <Container maxW="6xl" px={{ base: 0, sm: 3, md: 4 }}>
        <VStack spacing={{ base: 3, sm: 4, md: 6 }} align="stretch">
          <Box
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
          >
            <HStack
              spacing={{ base: 3, md: 4 }}
              align={{ base: "center", md: "start" }}
              direction={{ base: "column", md: "row" }}
            >
              <Avatar
                size={{ base: "md", md: "lg" }}
                bg="purple.500"
                color="white"
                name={getInitials(user.name)}
              />
              <VStack align={{ base: "center", md: "start" }} spacing={1}>
                <Heading size={{ base: "md", md: "lg" }} color={textColor}>
                  {user.name}
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color={mutedText}>
                  {user.email}
                </Text>
              </VStack>
            </HStack>
          </Box>

          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 4 }}
            spacing={{ base: 3, md: 4 }}
          >
            <Box
              bg={cardBg}
              p={{ base: 3, md: 4 }}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
            >
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={mutedText}
                mb={2}
              >
                Total Attempts
              </Text>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color={textColor}
              >
                {stats.attempts}
              </Text>
            </Box>
            <Box
              bg={cardBg}
              p={{ base: 3, md: 4 }}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
            >
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={mutedText}
                mb={2}
              >
                Correct Answers
              </Text>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color="green.500"
              >
                {stats.correct}
              </Text>
            </Box>
            <Box
              bg={cardBg}
              p={{ base: 3, md: 4 }}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
            >
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={mutedText}
                mb={2}
              >
                Total Questions
              </Text>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color="orange.500"
              >
                {stats.total}
              </Text>
            </Box>
            <Box
              bg={cardBg}
              p={{ base: 3, md: 4 }}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
            >
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={mutedText}
                mb={2}
              >
                Average Score
              </Text>
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color="purple.500"
              >
                {avgScore}%
              </Text>
            </Box>
          </SimpleGrid>

          <Box
            bg={cardBg}
            p={{ base: 4, md: 6 }}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
          >
            <Heading size={{ base: "sm", md: "md" }} mb={4} color={textColor}>
              Quiz Attempts
            </Heading>
            {attempts.length === 0 ? (
              <Text color={mutedText} textAlign="center" py={4}>
                No quiz attempts yet. Complete a quiz to see your results here!
              </Text>
            ) : (
              <Box overflowX="auto">
                <Table size={{ base: "sm", md: "md" }} variant="striped">
                  <Thead display={{ base: "none", md: "table-header-group" }}>
                    <Tr>
                      <Th color={mutedText}>Date</Th>
                      <Th color={mutedText}>Score</Th>
                      <Th color={mutedText}>Course</Th>
                      <Th color={mutedText}>Department</Th>
                      <Th color={mutedText}>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {attempts.map((attempt) => (
                      <Tr key={attempt._id || attempt.id}>
                        <Td>{new Date(attempt.date).toLocaleString()}</Td>
                        <Td>
                          {attempt.correct}/{attempt.total}
                        </Td>
                        <Td>{attempt.course || "General"}</Td>
                        <Td>{attempt.department || "All"}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              attempt.correct / attempt.total >= 0.5
                                ? "green"
                                : "red"
                            }
                          >
                            {((attempt.correct / attempt.total) * 100).toFixed(
                              0,
                            )}
                            %
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Profile;
