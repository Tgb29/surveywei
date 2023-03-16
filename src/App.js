// import RadioGroup from "./components/RadioGroup";
import Home from "./components/home/Home";
import Navbar from "./components/navigation/Navbar";
import Form from "./components/Form";
import Form2 from "./components/Form2";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserAddressContext from "./UserAddressContext";
import { useState } from "react";
function App() {
  const [connectedAddress, setConnectedAddress] = useState("");
  return (
    <>
      <UserAddressContext.Provider value={connectedAddress}>
        <Router>
          <Navbar setConnectedAddress={setConnectedAddress} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/build" element={<Form2 />} />
              <Route path="/find" element={<Form />} />
            </Routes>
          </main>
        </Router>
      </UserAddressContext.Provider>
    </>
  );
}

export default App;
