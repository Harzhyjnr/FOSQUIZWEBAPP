import React, { useEffect, useState } from "react";
import { getQuestions } from "../../utils/storage";
import "./Form.css";

const Form = ({ onStart }) => {
  const [questionsStore, setQuestionsStore] = useState([]);
  const [levels, setLevels] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    level: "any",
    department: "any",
    course: "any",
    count: 10,
  });

  useEffect(() => {
    const q = getQuestions();
    setQuestionsStore(q);
    const lv = Array.from(new Set(q.map((x) => x.level))).sort();
    const deps = Array.from(new Set(q.map((x) => x.department))).sort();
    setLevels(lv);
    setDepartments(deps);
  }, []);

  useEffect(() => {
    // update departments and courses when level or department changes
    let byLevel = questionsStore;
    if (form.level !== "any")
      byLevel = byLevel.filter((q) => String(q.level) === String(form.level));

    // departments available for selected level
    const depsForLevel = Array.from(
      new Set(byLevel.map((x) => x.department))
    ).sort();
    setDepartments(
      form.level === "any"
        ? Array.from(new Set(questionsStore.map((x) => x.department))).sort()
        : depsForLevel
    );

    let filtered = byLevel;
    if (form.department !== "any")
      filtered = filtered.filter(
        (q) =>
          String(q.department).toLowerCase() ===
          String(form.department).toLowerCase()
      );
    const cs = Array.from(new Set(filtered.map((x) => x.course))).sort();
    setCourses(cs);

    // reset dependent selections if they are no longer valid
    if (
      form.department !== "any" &&
      !(form.level === "any" ? questionsStore : byLevel).some(
        (q) => q.department === form.department
      )
    ) {
      setForm((prev) => ({ ...prev, department: "any", course: "any" }));
    }
    if (form.course !== "any" && !cs.includes(form.course)) {
      setForm((prev) => ({ ...prev, course: "any" }));
    }
  }, [form.level, form.department, questionsStore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart &&
      onStart({
        level: form.level,
        department: form.department,
        course: form.course,
        count: Number(form.count),
      });
  };

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
          <option value="any">Any</option>
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
          <option value="any">Any</option>
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
          <option value="any">Any</option>
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
          min="1"
          max="50"
          className="form-input"
          value={form.count}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn-submit">
        Start Quiz
      </button>
    </form>
  );
};

export default Form;
