import React, { useContext } from "react";
import Form from "../../components/Form/Form";
import QuizArea from "../QuizArea/QuizArea";
import quizContext from "../../context/quizContext";
import { HashLoader } from "react-spinners";
import { Text } from "@chakra-ui/react";

const Home = () => {
  const context = useContext(quizContext);
  const { setLoading, loading, questions, setQuestionsFromStore } = context;

  const handleStart = ({ level, department, course, count }) => {
    localStorage.setItem("timer", 30);
    setLoading(true);
    setQuestionsFromStore({ level, department, course, count });
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <HashLoader
          color={"#3585c1"}
          loading={loading}
          size={100}
          aria-label="Loading Spinner"
          data-testid="loader"
          style={{
            backgroundColor: "#4d4d4dcc",
            width: "100%",
            height: "100vh",
            position: "absolute",
            top: "13%",
          }}
        />
      </div>

      {questions.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 80px)",
            padding: "20px",
          }}
        >
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <Text
              mb={"4"}
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              textAlign="center"
            >
              Start your Quiz Now
            </Text>
            {/* <hr /> */}
            <Form onStart={handleStart} />
            {/* <hr />
                              <Text mb={'2'} fontSize='2xl'>Or try Map Quiz!</Text>
                              <Link to="/map">
                                  <Button colorScheme="teal">Go to Map Quiz</Button>
                              </Link> */}
          </div>
        </div>
      ) : (
        <QuizArea />
      )}
    </>
  );
};

export default Home;
