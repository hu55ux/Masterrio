import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import Demo from "./pages/Demo";
import UserProfile from "./pages/UserProfile";
import MyProfile from "./pages/MyProfile";
import AllJobs from "./pages/AllJobs";
import JobDetail from "./pages/JobDetail";
import CreateJobPost from "./pages/CreateJobPost";
import { useEffect } from "react";
import { useDarkmode } from "@/stores/useDarkmode";

function App() {
  const { isDarkmodeActive } = useDarkmode();

  useEffect(() => {
    if (isDarkmodeActive) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkmodeActive]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Navigate to="/jobs" replace />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/jobs" element={<AllJobs />} />
                <Route path="/create-job" element={<CreateJobPost />} />
                <Route path="/job/:jobId" element={<JobDetail />} />
                <Route path="/profile/:id" element={<UserProfile />} />
                <Route path="/my-profile" element={<MyProfile />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
