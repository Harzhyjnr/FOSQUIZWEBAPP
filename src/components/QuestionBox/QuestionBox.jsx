import React, { useCallback, useContext, useEffect, useState } from "react";
import "./QuestionBox.css";
import { Badge } from "@chakra-ui/react";
import quizContext from "../../context/quizContext";
import clickAudio from "./../../Assets/select-sound.mp3";

// #0b4b06 - bg
// #53a24db5 - border
const audio = new Audio(clickAudio);

const QuestionBox = (props) => {
  const [selectedAns, setSelectedAns] = useState("");
  const context = useContext(quizContext);
  const {
    setScore,
    next,
    setNext,
    len,
    setAnswerList,
    answerList,
    updateAnswerAtIndex,
  } = context;
  const { question, options, category } = props;
  //Here options[0] = options array and options[1] = correct answer
  //let i = -1
  const alphabet = ["A", "B", "C", "D"];
  // let currentAlpha = ''

  const { usedLifelines, setUsedLifelines } = context;

  const [filteredOptions, setFilteredOptions] = useState(options[0]);
  const [audienceHelp, setAudienceHelp] = useState(null);

  // Restore previously selected answer when navigating to a question
  useEffect(() => {
    if (answerList[next]) {
      const previousAnswer = answerList[next].myAnswer;
      if (previousAnswer) {
        setSelectedAns(previousAnswer);
        // Restore the visual selection
        setTimeout(() => {
          const optionsElements = document.querySelectorAll(".q-box_options");
          optionsElements.forEach((el) => {
            el.classList.remove("optionSelected");
            const optionText = el.innerText.split("\n")[1]; // Get the text part without the letter
            if (el.innerText.includes(previousAnswer)) {
              el.classList.add("optionSelected");
            }
          });
        }, 0);
      }
    }
  }, [next, answerList]);

  // --- Lifeline handlers ---
  const handleFiftyFifty = () => {
    if (usedLifelines.fiftyFifty) return;

    const wrongOptions = options[0].filter((opt) => opt !== options[1]);
    const randomWrong =
      wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    const newOptions = [options[1], randomWrong].sort(
      () => Math.random() - 0.5,
    );

    setFilteredOptions(newOptions);
    setUsedLifelines({ ...usedLifelines, fiftyFifty: true });
  };

  const handleAudienceHelp = () => {
    if (usedLifelines.audience) return;

    const correctPercent = Math.floor(Math.random() * 20) + 60;
    let remaining = 100 - correctPercent;

    const wrongOptions = options[0].filter((opt) => opt !== options[1]);
    let wrongPercents = Array(wrongOptions.length).fill(0);

    for (let i = 0; i < remaining; i++) {
      wrongPercents[i % wrongOptions.length]++;
    }

    const audienceVotes = options[0].map((opt) => ({
      option: opt,
      percent: opt === options[1] ? correctPercent : wrongPercents.shift(),
    }));

    setAudienceHelp(audienceVotes);
    setUsedLifelines({ ...usedLifelines, audience: true });
  };

  const handleRevealAnswer = () => {
    if (usedLifelines.revealAnswer) return;

    document.querySelectorAll(".q-box_options").forEach((el) => {
      if (el.innerText.includes(options[1])) {
        el.classList.add("revealAnswer");
      }
    });

    setUsedLifelines({ ...usedLifelines, revealAnswer: true });
  };

  const removeClass = () => {
    let element = document.getElementsByClassName("q-box_body");
    for (let i = 0; i < element.length; i++) {
      for (let j = 0; j < element[i].children.length; j++) {
        element[i].children[j].classList.remove("optionSelected");
      }
    }
  };

  // Update the score (count unanswered as wrong)
  const checkAnswer = useCallback(
    (selectedAns, currentIndex) => {
      // Check if we've already scored this question before
      const previousAnswer = answerList[currentIndex]?.myAnswer;

      // Only update score if this is the first time answering this question
      if (!previousAnswer) {
        if (selectedAns === "" || selectedAns !== options[1]) {
          setScore((prev) => ({
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }));
        } else if (selectedAns === options[1]) {
          setScore((prev) => ({
            ...prev,
            rightAnswers: prev.rightAnswers + 1,
          }));
        }
      } else if (previousAnswer !== selectedAns) {
        // If the answer changed, adjust the score accordingly
        const wasCorrect = previousAnswer === options[1];
        const isCorrect = selectedAns === options[1];

        if (wasCorrect && !isCorrect) {
          // Changed from correct to wrong
          setScore((prev) => ({
            ...prev,
            rightAnswers: prev.rightAnswers - 1,
            wrongAnswers: prev.wrongAnswers + 1,
          }));
        } else if (!wasCorrect && isCorrect) {
          // Changed from wrong to correct
          setScore((prev) => ({
            ...prev,
            rightAnswers: prev.rightAnswers + 1,
            wrongAnswers: prev.wrongAnswers - 1,
          }));
        }
      }
    },
    [options, setScore, answerList],
  );

  const handleOptionClick = (optionValue, idx) => {
    audio.play();
    removeClass();
    setSelectedAns(optionValue);
    const element = document.getElementsByClassName("q-box_options")[idx];
    if (element) element.classList.add("optionSelected");
  };

  const handleNextQuestion = useCallback(() => {
    if (next <= len - 1) {
      checkAnswer(selectedAns, next);
      // Update the answer at the current index
      const answerData = {
        question: question,
        options: options[0],
        id: `id${next}`,
        category: category,
        myAnswer: selectedAns,
        rightAnswer: options[1],
      };
      updateAnswerAtIndex(next, answerData);

      setNext((n) => n + 1);
      setSelectedAns("");
      setFilteredOptions(options[0]);
      setAudienceHelp(null);
    }
  }, [
    next,
    len,
    selectedAns,
    options,
    question,
    category,
    setNext,
    checkAnswer,
    setFilteredOptions,
    setAudienceHelp,
    updateAnswerAtIndex,
  ]);

  const handlePrevQuestion = useCallback(() => {
    if (next > 0) {
      setNext((n) => n - 1);
      setSelectedAns("");
      setFilteredOptions(options[0]);
      setAudienceHelp(null);
    }
  }, [next, options, setNext, setFilteredOptions, setAudienceHelp]);

  // Overall quiz timer - counts down for the entire quiz
  const [timer, setTimer] = useState(() => {
    const savedTimer = localStorage.getItem("timer");
    return savedTimer ? parseInt(savedTimer) : 900; // Default to 15 minutes (900 seconds)
  });

  useEffect(() => {
    const myInterval = setInterval(() => {
      setTimer((t) => {
        if (t > 1) {
          localStorage.setItem("timer", t - 1);
          return t - 1;
        } else {
          // Quiz time's up - end quiz
          handleNextQuestion();
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(myInterval);
  }, [handleNextQuestion]);

  return (
    <>
      <div className="q-box mx-auto my-5 p-4 text-center">
        <div className="q-box_head">
          <div className="q-box_timer">
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
          </div>
          <div className="q-counter">
            Question {next + 1}/{len}
          </div>
          <div
            className="q-question"
            dangerouslySetInnerHTML={{ __html: question }}
          ></div>
        </div>

        {/* --- Lifeline buttons --- */}
        <div className="lifelines mb-3">
          <button
            disabled={usedLifelines.fiftyFifty}
            onClick={handleFiftyFifty}
          >
            50/50
          </button>
          <button
            disabled={usedLifelines.audience}
            onClick={handleAudienceHelp}
          >
            Audience help
          </button>
          <button
            disabled={usedLifelines.revealAnswer}
            onClick={handleRevealAnswer}
          >
            Reveal answer
          </button>
        </div>

        <div className="q-box_body">
          {filteredOptions.map((opt, idx) => (
            <div
              key={opt}
              onClick={() => handleOptionClick(opt, idx)}
              className="q-box_options"
            >
              <div className="option-icon">{alphabet[idx]}</div>
              <div dangerouslySetInnerHTML={{ __html: opt }} />
            </div>
          ))}
        </div>

        {/* Audience help results */}
        {audienceHelp && (
          <div className="audience-help mt-3">
            {audienceHelp.map((v, idx) => (
              <div key={idx} className="audience-bar">
                <span className="audience-label">{alphabet[idx]}</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${v.percent}%` }}>
                    {v.percent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-between align-items-center mx-3">
          <Badge colorScheme="purple">{category}</Badge>
        </div>

        <div className="q-nav-buttons">
          <button
            onClick={handlePrevQuestion}
            className="btn btn-prev"
            disabled={next === 0}
          >
            Previous
          </button>
          <button onClick={handleNextQuestion} className="btn btn-next">
            {next >= len - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
};

export default QuestionBox;
