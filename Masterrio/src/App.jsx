import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import PageTransition from "./components/PageTransition/PageTransition";
import UserProfile from "./pages/UserProfile";
import MyProfile from "./pages/MyProfile";
import NotFound from "./pages/NotFound";
import AllJobs from "./pages/AllJobs";
import JobDetail from "./pages/JobDetail";
import CreateJobPost from "./pages/CreateJobPost";
import Masters from "./pages/Catalog/Masters";
import Clients from "./pages/Catalog/Clients";
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
      <CustomCursor />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 w-full relative">
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Navigate to="/jobs" replace />} />
                    <Route path="/jobs" element={<AllJobs />} />
                    <Route path="/create-job" element={<CreateJobPost />} />
                    <Route path="/job/:jobId" element={<JobDetail />} />
                    <Route path="/profile/:id" element={<UserProfile />} />
                    <Route path="/my-profile" element={<MyProfile />} />
                    <Route path="/masters" element={<Masters />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
