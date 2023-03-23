import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Creator from "./role/Creator";
import Taker from "./role/Taker";

function UserSurveys({ connectedAddress }) {
  const [surveys, setSurveys] = useState({});
  const [responses, setResponses] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [creator, setCreator] = useState(true);

  // const creatorAddress = "0xa209d66169840b201e56a80a2c73eb6d0427575d";

  const creatorAddress = connectedAddress;
  // async function fetchSurveysByCreator(creatorAddress) {
  //   try {
  //     const response = await fetch(
  //       "https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json"
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       const creatorSurveys = {};

  //       const lowercaseCreatorAddress = creatorAddress.toLowerCase();

  //       for (const key1 in data) {
  //         for (const key2 in data[key1]) {
  //           const lowercaseCreator = data[key1][key2].creator.toLowerCase();
  //           if (lowercaseCreator === lowercaseCreatorAddress) {
  //             if (!creatorSurveys[key1]) {
  //               creatorSurveys[key1] = {};
  //             }
  //             creatorSurveys[key1][key2] = data[key1][key2];
  //           }
  //         }
  //       }

  //       return creatorSurveys;
  //     } else {
  //       throw new Error("Failed to fetch surveys");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     return null;
  //   }
  // }

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
      // const creatorSurveys = await fetchSurveysByCreator(creatorAddress);
      const surveysRespondedTo = await fetchUserResponses(creatorAddress);
      // setSurveys(creatorSurveys);
      setResponses(surveysRespondedTo);
      // console.log(creatorSurveys);
    }
    fetchData();
  }, []);

  const displayedSurveys = showAll
    ? Object.entries(surveys)
    : Object.entries(surveys).slice(0, 8);

  const totalSurveys = Object.entries(surveys).length;

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

        {/* <div className="container w-11/12 rounded-xl bg-gray-100 flex-col align-center justify-center mx-auto pb-10">
          <h1 className="flex font-bold text-3xl mb-10 pt-5 text-center align-center justify-center">
            My Surveys
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
                    Bounty per User:{" "}
                    <span className="font-normal">
                      $ {surveyData.bountyPerUser}
                    </span>
                  </p>

                  <Link
                    to={`/user/surveyDetails/${outerId}/${id}`}
                    className="btn btn-sm bg-blue-500 text-white self-start mx-auto"
                  >
                    See Responses
                  </Link>
                </li>
              ))
            )}
          </ul>
          {totalSurveys >= 8 && (
            <p
              className="text-right underline text-blue-500 cursor-pointer text-lg mr-5"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "See All"}
            </p>
          )}
        </div> */}
      </div>
      {!creator ? <Taker connectedAddress={creatorAddress} /> : ""}

      {/* <div className="container w-11/12 rounded-xl bg-gray-100 flex-col align-center justify-center mx-auto pb-10">
        <h1 className="font-bold text-2xl text-center mt-8 mb-4 pt-5">
          Survey Responses
        </h1>
        <table className="w-11/12 border-collapse text-center bg-white align-center justify-center mx-auto">
          <thead>
            <tr>
              <th className="border-2 border-gray-500 p-2">Survey Title</th>
              <th className="border-2 border-gray-500 p-2">Creator</th>
              <th className="border-2 border-gray-500 p-2">Bounty Earned</th>
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
                    {surveyData?.bountyEarned || 0}
                  </td>
                  <td className="border-2 border-gray-500 p-4">
                    <Link
                      to={`/surveyDetails/${outerId}/${id}`}
                      className="btn btn-sm bg-blue-500 text-white "
                    >
                      See Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}

export default UserSurveys;
