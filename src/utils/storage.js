// Helper utilities for localStorage-backed questions, attempts, and feedback
export const getQuestions = () => {
  try {
    return JSON.parse(localStorage.getItem("questions") || "[]");
  } catch (e) {
    return [];
  }
};

export const saveQuestions = (arr) => {
  localStorage.setItem("questions", JSON.stringify(arr));
};

export const addQuestion = (q) => {
  const list = getQuestions();
  list.push(q);
  saveQuestions(list);
};

export const updateQuestion = (id, updated) => {
  const list = getQuestions().map((q) =>
    q.id === id ? { ...q, ...updated } : q
  );
  saveQuestions(list);
};

export const deleteQuestion = (id) => {
  const list = getQuestions().filter((q) => q.id !== id);
  saveQuestions(list);
};

export const getAttempts = () => {
  try {
    return JSON.parse(localStorage.getItem("attempts") || "[]");
  } catch (e) {
    return [];
  }
};

export const addAttempt = (attempt) => {
  const items = getAttempts();
  // Avoid near-duplicate attempts: if the last attempt by the same user has identical total, correct and answers, skip
  const last = items.length ? items[items.length - 1] : null;
  try {
    if (
      last &&
      last.userId === attempt.userId &&
      last.total === attempt.total &&
      last.correct === attempt.correct
    ) {
      const a1 = JSON.stringify(last.answers || []);
      const a2 = JSON.stringify(attempt.answers || []);
      if (a1 === a2) return false; // duplicate
    }
  } catch (e) {
    // ignore compare errors
  }
  items.push(attempt);
  localStorage.setItem("attempts", JSON.stringify(items));
  return true;
};

export const getFeedbacks = () => {
  try {
    return JSON.parse(localStorage.getItem("feedbacks") || "[]");
  } catch (e) {
    return [];
  }
};

export const addFeedback = (fb) => {
  const items = getFeedbacks();
  items.push(fb);
  localStorage.setItem("feedbacks", JSON.stringify(items));
};

export const ensureDefaultAdmin = (opts = {}) => {
  const email = opts.email || "admin@science.edu";
  const password = opts.password || "Admin@123";
  const name = opts.name || "Administrator";
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const exists = users.find((u) => u.email === email);
  if (!exists) {
    const admin = {
      id: Date.now().toString(),
      name,
      email,
      password,
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };
    users.push(admin);
    localStorage.setItem("users", JSON.stringify(users));
  }
};

export const ensureSampleQuestions = () => {
  const existing = getQuestions();
  if (existing.length > 0) return;

  const samples = [
    {
      id: "q1",
      level: "100",
      department: "Computer Science",
      course: "COS101",
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Central Performance Unit",
        "Compute Processing Unit",
        "Control Processing Unit",
      ],
      correctAnswer: "Central Processing Unit",
    },
    {
      id: "q2",
      level: "200",
      department: "Computer Science",
      course: "COS201",
      question: "Which data structure uses FIFO?",
      options: ["Queue", "Stack", "Tree", "Graph"],
      correctAnswer: "Queue",
    },
    {
      id: "q3",
      level: "100",
      department: "Biology",
      course: "BIO101",
      question: "What is the powerhouse of the cell?",
      options: ["Mitochondria", "Nucleus", "Ribosome", "Golgi body"],
      correctAnswer: "Mitochondria",
    },
  ];

  saveQuestions(samples);
};
