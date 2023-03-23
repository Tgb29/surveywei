import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function CreatorSurveyDetails({ connectedAddress }) {
  const [responses, setResponses] = useState([]);
  const { key, id } = useParams();
  const shortenedAddress = (address) =>
    `${address.slice(0, 4)}...${address.slice(-5)}`;

  async function fetchUserResponses(firebaseID) {
    try {
      const response = await fetch(
        "https://surveywei-1b1e0-default-rtdb.firebaseio.com/responses.json"
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const surveysRespondedTo = [];

        for (const key1 in data) {
          for (const key2 in data[key1]) {
            if (data[key1][key2].firebaseID === firebaseID) {
              surveysRespondedTo.push(data[key1][key2]);
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
      const firebaseID = key; // Replace this with the actual firebaseID
      const surveysRespondedTo = await fetchUserResponses(firebaseID);

      setResponses(surveysRespondedTo);
    }
    fetchData();
  }, []);

  const renderTableHeaders = () => {
    const maxQuestions = Math.max(
      ...responses.map((response) => response.responses.length)
    );

    return (
      <>
        <th className="px-4 py-2 font-semibold">Responder</th>
        {Array.from({ length: maxQuestions }, (_, index) => (
          <th key={index} className="px-4 py-2 font-semibold">
            Question {index + 1}
          </th>
        ))}
      </>
    );
  };

  const renderResponses = () => {
    return responses.map((response, index) => (
      <tr className="bg-gray-100" key={index}>
        <td className="px-4 py-2 border">{shortenedAddress(response.taker)}</td>
        {response.responses.map((r, idx) => (
          <td key={idx} className="px-4 py-2 border">
            {r}
          </td>
        ))}
      </tr>
    ));
  };
  console.log(responses);

  return (
    <>
      <div className="bg-[#6166ae] min-h-screen flex items-start pt-16 md:pt-24">
        <div
          id="survey-details-container"
          className="container w-11/12 bg-white flex flex-col align-center justify-center mx-auto p-8 rounded-md shadow-lg"
        >
          <div id="survey-details-heading" className="flex mb-8">
            <Link to={`/user/${connectedAddress}`}>
              {" "}
              <button className="text-blue-500 underline">Back</button>
            </Link>
            <h1 className="text-xl font-bold mx-auto">Survey Details</h1>
          </div>
          {responses.length > 0 ? (
            <div className="w-full">
              <div
                id="survey-details"
                className="flex flex-col space-y-4 mb-8 "
              >
                <div className="flex space-x-10">
                  <h1 className="font-semibold">Survey Title:</h1>
                  <h1>
                    <h1>{responses[0]?.title || "No title"}</h1>
                  </h1>
                </div>
                <div className="flex space-x-20 ">
                  <h1 className="font-semibold">Status:</h1>
                  <h1>Open</h1>
                </div>
              </div>
              <div id="responses-container" className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-200">{renderTableHeaders()}</tr>
                  </thead>
                  <tbody>{renderResponses()}</tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center font-semibold text-xl mt-8 flex-grow flex items-center justify-center">
              No responses yet...
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreatorSurveyDetails;
