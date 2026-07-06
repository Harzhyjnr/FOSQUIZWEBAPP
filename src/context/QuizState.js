import QuizContext from "./quizContext";
import { useEffect, useState } from "react";
import { getQuestions as fetchQuestionsFromBackend } from "../utils/api";

const QuizState = (props) => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState({ rightAnswers: 0, wrongAnswers: 0 });
  const [next, setNext] = useState(0);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const len = questions.length;
  const [answerList, setAnswerList] = useState([]);
  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    audience: false,
    revealAnswer: false,
  });
  const [level, setLevel] = useState("any");
  const [department, setDepartment] = useState("any");
  const [course, setCourse] = useState("any");

  const updateAnswerAtIndex = (index, answerData) => {
    setAnswerList((prev) => {
      const newList = [...prev];
      newList[index] = answerData;
      return newList;
    });
  };

 const setQuestionsFromStore = async ({
  level = "any",
  department = "any",
  course = "any",
  count = 10,
} = {}) => {
  setLevel(level);
  setDepartment(department);
  setCourse(course);
  setLoading(true);

  try {
    const response = await fetchQuestionsFromBackend({
      level,
      department,
      course,
      count,
    });

    // Important: Make sure we get the questions array correctly
    const questionsData = response.questions || response.data?.questions || [];

    setQuestions(questionsData);
  } catch (error) {
    console.error("Error fetching questions from backend:", error);
    setQuestions([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const loadIfUrl = async () => {
      if (!url) return;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setQuestions(data.results || []);
      } catch (error) {
        console.error("Fetch questions error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadIfUrl();
  }, [url]);

  return (
    <QuizContext.Provider
      value={{
        answerList,
        setAnswerList,
        updateAnswerAtIndex,
        len,
        questions,
        setQuestions,
        url,
        setUrl,
        fetchQuestions: fetchQuestionsFromBackend,
        setQuestionsFromStore,
        loading,
        setLoading,
        score,
        setScore,
        next,
        setNext,
        usedLifelines,
        setUsedLifelines,
        level,
        department,
        course,
      }}
    >
      {props.children}
    </QuizContext.Provider>
  );
};

export default QuizState;
