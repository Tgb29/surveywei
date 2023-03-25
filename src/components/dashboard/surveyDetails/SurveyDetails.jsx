import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function SurveyDetails({ connectedAddress }) {
  const [claimed, setClaimed] = useState(false);
  const date = new Date(); // Replace with your desired date
  let timeLength = 10;
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

  console.log(formattedDate);

  const now = new Date();
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const time = hour + ":" + minute;

  const tenMinutesLater = new Date(now.getTime() + 10 * 60000);
  const hours = tenMinutesLater.getHours();
  const minutes = tenMinutesLater.getMinutes();
  console.log("Current time: " + hours + ":" + minutes);
  const usHour = hours % 12 || 12; // convert to 12-hour format
  const usMinute = minutes.toString().padStart(2, "0"); // add leading zero if necessary
  const amPm = hours >= 12 ? "PM" : "AM";
  console.log("US format: " + usHour + ":" + usMinute + " " + amPm);

  return (
    <div className="bg-[#6166ae] min-h-screen flex items-start pt-16 md:pt-24">
      <div
        id="survey-details-container"
        className="container w-11/12 bg-white flex flex-col align-center justify-center mx-auto p-8 rounded-md shadow-lg"
      >
        <div id="survey-details-heading" className="flex mb-8">
          <Link to={`/user/${connectedAddress}`}>
            <button className="text-[#1c1b53] p-1 rounded focus:outline-none">
              <i className="fas fa-arrow-left text-xl"></i>
            </button>
          </Link>
          <h1 className="text-2xl font-bold mx-auto text-[#1c1b53]">
            Survey Details
          </h1>
        </div>
        <div id="survey-details">
          <div className="flex flex-col space-y-2 text-lg font-sans">
            <div className="flex ">
              <h1 className="font-semibold mr-24">Survey Title:</h1>
              <h1>This is the title of the survey</h1>
            </div>
            <div className="flex ">
              <h1 className="font-semibold mr-20">Date Started:</h1>
              <h1 className="ml-3">{formattedDate}</h1>
            </div>
            <div className="flex ">
              <h1 className="font-semibold mr-20">Time Started:</h1>
              <h1 className="ml-2">{time}</h1>
            </div>
            <div className="flex ">
              <h1 className="font-semibold mr-20">Time Finished:</h1>
              <h1 className="">{usHour + ":" + usMinute + " " + amPm}</h1>
            </div>
            <div className="flex ">
              <h1 className="font-semibold mr-10">Completion Status:</h1>
              <h1>Completed</h1>
            </div>
            <div className="flex ">
              <h1 className="font-semibold mr-24">Reward:</h1>
              <h1 className="ml-9">0.20 wei </h1>
            </div>
            <div className="flex ">
              <h1 className="font-semibold mr-28 mt-2">Claimed:</h1>
              {claimed ? (
                <h1>Claimed</h1>
              ) : (
                <button className="btn btn-sm bg-[#4bc7e8] text-white ml-2">
                  Claim
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyDetails;
