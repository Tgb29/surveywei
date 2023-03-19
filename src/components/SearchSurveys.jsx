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
        <ul className="list-none space-y-4 px-4">
          {Object.entries(surveys).map(([outerId, outerData]) =>
            Object.entries(outerData).map(([id, surveyData]) => (
              <li key={id}>
                <Link
                  to={`/start/${outerId}/${id}`}
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

export default SearchSurveys;
