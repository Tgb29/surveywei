import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function Start({ timeLimit, bountyPerUser, onStart, resetStartState }) {
  const { key, id } = useParams();

  const [active, setActive] = useState(
    () => JSON.parse(localStorage.getItem("startActive")) ?? true
  );

  useEffect(() => {
    localStorage.setItem("startActive", JSON.stringify(active));
  }, [active]);

  const continueToSurvey = (e) => {
    e.preventDefault();
    setActive(!active);
    onStart();
  };

  useEffect(() => {
    return () => {
      resetStartState();
    };
  }, []);
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20  ${
          !active ? "hidden" : ""
        }`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div
            id="modal-container"
            className="w-11/12 md:w-1/2 lg:w-1/3 bg-white p-8 rounded shadow-lg text-center relative"
          >
            <Link to="/find">
              <button className="absolute top-2 left-2 flex items-center text-blue-500 ml-5">
                <i className="fas fa-arrow-left mr-1"></i>
                Return to Find Surveys
              </button>
            </Link>
            <p className=" mt-5 mb-4">
              You will have {timeLimit} minutes to complete this survey
            </p>
            <p className="mb-6">
              Upon completion you will receive ${bountyPerUser}
            </p>
            <button
              // to={`/survey/${key}/${id}`}
              className="btn rounded-xl bg-[lightgreen] flex w-40 mx-auto align-center justify-center mb-6"
              onClick={continueToSurvey}
            >
              Start Survey
            </button>
            <p>Must sign into MetaMask to continue</p>
            <p>***Please do not refreash once survey begins***</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Start;
