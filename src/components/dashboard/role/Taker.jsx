import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Taker({ connectedAddress }) {
  const [responses, setResponses] = useState({});
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

  return (
    <div className="container w-11/12 rounded-xl bg-gray-100 flex-col align-center justify-center mx-auto pb-10">
      <h1 className="font-bold text-2xl text-center mt-8 mb-4 pt-5">
        Survey Responses
      </h1>
      <table className="w-11/12 border-collapse text-center bg-white align-center justify-center mx-auto">
        <thead>
          <tr>
            <th className="border-2 border-gray-500 p-2">Survey Title</th>
            <th className="border-2 border-gray-500 p-2">Creator</th>
            <th className="border-2 border-gray-500 p-2">Reward Earned</th>
            <th className="border-2 border-gray-500 p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(responses).map(([outerId, outerData]) =>
            Object.entries(outerData).map(([id, surveyData]) => (
              <tr key={id}>
                <td className="border-2 border-gray-500 p-2">
                  {surveyData?.title}
                </td>
                <td className="border-2 border-gray-500 p-2">
                  {`${surveyData?.creator.slice(
                    0,
                    4
                  )}...${surveyData?.creator.slice(-5)}`}
                </td>
                <td className="border-2 border-gray-500 p-2">
                  {surveyData?.rewardEarned
                    ? surveyData?.rewardEarned.toFixed(2)
                    : 0}{" "}
                  wei
                </td>
                <td className="border-2 border-gray-500 p-4">
                  <Link
                    to={`/surveyDetails/${outerId}/${id}`}
                    className="btn btn-sm bg-[#5cc5c6] text-white "
                  >
                    See Details
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Taker;
