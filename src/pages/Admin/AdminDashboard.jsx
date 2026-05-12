import React, { useState, useEffect, useRef } from "react";
import {
  Box,
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  EditIcon,
  AddIcon,
  HamburgerIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import {
  addQuestion,
  getQuestions,
  deleteQuestion,
  updateQuestion,
  getFeedbacks,
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
  const [feedbacks, setFeedbacks] = useState([]);
  const [activeTab, setActiveTab] = useState("questions");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const csvFileRef = useRef(null);

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
    loadFeedbacks();
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

  const loadFeedbacks = () => {
    try {
      const feedbacksData = getFeedbacks();
      setFeedbacks(feedbacksData);
    } catch (e) {
      setFeedbacks([]);
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

  // CSV Upload Handler
  const downloadTemplateCSV = () => {
    const headers =
      "Level,Department,Course,Question,Option A,Option B,Option C,Option D,Correct Answer";
    const sampleRow =
      '100,Computer Science,COS101,"What does CPU stand for?","Central Processing Unit","Central Performance Unit","Compute Processing Unit","Control Processing Unit","Central Processing Unit"';
    const csvContent = `${headers}\n${sampleRow}`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent),
    );
    element.setAttribute("download", "questions_template.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Template downloaded",
      description: "Fill in your questions and upload the CSV file",
      status: "success",
      duration: 2000,
    });
  };

  const parseCSV = (text) => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error("CSV must contain at least header and one data row");
    }

    const [, ...rows] = lines;

    return rows.map((row, idx) => {
      const values = row
        .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
        .map((v) => v.trim().replace(/^"|"$/g, "").trim());

      if (values.length < 9) {
        throw new Error(`Row ${idx + 2}: Not enough columns`);
      }

      const [
        level,
        department,
        course,
        question,
        optA,
        optB,
        optC,
        optD,
        correctAnswer,
      ] = values;

      if (!level || !department || !course || !question) {
        throw new Error(`Row ${idx + 2}: Missing required fields`);
      }

      const options = [optA, optB, optC, optD];
      if (options.some((opt) => !opt.trim())) {
        throw new Error(`Row ${idx + 2}: All options must be filled`);
      }

      // Find correct answer - can be "A"/"B"/"C"/"D" or full text
      const correctAnswerTrimmed = correctAnswer.trim().toUpperCase();
      let correctIndex = -1;

      // Check if it's a letter (A, B, C, D)
      if (correctAnswerTrimmed === "A") {
        correctIndex = 0;
      } else if (correctAnswerTrimmed === "B") {
        correctIndex = 1;
      } else if (correctAnswerTrimmed === "C") {
        correctIndex = 2;
      } else if (correctAnswerTrimmed === "D") {
        correctIndex = 3;
      } else {
        // Try to match against option text
        correctIndex = options.findIndex(
          (opt) =>
            opt.trim().toLowerCase() === correctAnswerTrimmed.toLowerCase(),
        );
      }

      if (correctIndex === -1) {
        throw new Error(
          `Row ${idx + 2}: Correct answer "${correctAnswer}" must be A, B, C, D or match one of the options.`,
        );
      }

      return {
        id: Date.now().toString() + Math.random(),
        level,
        department,
        course,
        question,
        options,
        correctAnswer: options[correctIndex],
      };
    });
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== "string") throw new Error("Invalid file");

        const questions = parseCSV(text);

        // Add all questions
        questions.forEach((q) => addQuestion(q));

        loadQuestions();
        toast({
          title: "Success!",
          description: `Imported ${questions.length} questions successfully`,
          status: "success",
          duration: 3000,
        });

        // Reset file input
        if (e.target) e.target.value = "";
      } catch (error) {
        toast({
          title: "Import Error",
          description:
            error instanceof Error ? error.message : "Failed to parse CSV",
          status: "error",
          duration: 4000,
        });
      }
    };

    reader.readAsText(file);
  };

  const toggleAdmin = (userId) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updated = allUsers.map((us) =>
      us.id === userId ? { ...us, isAdmin: !us.isAdmin } : us,
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

  // Group questions by department + course for easier navigation
  const groupedByCourse = () => {
    const grouped = list.reduce((acc, q) => {
      const key = `${q.department}||${q.course}`;
      if (!acc[key])
        acc[key] = { department: q.department, course: q.course, items: [] };
      acc[key].items.push(q);
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => {
      if (a.department < b.department) return -1;
      if (a.department > b.department) return 1;
      if (a.course < b.course) return -1;
      if (a.course > b.course) return 1;
      return 0;
    });
  };

  return (
    <HStack bg={bgColor} minH="100vh" spacing={0} align="stretch">
      {/* Sidebar - Desktop */}
      <Box
        as="nav"
        display={{ base: "none", lg: "flex" }}
        w="250px"
        bg={bgColor}
        borderRightWidth="1px"
        borderRightColor={borderColor}
        flexDirection="column"
        py={6}
        position="sticky"
        top={0}
        maxH="100vh"
        overflowY="auto"
      >
        <Heading size="md" px={6} mb={8} color={textColor}>
          Admin Panel
        </Heading>
        <VStack
          spacing={2}
          align="stretch"
          px={3}
          bg={cardBg}
          p={4}
          borderRadius="md"
        >
          <Button
            variant={activeTab === "questions" ? "solid" : "ghost"}
            colorScheme={activeTab === "questions" ? "purple" : "gray"}
            justifyContent="start"
            px={4}
            color="blue.900"
            onClick={() => setActiveTab("questions")}
          >
            Questions
          </Button>
          <Button
            variant={activeTab === "users" ? "solid" : "ghost"}
            colorScheme={activeTab === "users" ? "purple" : "gray"}
            justifyContent="start"
            px={4}
            color="blue.900"
            onClick={() => setActiveTab("users")}
          >
            Users
          </Button>
          <Button
            variant={activeTab === "feedback" ? "solid" : "ghost"}
            colorScheme={activeTab === "feedback" ? "purple" : "gray"}
            justifyContent="start"
            px={4}
            color="blue.900"
            onClick={() => setActiveTab("feedback")}
          >
            Feedback
          </Button>
        </VStack>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg={bgColor}>
          <Box
            p={6}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Heading size="md" color={textColor}>
              Menu
            </Heading>
            <IconButton
              icon={<CloseIcon />}
              onClick={onClose}
              variant="ghost"
              size="lg"
            />
          </Box>
          <DrawerBody px={4} py={4}>
            <VStack
              spacing={2}
              align="stretch"
              bg={cardBg}
              m={0}
              p={4}
              borderRadius="md"
            >
              <Button
                variant={activeTab === "questions" ? "solid" : "ghost"}
                colorScheme={activeTab === "questions" ? "purple" : "gray"}
                justifyContent="start"
                px={4}
                color="blue.900"
                onClick={() => {
                  setActiveTab("questions");
                  onClose();
                }}
              >
                Questions
              </Button>
              <Button
                variant={activeTab === "users" ? "solid" : "ghost"}
                colorScheme={activeTab === "users" ? "purple" : "gray"}
                justifyContent="start"
                px={4}
                color="blue.900"
                onClick={() => {
                  setActiveTab("users");
                  onClose();
                }}
              >
                Users
              </Button>
              <Button
                variant={activeTab === "feedback" ? "solid" : "ghost"}
                colorScheme={activeTab === "feedback" ? "purple" : "gray"}
                justifyContent="start"
                px={4}
                color="blue.900"
                onClick={() => {
                  setActiveTab("feedback");
                  onClose();
                }}
              >
                Feedback
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box
        flex={1}
        overflowY="auto"
        maxH="100vh"
        py={{ base: 4, md: 8 }}
        px={{ base: 3, md: 6 }}
        w={{ base: "100%", lg: "auto" }}
      >
        {/* Mobile Header with Menu Button */}
        <HStack
          spacing={4}
          mb={6}
          display={{ base: "flex", lg: "none" }}
          justify="space-between"
        >
          <Heading size={{ base: "lg", md: "xl" }} color={textColor}>
            Admin Dashboard
          </Heading>
          <IconButton
            icon={<HamburgerIcon />}
            onClick={onOpen}
            variant="ghost"
            size="lg"
          />
        </HStack>

        {/* Desktop Header */}
        <Box display={{ base: "none", lg: "block" }} mb={8}>
          <Heading size="2xl" color={textColor} mb={2}>
            Admin Dashboard
          </Heading>
          <Text color={labelColor}>Manage questions and user permissions</Text>
        </Box>

        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* QUESTIONS TAB */}
          {activeTab === "questions" && (
            <>
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
                      <SimpleGrid
                        columns={{ base: 1, md: 2 }}
                        spacing={4}
                        w="100%"
                      >
                        <VStack align="start" spacing={2}>
                          <Text
                            fontWeight="600"
                            color={labelColor}
                            fontSize="sm"
                          >
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
                          </Select>
                        </VStack>
                        <VStack align="start" spacing={2}>
                          <Text
                            fontWeight="600"
                            color={labelColor}
                            fontSize="sm"
                          >
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

              {/* Bulk Upload Card */}
              <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                <CardHeader borderBottomWidth="1px" borderColor={borderColor}>
                  <Heading size="md" color={textColor}>
                    Bulk Upload Questions (CSV)
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontWeight="600" color={labelColor} mb={2}>
                        Instructions:
                      </Text>
                      <Text color={labelColor} fontSize="sm">
                        1. Download the CSV template to understand the format
                        <br />
                        2. Fill in your questions in the spreadsheet
                        <br />
                        3. Save as CSV and upload the file
                        <br />
                        <br />
                        <strong>Columns required:</strong> Level, Department,
                        Course, Question, Option A, Option B, Option C, Option
                        D, Correct Answer
                      </Text>
                    </Box>

                    <HStack spacing={3} flexWrap="wrap">
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        onClick={downloadTemplateCSV}
                      >
                        📥 Download Template
                      </Button>
                      <Button
                        colorScheme="green"
                        onClick={() => csvFileRef.current?.click()}
                      >
                        📤 Upload CSV File
                      </Button>
                      <input
                        ref={csvFileRef}
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        style={{
                          display: "none",
                        }}
                      />
                    </HStack>
                  </VStack>
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
                    <Accordion allowMultiple>
                      {groupedByCourse().map((g, gi) => (
                        <AccordionItem
                          key={`${g.department}-${g.course}-${gi}`}
                          border="none"
                        >
                          <h2>
                            <AccordionButton
                              _hover={{ bg: headerBg }}
                              px={3}
                              py={2}
                            >
                              <Box flex="1" textAlign="left">
                                <HStack spacing={3} align="center">
                                  <Badge colorScheme="teal">
                                    {g.items.length}
                                  </Badge>
                                  <Text fontWeight="600" color={textColor}>
                                    {g.department} — {g.course}
                                  </Text>
                                </HStack>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4} px={0}>
                            <VStack spacing={4} align="stretch">
                              {g.items.map((q) => (
                                <Box
                                  key={q.id}
                                  bg={questionBg}
                                  p={4}
                                  borderRadius="md"
                                  borderLeft="4px"
                                  borderColor="purple.500"
                                >
                                  <VStack align="start" spacing={3} w="100%">
                                    <HStack spacing={2} flexWrap="wrap">
                                      <Badge colorScheme="blue">
                                        {q.level}
                                      </Badge>
                                      <Text
                                        fontWeight="600"
                                        color={textColor}
                                        fontSize={{ base: "sm", md: "md" }}
                                      >
                                        {q.department} — {q.course}
                                      </Text>
                                    </HStack>

                                    <Text
                                      color={textColor}
                                      fontSize={{ base: "sm", md: "md" }}
                                      dangerouslySetInnerHTML={{
                                        __html: q.question,
                                      }}
                                    />

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
                                                opt === q.correctAnswer
                                                  ? "bold"
                                                  : "normal"
                                              }
                                            >
                                              {String.fromCharCode(65 + idx)}.{" "}
                                              {opt}
                                              {opt === q.correctAnswer && (
                                                <Badge
                                                  colorScheme="green"
                                                  size="sm"
                                                >
                                                  Correct
                                                </Badge>
                                              )}
                                            </Text>
                                          </HStack>
                                        ))}
                                      </VStack>
                                    </Box>

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
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardBody>
              </Card>
            </>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <>
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
            </>
          )}

          {/* FEEDBACK TAB */}
          {activeTab === "feedback" && (
            <>
              <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                <CardHeader borderBottomWidth="1px" borderColor={borderColor}>
                  <HStack justify="space-between">
                    <Heading size="md" color={textColor}>
                      User Feedback
                    </Heading>
                    <Badge colorScheme="orange">{feedbacks.length}</Badge>
                  </HStack>
                </CardHeader>
                <CardBody>
                  {feedbacks.length === 0 ? (
                    <Text color={labelColor} textAlign="center" py={8}>
                      No feedback received yet.
                    </Text>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {feedbacks.map((fb) => (
                        <Box
                          key={fb.id}
                          bg={questionBg}
                          p={4}
                          borderRadius="md"
                          borderLeft="4px"
                          borderColor="orange.500"
                        >
                          <VStack align="start" spacing={3} w="100%">
                            {/* User Info Header */}
                            <HStack spacing={3} flexWrap="wrap" w="100%">
                              <Badge colorScheme="cyan" variant="solid">
                                {fb.userName}
                              </Badge>
                              <Text
                                fontSize="sm"
                                color={labelColor}
                                fontWeight="500"
                              >
                                {fb.userEmail}
                              </Text>
                              <Text fontSize="xs" color={labelColor} ml="auto">
                                {new Date(fb.date).toLocaleDateString()}{" "}
                                {new Date(fb.date).toLocaleTimeString()}
                              </Text>
                            </HStack>

                            {/* Feedback Message */}
                            <Box w="100%" bg={bgColor} p={3} borderRadius="md">
                              <Text
                                color={textColor}
                                fontSize="sm"
                                whiteSpace="pre-wrap"
                              >
                                {fb.message}
                              </Text>
                            </Box>
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </CardBody>
              </Card>
            </>
          )}
        </VStack>
      </Box>
    </HStack>
  );
};

export default AdminDashboard;
