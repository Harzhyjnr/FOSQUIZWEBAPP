import QuizContext from "./quizContext";
import { useEffect, useState } from "react";
import { getQuestions } from "../utils/storage";

const QuizState = (props) => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState({ rightAnswers: 0, wrongAnswers: 0 });
  const [next, setNext] = useState(0);
  // const demoURL = 'https://opentdb.com/api.php?amount=4&category=&difficulty=&type=boolean'
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const len = questions.length;
  const [answerList, setAnswerList] = useState([]);
  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    audience: false,
    revealAnswer: false,
  });

  const fetchQuestions = async (api) => {
    const response = await fetch(api);
    const data = await response.json();
    let results = data.results;
    setQuestions(results);
    setLoading(false);
  };

  const setQuestionsFromStore = ({
    level = "any",
    department = "any",
    course = "any",
    count = 10,
  } = {}) => {
    const all = getQuestions();
    let filtered = all;
    if (level && level !== "any")
      filtered = filtered.filter((q) => String(q.level) === String(level));
    if (department && department !== "any")
      filtered = filtered.filter(
        (q) =>
          String(q.department).toLowerCase() ===
          String(department).toLowerCase()
      );
    if (course && course !== "any")
      filtered = filtered.filter(
        (q) => String(q.course).toLowerCase() === String(course).toLowerCase()
      );

    // shuffle
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    const chosen = filtered
      .slice(0, count)
      .map((q) => ({
        category: `${q.department} - ${q.course}`,
        question: q.question,
        incorrect_answers: q.options.filter((o) => o !== q.correctAnswer),
        correct_answer: q.correctAnswer,
      }));
    setQuestions(chosen);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions(url);
  }, [url]);

  return (
    <QuizContext.Provider
      value={{
        answerList,
        setAnswerList,
        len,
        questions,
        setQuestions,
        url,
        setUrl,
        fetchQuestions,
        setQuestionsFromStore,
        loading,
        setLoading,
        score,
        setScore,
        next,
        setNext,
        usedLifelines,
        setUsedLifelines,
      }}
    >
      {props.children}
    </QuizContext.Provider>
  );
};

export default QuizState;
