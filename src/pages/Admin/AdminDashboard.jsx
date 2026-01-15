import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Button,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import {
  addQuestion,
  getQuestions,
  deleteQuestion,
  updateQuestion,
} from "../../utils/storage";

const empty = {
  level: "100",
  department: "",
  course: "",
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
};

const AdminDashboard = () => {
  const [form, setForm] = useState(empty);
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState([]);
  const toast = useToast();

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.900", "gray.50");
  const labelColor = useColorModeValue("gray.700", "gray.300");
  const inputBg = useColorModeValue("white", "gray.700");
  const questionBg = useColorModeValue("gray.50", "gray.700");
  const headerBg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    loadQuestions();
    loadUsers();
  }, []);

  const loadQuestions = () => {
    setList(getQuestions());
  };

  const loadUsers = () => {
    try {
      const usersData = JSON.parse(localStorage.getItem("users") || "[]");
      setUsers(usersData);
    } catch (e) {
      setUsers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (idx, val) => {
    const arr = [...form.options];
    arr[idx] = val;
    setForm((prev) => ({ ...prev, options: arr }));
  };

  const validateForm = () => {
    if (!form.department.trim()) {
      toast({
        title: "Department is required",
        status: "error",
        duration: 3000,
      });
      return false;
    }
    if (!form.course.trim()) {
      toast({ title: "Course is required", status: "error", duration: 3000 });
      return false;
    }
    if (!form.question.trim()) {
      toast({ title: "Question is required", status: "error", duration: 3000 });
      return false;
    }
    if (form.options.some((opt) => !opt.trim())) {
      toast({
        title: "All options must be filled",
        status: "error",
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const q = {
      id: editingId || Date.now().toString(),
      level: form.level,
      department: form.department,
      course: form.course,
      question: form.question,
      options: form.options,
      correctAnswer: form.options[form.correctIndex],
    };

    if (editingId) {
      updateQuestion(editingId, q);
      toast({
        title: "Question updated",
        status: "success",
        duration: 2000,
      });
    } else {
      addQuestion(q);
      toast({
        title: "Question added",
        status: "success",
        duration: 2000,
      });
    }

    loadQuestions();
    setForm(empty);
    setEditingId(null);
  };

  const handleEdit = (q) => {
    setEditingId(q.id);
    setForm({
      level: q.level,
      department: q.department,
      course: q.course,
      question: q.question,
      options: q.options,
      correctIndex: q.options.indexOf(q.correctAnswer),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    deleteQuestion(id);
    loadQuestions();
    toast({
      title: "Question deleted",
      status: "info",
      duration: 2000,
    });
  };

  const handleCancel = () => {
    setForm(empty);
    setEditingId(null);
  };

  const toggleAdmin = (userId) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updated = allUsers.map((us) =>
      us.id === userId ? { ...us, isAdmin: !us.isAdmin } : us
    );
    localStorage.setItem("users", JSON.stringify(updated));
    loadUsers();
    toast({
      title: updated.find((u) => u.id === userId).isAdmin
        ? "Admin rights granted"
        : "Admin rights revoked",
      status: "success",
      duration: 2000,
    });
  };

  return (
    <Box
      bg={bgColor}
      minH="100vh"
      py={{ base: 4, md: 8 }}
      px={{ base: 3, md: 0 }}
    >
      <Container maxW="6xl">
        <VStack spacing={{ base: 6, md: 8 }} align="stretch">
          {/* Header */}
          <Box>
            <Heading size={{ base: "xl", md: "2xl" }} color={textColor} mb={2}>
              Admin Dashboard
            </Heading>
            <Text color={labelColor}>
              Manage questions and user permissions
            </Text>
          </Box>

          {/* Question Form Card */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader borderBottomWidth="1px" borderColor={borderColor}>
              <Heading size="md" color={textColor}>
                {editingId ? "Edit Question" : "Add New Question"}
              </Heading>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  {/* Level and Department Row */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="600" color={labelColor} fontSize="sm">
                        Level
                      </Text>
                      <Select
                        name="level"
                        value={form.level}
                        onChange={handleChange}
                        bg={inputBg}
                        borderColor={borderColor}
                        color={textColor}
                      >
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                      </Select>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="600" color={labelColor} fontSize="sm">
                        Department *
                      </Text>
                      <Input
                        name="department"
                        placeholder="e.g., Computer Science"
                        value={form.department}
                        onChange={handleChange}
                        bg={inputBg}
                        borderColor={borderColor}
                        color={textColor}
                      />
                    </VStack>
                  </SimpleGrid>

                  {/* Course Row */}
                  <VStack align="start" spacing={2} w="100%">
                    <Text fontWeight="600" color={labelColor} fontSize="sm">
                      Course *
                    </Text>
                    <Input
                      name="course"
                      placeholder="e.g., Data Structures"
                      value={form.course}
                      onChange={handleChange}
                      bg={inputBg}
                      borderColor={borderColor}
                      color={textColor}
                    />
                  </VStack>

                  {/* Question Row */}
                  <VStack align="start" spacing={2} w="100%">
                    <Text fontWeight="600" color={labelColor} fontSize="sm">
                      Question *
                    </Text>
                    <Textarea
                      name="question"
                      placeholder="Enter your question here..."
                      value={form.question}
                      onChange={handleChange}
                      minH="100px"
                      bg={inputBg}
                      borderColor={borderColor}
                      color={textColor}
                    />
                  </VStack>

                  {/* Options Grid */}
                  <VStack align="start" spacing={2} w="100%">
                    <Text fontWeight="600" color={labelColor} fontSize="sm">
                      Options *
                    </Text>
                    <SimpleGrid
                      columns={{ base: 1, md: 2 }}
                      spacing={3}
                      w="100%"
                    >
                      {form.options.map((opt, idx) => (
                        <Input
                          key={idx}
                          value={opt}
                          onChange={(e) =>
                            handleOptionChange(idx, e.target.value)
                          }
                          placeholder={`Option ${idx + 1}`}
                          bg={inputBg}
                          borderColor={borderColor}
                          color={textColor}
                        />
                      ))}
                    </SimpleGrid>
                  </VStack>

                  {/* Correct Option Row */}
                  <VStack align="start" spacing={2} w="100%">
                    <Text fontWeight="600" color={labelColor} fontSize="sm">
                      Correct Option (0-3) *
                    </Text>
                    <Input
                      type="number"
                      min="0"
                      max="3"
                      name="correctIndex"
                      value={form.correctIndex}
                      onChange={handleChange}
                      bg={inputBg}
                      borderColor={borderColor}
                      color={textColor}
                    />
                  </VStack>

                  {/* Buttons */}
                  <HStack spacing={3} w="100%" pt={2}>
                    <Button
                      type="submit"
                      colorScheme="purple"
                      size="md"
                      leftIcon={editingId ? <EditIcon /> : <AddIcon />}
                    >
                      {editingId ? "Update Question" : "Add Question"}
                    </Button>
                    {editingId && (
                      <Button
                        variant="outline"
                        colorScheme="gray"
                        size="md"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    )}
                  </HStack>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Questions List Card */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader borderBottomWidth="1px" borderColor={borderColor}>
              <HStack justify="space-between">
                <Heading size="md" color={textColor}>
                  Existing Questions
                </Heading>
                <Badge colorScheme="blue">{list.length}</Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              {list.length === 0 ? (
                <Text color={labelColor} textAlign="center" py={8}>
                  No questions yet. Add your first question above!
                </Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {list.map((q) => (
                    <Box
                      key={q.id}
                      bg={questionBg}
                      p={4}
                      borderRadius="md"
                      borderLeft="4px"
                      borderColor="purple.500"
                    >
                      <VStack align="start" spacing={3} w="100%">
                        {/* Title */}
                        <HStack spacing={2} flexWrap="wrap">
                          <Badge colorScheme="blue">{q.level}</Badge>
                          <Text
                            fontWeight="600"
                            color={textColor}
                            fontSize={{ base: "sm", md: "md" }}
                          >
                            {q.department} — {q.course}
                          </Text>
                        </HStack>

                        {/* Question */}
                        <Text
                          color={textColor}
                          fontSize={{ base: "sm", md: "md" }}
                          dangerouslySetInnerHTML={{ __html: q.question }}
                        />

                        {/* Options */}
                        <Box w="100%">
                          <Text
                            fontSize="xs"
                            fontWeight="600"
                            color={labelColor}
                            mb={2}
                          >
                            Options:
                          </Text>
                          <VStack align="start" spacing={1} pl={4}>
                            {q.options.map((opt, idx) => (
                              <HStack key={idx} spacing={2}>
                                <Text
                                  fontSize="xs"
                                  color={
                                    opt === q.correctAnswer
                                      ? "green.500"
                                      : textColor
                                  }
                                  fontWeight={
                                    opt === q.correctAnswer ? "bold" : "normal"
                                  }
                                >
                                  {String.fromCharCode(65 + idx)}. {opt}
                                  {opt === q.correctAnswer && (
                                    <Badge colorScheme="green" size="sm">
                                      Correct
                                    </Badge>
                                  )}
                                </Text>
                              </HStack>
                            ))}
                          </VStack>
                        </Box>

                        {/* Actions */}
                        <HStack spacing={2} pt={2}>
                          <Button
                            size="sm"
                            leftIcon={<EditIcon />}
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => handleEdit(q)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            leftIcon={<DeleteIcon />}
                            colorScheme="red"
                            variant="outline"
                            onClick={() => handleDelete(q.id)}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </CardBody>
          </Card>

          {/* Users Management Card */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader borderBottomWidth="1px" borderColor={borderColor}>
              <HStack justify="space-between">
                <Heading size="md" color={textColor}>
                  User Management
                </Heading>
                <Badge colorScheme="green">{users.length}</Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              {users.length === 0 ? (
                <Text color={labelColor} textAlign="center" py={8}>
                  No registered users yet.
                </Text>
              ) : (
                <Box overflowX="auto">
                  <Table size={{ base: "sm", md: "md" }} variant="simple">
                    <Thead>
                      <Tr bg={headerBg}>
                        <Th color={labelColor}>Name</Th>
                        <Th
                          color={labelColor}
                          display={{ base: "none", md: "table-cell" }}
                        >
                          Email
                        </Th>
                        <Th color={labelColor}>Status</Th>
                        <Th color={labelColor}>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((u) => (
                        <Tr key={u.id} borderBottomColor={borderColor}>
                          <Td
                            color={textColor}
                            fontWeight="500"
                            fontSize={{ base: "sm", md: "md" }}
                          >
                            <VStack align="start" spacing={0}>
                              <Text>{u.name}</Text>
                              <Text
                                display={{ base: "block", md: "none" }}
                                fontSize="xs"
                                color={labelColor}
                              >
                                {u.email}
                              </Text>
                            </VStack>
                          </Td>
                          <Td
                            color={labelColor}
                            display={{ base: "none", md: "table-cell" }}
                            fontSize={{ base: "sm", md: "md" }}
                          >
                            {u.email}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={u.isAdmin ? "purple" : "gray"}
                              variant="subtle"
                              fontSize={{ base: "xs", md: "sm" }}
                            >
                              {u.isAdmin ? "Admin" : "User"}
                            </Badge>
                          </Td>
                          <Td>
                            <Button
                              size="xs"
                              colorScheme={u.isAdmin ? "red" : "green"}
                              variant="outline"
                              onClick={() => toggleAdmin(u.id)}
                              fontSize={{ base: "xs", md: "sm" }}
                            >
                              {u.isAdmin ? "Revoke" : "Make Admin"}
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
