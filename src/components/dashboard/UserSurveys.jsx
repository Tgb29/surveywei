import React from "react";
import { useState, useEffect } from "react";

import Creator from "./role/Creator";
import Taker from "./role/Taker";

function UserSurveys({ connectedAddress }) {
  const [responses, setResponses] = useState({});

  const [creator, setCreator] = useState(true);

  const creatorAddress = connectedAddress;

  async function fetchUserResponses(creatorAddress) {
    try {
      const response = await fetch(
        "https://surveywei-1b1e0-default-rtdb.firebaseio.com/responses.json"
      );

      if (response.ok) {
        const data = await response.json();
        const surveysRespondedTo = {};

        const lowercaseCreatorAddress = creatorAddress.toLowerCase();

        for (const key1 in data) {
          for (const key2 in data[key1]) {
            const lowercaseTaker = data[key1][key2].taker.toLowerCase();
            if (lowercaseTaker === lowercaseCreatorAddress) {
              if (!surveysRespondedTo[key1]) {
                surveysRespondedTo[key1] = {};
              }
              surveysRespondedTo[key1][key2] = data[key1][key2];
            }
          }
        }

        return surveysRespondedTo;
      } else {
        throw new Error("Failed to fetch surveys");
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  useEffect(() => {
    async function fetchData() {
      const surveysRespondedTo = await fetchUserResponses(creatorAddress);

      setResponses(surveysRespondedTo);
    }
    fetchData();
  }, []);

  const toggleRole = (e) => {
    e.preventDefault();
    setCreator(!creator);
  };

  return (
    <div className="bg-[#6166ae] min-h-screen font-sans pb-20">
      <div className="flex align-center justify-center mx-auto"></div>
      <div className="flex-col align-center justify-center mx-auto">
        <h1 className="font-bold text-2xl text-center mt-8 mb-4 text-[white]">
          User Dashboard :{" "}
          {`${connectedAddress.slice(0, 4)}...${connectedAddress.slice(-5)}`}
        </h1>
        <div className="flex justify-end align-right text-right mr-20 mb-5 space-x-1">
          <button
            className={`border-2 rounded-xl px-2 py-1  text-white ${
              creator ? "bg-[#4bc7e8]" : ""
            } hover:bg-[#1c1b53]`}
            onClick={toggleRole}
          >
            {" "}
            Surveys Created
          </button>
          <button
            className={`border-2 rounded-xl px-2 py-1 text-white ${
              !creator ? "bg-[#4bc7e8]" : ""
            } hover:bg-[#1c1b53]`}
            onClick={toggleRole}
          >
            {" "}
            Surveys Taken
          </button>
        </div>
        {creator ? <Creator connectedAddress={creatorAddress} /> : ""}
      </div>
      {!creator ? <Taker connectedAddress={creatorAddress} /> : ""}
    </div>
  );
}

export default UserSurveys;
