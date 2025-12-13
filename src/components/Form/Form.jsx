import React from "react";
import quizData from "../../components/TriviaQuizData";
import "./Form.css";

const Form = (props) => {
  const { handleSubmit, onChange } = props;

  const getOptionsValue = (data) => {
    return data.map((item) => {
      let objectKeys = Object.keys(item)[0];
      return (
        <option key={objectKeys} value={item[objectKeys]}>
          {objectKeys}
        </option>
      );
    });
  };

  return (
    <>
      <form className="modern-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="number" className="form-label">
            Number of Questions
          </label>
          <input
            placeholder="Enter number of questions"
            type="number"
            name="number"
            className="form-input"
            id="number"
            onChange={onChange}
            required
            min="1"
            max="50"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            
           Level
          </label>
          <select
            name="category"
            className="form-select"
            aria-label="Select category"
            onChange={onChange}
          >
            <option value={"any"} defaultValue>
              100 Level
            </option>
            {/* {getOptionsValue(quizData.category)} */}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            
           Department
          </label>
          <select
            name="category"
            className="form-select"
            aria-label="Select category"
            onChange={onChange}
          >
            <option value={"any"} defaultValue>
             Computer Science
            </option>
            {/* {getOptionsValue(quizData.category)} */}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty" className="form-label">
            Course 
          </label>
          <select
            name="difficulty"
            className="form-select"
            aria-label="Select difficulty"
            onChange={onChange}
          >
            <option value={"any"} defaultValue>
            COS 101
            </option>
            {/* {getOptionsValue(quizData.difficulty)} */}
          </select>
        </div>

        <button type="submit" className="btn-submit">
          Start Quiz
        </button>
      </form>
    </>
  );
};

export default Form;
