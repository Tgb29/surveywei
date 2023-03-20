import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SearchSurveys() {
  const [surveys, setSurveys] = useState({});

  async function getAllSurveys() {
    try {
      const response = await fetch(
        "https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json"
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Failed to fetch surveys");
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  const fetchData = async () => {
    const surveys = await getAllSurveys();
    setSurveys(surveys);
    console.log(surveys);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen font-sans pb-20">
      <div className="flex align-center justify-center mx-auto"></div>
      <div className="flex-col align-center justify-center mx-auto">
        <h1 className="font-bold text-2xl text-center mt-8 mb-4">
          All Surveys{" "}
        </h1>
        <ul className="grid grid-cols-2 md:grid-cols-2 gap-4 mx-4">
          {Object.entries(surveys).map(([outerId, outerData]) =>
            Object.entries(outerData).map(([id, surveyData]) => (
              <li
                key={id}
                className="survey-item border p-4 rounded shadow-md flex flex-col text-center"
              >
                <h3 className="font-bold mb-2">{surveyData.title}</h3>
                <p className="mb-3 flex-grow">
                  <span className="font-semibold italic">Created by: </span>
                  {`${surveyData.creator.slice(
                    0,
                    4
                  )}...${surveyData.creator.slice(-5)}`}
                </p>
                <p className="mb-2 flex-grow font-bold">
                  Bounty per User:{" "}
                  <span className="font-normal">
                    $ {surveyData.bountyPerUser}
                  </span>
                </p>
                <p className="mb-2 flex-grow">
                  <span className="font-semibold italic">Time Limit: </span>
                  {surveyData.timeLength}
                </p>
                <Link
                  to={`/survey/${outerId}/${id}`}
                  className="btn btn-sm btn-primary self-start"
                >
                  Take Survey
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default SearchSurveys;
