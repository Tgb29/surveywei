import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [recentSurveys, setRecentSurveys] = useState([]);

  const getAllSurveys = async () => {
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
  };

  useEffect(() => {
    // Fetch the 4 most recent surveys from the database
    const fetchRecentSurveys = async () => {
      const surveys = await getAllSurveys();
      if (surveys) {
        const allSurveys = Object.entries(surveys)
          .map(([outerId, outerData]) => {
            return Object.entries(outerData).map(([id, surveyData]) => {
              return { outerId, id, ...surveyData };
            });
          })
          .flat();

        const lastFourSurveys = allSurveys.slice(-4);
        setRecentSurveys(lastFourSurveys);
        console.log("Recent surveys:", lastFourSurveys);
      }
    };

    fetchRecentSurveys();
  }, []);
  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h1 className="font-bold text-2xl">
            Welcome to Survey<span className="text-black">Wei</span>
          </h1>
          <p>
            Create and participate in secure, decentralized surveys on the
            blockchain.
          </p>
          <div className="hero-buttons">
            <Link to="/find" className="btn btn-primary">
              Find Surveys
            </Link>
            <Link to="/build" className="btn btn-secondary">
              Build Surveys
            </Link>
          </div>
        </div>
      </section>
      <section className="recent-surveys">
        <h2 className="font-bold text-xl mb-5">Recent Surveys</h2>
        <div className="survey-list grid grid-cols-2 md:grid-cols-4 gap-4 mx-4">
          {recentSurveys.map((survey) => {
            const shortenedCreator = `${survey.creator.slice(
              0,
              4
            )}...${survey.creator.slice(-5)}`;

            return (
              <div
                key={survey.id}
                className="survey-item border p-4 rounded shadow-md flex flex-col"
              >
                <h3 className="font-bold mb-2">{survey.title}</h3>
                <p className="mb-3 flex-grow">
                  <span className="font-semibold italic">Created by: </span>
                  {shortenedCreator}
                </p>
                <p className="mb-2 flex-grow font-bold">
                  Bounty per User:{" "}
                  <span className="font-normal">$ {survey.bountyPerUser}</span>
                </p>
                <p className="mb-2 flex-grow">
                  <span className="font-semibold italic">Time Limit: </span>
                  {survey.timeLength}
                </p>
                <Link
                  to={`/start/${survey.outerId}/${survey.id}`}
                  className="btn btn-sm btn-primary self-start"
                >
                  Take Survey
                </Link>
              </div>
            );
          })}
        </div>
      </section>
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p>
          // Add your text here about how the platform works. You can use
          multiple paragraphs or list items if needed.
        </p>
      </section>
      <footer>
        <p>&copy; 2023 SurveyWei. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
