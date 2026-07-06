import React, { useEffect, useState } from "react";
import { getQuestions } from "../../utils/api"; // ← Import from api, not storage
import "./Form.css";

const Form = ({ onStart }) => {
  const [loading, setLoading] = useState(true);
  const [questionsStore, setQuestionsStore] = useState([]);
  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    level: "any",
    department: "any",
    course: "any",
    count: 10,
  });

  // Fetch questions from Backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await getQuestions(); // Calls backend /api/quiz/all
        const questions = response.questions || [];

        setQuestionsStore(questions);

        const lv = Array.from(new Set(questions.map((x) => x.level))).sort();
        const deps = Array.from(
          new Set(questions.map((x) => x.department)),
        ).sort();

        setLevels(lv);
        setDepartments(deps);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setError("Failed to load questions from server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Filter departments and courses dynamically
  useEffect(() => {
    let filtered = questionsStore;

    if (form.level !== "any") {
      filtered = filtered.filter((q) => String(q.level) === String(form.level));
    }

    const depsForLevel = Array.from(
      new Set(filtered.map((x) => x.department)),
    ).sort();
    setDepartments(
      depsForLevel.length
        ? depsForLevel
        : Array.from(new Set(questionsStore.map((x) => x.department))).sort(),
    );

    let courseFiltered = filtered;
    if (form.department !== "any") {
      courseFiltered = courseFiltered.filter(
        (q) =>
          String(q.department).toLowerCase() ===
          String(form.department).toLowerCase(),
      );
    }

    const availableCourses = Array.from(
      new Set(courseFiltered.map((x) => x.course)),
    ).sort();
    setCourses(availableCourses);
  }, [form.level, form.department, questionsStore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.course === "any") {
      setError("Please select a specific course to proceed.");
      return;
    }

    const count = Number(form.count);
    if (count < 10 || count > 50) {
      setError("Number of questions must be between 10 and 50.");
      return;
    }

    onStart({
      level: form.level,
      department: form.department,
      course: form.course,
      count: count,
    });
  };

  if (loading) {
    return <div className="loading">Loading available courses...</div>;
  }

  return (
    <form className="modern-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Level</label>
        <select
          name="level"
          className="form-select"
          value={form.level}
          onChange={handleChange}
        >
          <option value="any">Any Level</option>
          {levels.map((l) => (
            <option key={l} value={l}>
              {l} Level
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Department</label>
        <select
          name="department"
          className="form-select"
          value={form.department}
          onChange={handleChange}
        >
          <option value="any">Any Department</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Course</label>
        <select
          name="course"
          className="form-select"
          value={form.course}
          onChange={handleChange}
        >
          <option value="any">Any Course</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Number of Questions</label>
        <input
          name="count"
          type="number"
          min="10"
          max="50"
          className="form-input"
          value={form.count}
          onChange={handleChange}
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      <button type="submit" className="btn-submit">
        Start Quiz
      </button>
    </form>
  );
};

export default Form;
