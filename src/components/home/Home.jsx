import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Logo from "../../assets/LogoTransparent.png";

function Home() {
  const [recentSurveys, setRecentSurveys] = useState([]);

  const getAllSurveys = async () => {
    try {
      const response = await fetch(
        "https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json"
      );

      if (response.ok) {
        const data = await response.json();
        const recentSurveysCreated = {};

        for (const key1 in data) {
          for (const key2 in data[key1]) {
            const created = data[key1][key2].created;
            if (created === true) {
              if (!recentSurveysCreated[key1]) {
                recentSurveysCreated[key1] = {};
              }
              recentSurveysCreated[key1][key2] = data[key1][key2];
            }
          }
        }

        return recentSurveysCreated;
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

        const lastFourSurveys = allSurveys.slice(-6);
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
          <h1 className="font-bold text-2xl text-white mb-4">
            Welcome to <span className="text-[#1c1b53]">Survey</span>
            <span className="text-[#4bc7e8]">Wei</span>
          </h1>
          <p className="text-white font-semibold mb-4">
            Create and participate in secure, decentralized surveys on the
            blockchain.
          </p>
          <p className="text-white">
            Find and complete surveys to earn rewards!
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
      <section className="recent-surveys bg-gray-300">
        <h2 className="font-bold text-4xl mb-10 text-[#1c1b53] text-center">
          Recent Surveys
        </h2>
        <div className="survey-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-4">
          {recentSurveys.map((survey) => {
            const shortenedCreator = `${survey.creator.slice(
              0,
              4
            )}...${survey.creator.slice(-5)}`;

            return (
              <div
                key={survey.id}
                className="bg-white border rounded-xl shadow-md p-4 flex flex-col"
              >
                <h3 className="text-lg font-bold mb-2">{survey.title}</h3>
                <p className="text-sm font-semibold">
                  Created by: {shortenedCreator}
                </p>
                <p className="text-sm my-2 font-semibold">
                  Reward:
                  <span className="font-normal">
                    {" "}
                    {survey.rewardPerUser
                      ? survey.rewardPerUser.toFixed(2)
                      : 0}{" "}
                    wei
                  </span>{" "}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Time Limit: </span>
                  {survey.timeLength} minutes
                </p>
                <Link
                  to={`/survey/${survey.outerId}/${survey.id}`}
                  className="btn btn-sm btn-primary self-start mt-auto"
                >
                  Take Survey
                </Link>
              </div>
            );
          })}
        </div>

        <Link to="/find">
          <p className="text-right underline text-[#1c1b53] cursor-pointer text-lg mr-8 font-bold mt-4">
            See All
          </p>
        </Link>
      </section>

      <section className="how-it-works bg-gray-300 min-w-full py-12 text-[#1c1b53]">
        <h1 className="text-center font-bold text-4xl mb-10">How it works:</h1>
        <div className="container mx-auto px-4">
          <div className="section-container bg-white border rounded-xl shadow-md p-8">
            <div className="build-survey mb-8 md:flex mx-auto align-center justify-center">
              <div className="flex-col md:mr-20">
                <h2 className="font-bold text-2xl mb-4">Build & Sponsor</h2>
                <ul className="font-semibold text-lg list-disc list-inside mb-4">
                  <li>Create your own 5-question survey.</li>
                  <li>Sponsor it with a smart contract.</li>
                  <li>
                    Monitor your surveys and responses in
                    <br className="hidden md:inline" />{" "}
                    <span className="md:ml-8">
                      real-time through the user dashboard.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="text-center md:text-right my-auto md:mt-24 md:ml-20 mb-8 md:mb-0">
                <Link to="/build" className="btn btn-secondary">
                  Build Surveys
                </Link>
              </div>
            </div>
            <hr className="mb-8" />
            <div className="how-it-works-user mb-8 md:flex mx-auto align-center justify-center md:ml-[20rem]">
              <div className="text-center md:text-left my-auto md:mt-24 md:mr-20 mb-8 md:mb-0">
                <Link to="/find" className="btn btn-primary">
                  Find Surveys
                </Link>
              </div>
              <div className="flex-col md:ml-20">
                <h2 className="font-bold text-2xl mb-4 mt-5">
                  Take surveys & Get paid!
                </h2>
                <ul className="font-semibold text-lg list-disc list-inside mb-4">
                  <li>
                    Connect your Metamask wallet to the SurveyWei platform.
                  </li>
                  <li>
                    Find and complete surveys within the prompted time duration.
                  </li>
                  <li>
                    Get instantly rewarded in cryptocurrency upon completion.
                  </li>
                </ul>
              </div>
            </div>
            <hr className="mb-8" />
            <div className="how-it-works-credit mb-8 md:flex mx-auto align-center justify-center ">
              <div className="flex-col md:ml-20">
                <h2 className="font-bold text-2xl mb-4 mt-5">
                  Survey Credit Score
                </h2>
                <ul className="font-semibold text-lg list-disc list-inside mb-8">
                  <li>
                    Receive a positive attestation anytime you complete a
                    survey.
                  </li>
                  <li>
                    If you cheat or provide bad data, you'll receive a negative
                    attestation.
                  </li>
                  <li>
                    Pass the Credit Check and get your rewards paid instantly!
                  </li>
                </ul>

                <Link to="/find" className="btn btn-secondary mt-5">
                  Get Started !
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1c1b53] text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <img
              src={Logo}
              alt="SurveyWei Logo"
              className="w-14 md:w-16 lg:w-20 xl:w-24 max-w-full max-h-20 md:max-h-20 lg:max-h-24 xl:max-h-28"
            />
            <div
              id="logo-container"
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#6166ae] text-white ml-[-6px] md:ml-[-14px]"
            >
              Survey<span className="text-[#4bc7e8]">Wei</span>
            </div>
          </div>

          <p className="text-center md:text-right flex-grow md:flex-grow-0 mr-5">
            &copy; 2023 SurveyWei. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
