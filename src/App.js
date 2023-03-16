// import RadioGroup from "./components/RadioGroup";
import Home from "./components/home/Home";
import SurveyForm from "./components/SurveyForm";
import Navbar from "./components/navigation/Navbar";
import Form from "./components/Form";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/build" element={<Form />} />
            <Route path="/find" element={<SurveyForm />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
