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
    <div>
      <h1>Search Surveys</h1>
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

export default SearchSurveys;
