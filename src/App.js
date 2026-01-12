import React from "react";
import "./App.css";
import QuizState from "./context/QuizState";
import Home from "./pages/Home/Home";
import MapQuizPage from "./pages/MapQuiz/MapQuizPage";
import About from "./pages/About/About";
import ReviewAnswer from "./pages/Review/ReviewAnswer";
import NotFound from "./pages/NotFound/NotFound";
import Userlogin from "./pages/User Authentication/Userlogin";
import UserSignup from "./pages/User Authentication/UserSignup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import NavBar from "./components/NavBar/NavBar";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoute from "./components/Auth/AdminRoute";
import Profile from "./pages/Profile/Profile";
import Feedback from "./pages/Feedback/Feedback";
import { Routes, Route } from "react-router-dom";

// Layout component to include NavBar only on selected pages
const Layout = ({ children }) => (
  <>
    <NavBar />
    <div style={{ width: "100%", minHeight: "100vh" }}>{children}</div>
  </>
);

function App() {
  return (
    <QuizState>
      <div className="App">
        <Routes>
          {/* Public-only routes: redirect to home when already authenticated */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Userlogin />} />
            <Route path="/signup" element={<UserSignup />} />
          </Route>

          {/* Protected routes: require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <About />
                </Layout>
              }
            />
            <Route
              path="/map"
              element={
                <Layout>
                  <MapQuizPage />
                </Layout>
              }
            />
            <Route
              path="/review"
              element={
                <Layout>
                  <ReviewAnswer />
                </Layout>
              }
            />
            <Route element={<AdminRoute />}>
              <Route
                path="/admin"
                element={
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                }
              />
            </Route>
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/feedback"
              element={
                <Layout>
                  <Feedback />
                </Layout>
              }
            />
          </Route>

          {/* 404 page (keeps default behavior) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </QuizState>
  );
}

export default App;
