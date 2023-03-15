// import RadioGroup from "./components/RadioGroup";
import Home from "./components/home/Home";
import SurveyForm from "./components/SurveyForm";
import Navbar from "./components/navigation/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/build" element={<SurveyForm />} />
            <Route path="/find" element={<Home />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
