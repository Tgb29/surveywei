import Home from "./components/home/Home";
import Navbar from "./components/navigation/Navbar";
import Form2 from "./components/Form2";
import SearchSurveys from "./components/SearchSurveys";
import Survey from "./components/Survey";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserAddressContext from "./UserAddressContext";
import UserSurveys from "./components/UserSurveys";

import { useState } from "react";
function App() {
  const [connectedAddress, setConnectedAddress] = useState("");
  return (
    <>
      <UserAddressContext.Provider value={connectedAddress}>
        <Router>
          <Navbar
            connectedAddress={connectedAddress}
            setConnectedAddress={setConnectedAddress}
          />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/build" element={<Form2 />} />
              <Route path="/find" element={<SearchSurveys />} />
              <Route path="/survey/:key/:id" element={<Survey />} />
              <Route path="/user/:connectedAddress" element={<UserSurveys />} />
            </Routes>
          </main>
        </Router>
      </UserAddressContext.Provider>
    </>
  );
}

export default App;
