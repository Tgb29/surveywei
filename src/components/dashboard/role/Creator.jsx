import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Creator({ connectedAddress }) {
  const [surveys, setSurveys] = useState({});
  const [showAll, setShowAll] = useState(false);

  const creatorAddress = connectedAddress;

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
            const created = data[key1][key2].created;
            if (
              (lowercaseCreator === lowercaseCreatorAddress) &
              (created === true)
            ) {
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

  const displayedSurveys = showAll
    ? Object.entries(surveys)
    : Object.entries(surveys).slice(0, 8);

  const totalSurveys = Object.entries(surveys).length;

  return (
    <div className="container w-11/12 rounded-xl bg-gray-100 flex-col align-center justify-center mx-auto pb-10">
      <h1 className="flex font-bold text-3xl mb-10 pt-5 text-center align-center justify-center text-[#1c1b53]">
        Created Surveys
      </h1>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-4 my-5">
        {displayedSurveys.map(([outerId, outerData]) =>
          Object.entries(outerData).map(([id, surveyData]) => (
            <li
              key={id}
              className="border bg-white p-4 rounded shadow-md flex flex-col text-center"
            >
              <h3 className="font-bold mb-2">Title: {surveyData.title}</h3>
              <p className="mb-2 flex-grow font-bold">
                Reward :{" "}
                <span className="font-normal">
                  {surveyData.rewardPerUser
                    ? surveyData.rewardPerUser.toFixed(2)
                    : 0}{" "}
                  wei
                </span>
              </p>

              <Link
                to={`/user/surveyDetails/${outerId}/${id}`}
                className="btn btn-sm bg-[#5cc5c6] text-white self-start mx-auto"
              >
                See Responses
              </Link>
            </li>
          ))
        )}
      </ul>
      {totalSurveys >= 8 && (
        <p
          className="text-right underline text-blue-500 cursor-pointer text-lg mr-8 font-bold"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "See All"}
        </p>
      )}
    </div>
  );
}

export default Creator;
