import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function UserSurveys() {
  const [surveys, setSurveys] = useState({});

  const creatorAddress = "0xa209d66169840b201e56a80a2c73eb6d0427575d";

  async function fetchSurveysByCreator(creatorAddress) {
    try {
      const response = await fetch(
        "https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json"
      );

      if (response.ok) {
        const data = await response.json();
        const creatorSurveys = {};

        const lowercaseCreatorAddress = creatorAddress.toLowerCase();

        for (const key1 in data) {
          for (const key2 in data[key1]) {
            const lowercaseCreator = data[key1][key2].creator.toLowerCase();
            if (lowercaseCreator === lowercaseCreatorAddress) {
              if (!creatorSurveys[key1]) {
                creatorSurveys[key1] = {};
              }
              creatorSurveys[key1][key2] = data[key1][key2];
            }
          }
        }

        return creatorSurveys;
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
      const creatorSurveys = await fetchSurveysByCreator(creatorAddress);
      setSurveys(creatorSurveys);
      console.log(creatorSurveys);
    }
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="flex align-center justify-center mx-auto"></div>
      <div className="flex-col align-center justify-center mx-auto">
        <h1 className="font-bold text-2xl text-center mt-8 mb-4">My Surveys</h1>
        <ul className="list-none space-y-4 px-4">
          {Object.entries(surveys).map(([outerId, outerData]) =>
            Object.entries(outerData).map(([id, surveyData]) => (
              <li key={id}>
                <Link
                  to={`/survey/${outerId}/${id}`}
                  className="block rounded-lg bg-white p-4 shadow-md hover:bg-gray-200 transition duration-300 ease-in-out"
                >
                  {surveyData.title}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default UserSurveys;
