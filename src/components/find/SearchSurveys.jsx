import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SearchSurveys() {
  const [surveys, setSurveys] = useState({});
  const [sortReverse, setSortReverse] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

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

  const totalPages = Math.ceil(Object.keys(surveys).length / itemsPerPage);

  const handleClickNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleClickPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleSort = () => {
    setSortReverse(!sortReverse);
  };

  const handleItemsPerPageChange = (e) => {
    setCurrentPage(1);
    setItemsPerPage(
      e.target.value === "all"
        ? Object.keys(surveys).length
        : parseInt(e.target.value)
    );
  };

  const surveysArray = Object.entries(surveys);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedSurveys = sortReverse
    ? surveysArray
        .slice(surveysArray.length - endIndex, surveysArray.length - startIndex)
        .reverse()
    : surveysArray.slice(startIndex, endIndex);

  return (
    <div className="bg-[#4bc7e8] min-h-screen flex flex-col items-center justify-center">
      <div className="my-4 w-11/12">
        <h1 className="text-3xl font-bold text-center text-[#1c1b53] my-5">
          Find Surveys on Survey Wei
        </h1>
        <p className="my-4 text-lg text-center text-[#1c1b53] font-semibold w-11/12 mx-auto">
          Surveywei's find surveys page is the perfect way to earn money on your
          own terms, in a way that's quick, easy, and secure. Start browsing our
          database today and see just how much you can earn!
        </p>
        <div className="flex justify-end my-8 space-x-4 mr-2">
          <div className="text-white font-bold">
            Show:
            <select
              onChange={handleItemsPerPageChange}
              className="ml-2 bg-[#4bc7e8] border-2 border-white rounded"
            >
              <option value="9">9</option>
              <option value="18">18</option>
              <option value="all">All</option>
            </select>
          </div>
          <button onClick={toggleSort} className="text-white font-bold">
            Sort{" "}
            <i className={`fas fa-sort-${sortReverse ? "up" : "down"}`}></i>
          </button>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedSurveys.map(([outerId, outerData]) =>
            Object.entries(outerData).map(([id, surveyData]) => (
              <li
                key={id}
                className="bg-white border rounded-xl shadow-md p-4 flex flex-col"
              >
                <h3 className="text-lg font-bold mb-2">{surveyData.title}</h3>
                <p className="text-sm font-semibold">
                  Created by:{" "}
                  {`${surveyData.creator.slice(
                    0,
                    4
                  )}...${surveyData.creator.slice(-5)}`}
                </p>
                <p className="text-sm my-2">
                  <span className="font-semibold">Reward per User: </span>${" "}
                  {surveyData.rewardPerUser.toFixed(2)}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Time Limit: </span>
                  {surveyData.timeLength}
                </p>
                <Link
                  to={`/survey/${outerId}/${id}`}
                  className="btn btn-sm btn-primary self-start mt-auto"
                >
                  Take Survey
                </Link>
              </li>
            ))
          )}
        </ul>
        <div className="mt-8 flex justify-center ">
          <button
            onClick={handleClickPrev}
            className={`btn btn-sm btn-secondary mr-2 ${
              currentPage === 1 ? "disabled" : ""
            }`}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-gray-600 text-lg my-auto font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleClickNext}
            className={`btn btn-sm btn-secondary ml-2 ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchSurveys;
