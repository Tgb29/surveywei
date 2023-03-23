import Home from "./components/home/Home";
import Navbar from "./components/navigation/Navbar";
import Form2 from "./components/create/Form2";
import SearchSurveys from "./components/find/SearchSurveys";
import Survey from "./components/survey/Survey";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserAddressContext from "./UserAddressContext";
import UserSurveys from "./components/dashboard/UserSurveys";
import SurveyDetails from "./components/dashboard/surveyDetails/SurveyDetails";
import CreatorSurveyDetails from "./components/dashboard/surveyDetails/CreatorSurveyDetails";

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
              <Route
                path="/surveyDetails/:key/:id"
                element={<SurveyDetails />}
              />
              <Route
                path="/user/surveyDetails/:key/:id"
                element={<CreatorSurveyDetails />}
              />
              <Route path="/survey/:key/:id" element={<Survey />} />
              <Route
                path="/user/:connectedAddress"
                element={<UserSurveys connectedAddress={connectedAddress} />}
              />
            </Routes>
          </main>
        </Router>
      </UserAddressContext.Provider>
    </>
  );
}

export default App;
