import React, { useState, useEffect } from "react";
import {
  addQuestion,
  getQuestions,
  saveQuestions,
  deleteQuestion,
  updateQuestion,
} from "../../utils/storage";
import "./AdminDashboard.css";

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

  useEffect(() => {
    setList(getQuestions());
    try {
      setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
    } catch (e) {
      setUsers([]);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (idx, val) => {
    const arr = [...form.options];
    arr[idx] = val;
    setForm((prev) => ({ ...prev, options: arr }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    } else {
      addQuestion(q);
    }

    setList(getQuestions());
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
  };

  const handleDelete = (id) => {
    deleteQuestion(id);
    setList(getQuestions());
  };

  const toggleAdmin = (userId) => {
    const u = JSON.parse(localStorage.getItem("users") || "[]");
    const updated = u.map((us) =>
      us.id === userId ? { ...us, isAdmin: !us.isAdmin } : us
    );
    localStorage.setItem("users", JSON.stringify(updated));
    setUsers(updated);
  };

  return (
    <div className="admin-container" style={{ padding: "1rem" }}>
      <h2>Admin - Upload Questions</h2>
      <form
        className="admin-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: 800 }}
      >
        <label>Level</label>
        <select name="level" value={form.level} onChange={handleChange}>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
        </select>

        <label>Department</label>
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <label>Course</label>
        <input
          name="course"
          value={form.course}
          onChange={handleChange}
          required
        />

        <label>Question</label>
        <textarea
          name="question"
          value={form.question}
          onChange={handleChange}
          required
        />

        <label>Options</label>
        {form.options.map((opt, idx) => (
          <input
            key={idx}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            placeholder={`Option ${idx + 1}`}
            required
          />
        ))}

        <label>Correct Option (index 0-3)</label>
        <input
          type="number"
          min="0"
          max="3"
          name="correctIndex"
          value={form.correctIndex}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update Question" : "Add Question"}
        </button>
      </form>

      <h3>Existing Questions</h3>
      <div className="question-list">
        {list.length === 0 && <div>No questions yet.</div>}
        {list.map((q) => (
          <div
            className="question-item"
            key={q.id}
            style={{ borderBottom: "1px solid #ddd", padding: "0.5rem 0" }}
          >
            <div>
              <strong>
                {q.department} {q.course} ({q.level})
              </strong>
            </div>
            <div dangerouslySetInnerHTML={{ __html: q.question }} />
            <div>Correct: {q.correctAnswer}</div>
            <div className="actions">
              <button onClick={() => handleEdit(q)}>Edit</button>
              <button onClick={() => handleDelete(q.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "1rem" }}>User Management</h3>
      <div>
        {users.length === 0 && <div>No registered users.</div>}
        {users.map((u) => (
          <div
            key={u.id}
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              padding: "0.25rem 0",
            }}
          >
            <div style={{ flex: 1 }}>
              {u.name} — {u.email}
            </div>
            <div>Admin: {u.isAdmin ? "Yes" : "No"}</div>
            <div>
              <button onClick={() => toggleAdmin(u.id)}>
                {u.isAdmin ? "Revoke" : "Make Admin"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
