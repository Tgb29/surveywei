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

        for (const key1 in data) {
          for (const key2 in data[key1]) {
            if (data[key1][key2].creator === creatorAddress) {
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
    <div>
      <h1>User Surveys</h1>
      <ul>
        {Object.entries(surveys).map(([outerId, outerData]) =>
          Object.entries(outerData).map(([id, surveyData]) => (
            <li key={id}>
              <Link to={`/survey/${outerId}/${id}`}>{surveyData.title}</Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default UserSurveys;
