import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Start from "./Start";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import UserAddressContext from "../../UserAddressContext";
import Web3 from "web3";
import Web3Modal from "web3modal";
import { v4 as uuidv4 } from "uuid";

function Survey() {
  const { key, id } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(null);
  const [timer, setTimer] = useState(null);

  const [isUserCreator, setIsUserCreator] = useState(false);

  const connectedAddress = useContext(UserAddressContext);
  console.log(typeof connectedAddress, typeof surveyData?.creator);
  console.log(connectedAddress, surveyData?.creator);

  useEffect(() => {
    // Check if the connected address is the same as the creator in the survey data
    if (
      surveyData &&
      connectedAddress &&
      surveyData.creator?.toLowerCase() === connectedAddress.toLowerCase()
    ) {
      setIsUserCreator(true);
    } else {
      setIsUserCreator(false);
    }
  }, [surveyData, connectedAddress]);

  useEffect(() => {
    if (timeLeft === 0) {
      localStorage.removeItem("startActive");
      localStorage.removeItem("timeLeft");

      toast.error("Time expired");
      resetStartState(); // Call resetStartState here
      setTimeout(() => {
        navigate("/find");
      }, 2000);
    }
  }, [timeLeft]);

  const startTimer = () => {
    const currentTimeLeft = JSON.parse(localStorage.getItem("timeLeft"));
    if (currentTimeLeft) {
      setTimeLeft(currentTimeLeft);
    } else {
      setTimeLeft(30 * 60);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (timeLeft !== null) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          localStorage.setItem("timeLeft", JSON.stringify(prevTimeLeft - 1));
          return prevTimeLeft - 1;
        });
      }, 1000);
      setTimer(timerId);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  async function fetchSurveyData() {
    try {
      const response = await fetch(
        `https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys/${key}/${id}.json`
      );

      if (response.ok) {
        const data = await response.json();
        setSurveyData(data);
      } else {
        throw new Error("Failed to fetch survey data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchSurveyData();
  }, [id]);

  const connectToMetaMask = async () => {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearInterval(timer);
    setFormSubmitted(true);

    let userAddress = connectedAddress;
    if (!userAddress) {
      try {
        userAddress = await connectToMetaMask();
      } catch (error) {
        toast.error(
          "Please connect to MetaMask before submitting the survey.",
          {
            position: "top-center",
          }
        );
        return;
      }
    }

    const responses = surveyData.questions.map((_, questionIndex) => {
      const checkedAnswer = document.querySelector(
        `input[name="question-${questionIndex}"]:checked`
      );
      return checkedAnswer ? checkedAnswer.value : null;
    });

    // Attach creator's information to the responses data
    const responseData = {
      creator: surveyData?.creator || "Unknown", // Using optional chaining and fallback value
      responses: responses,
      taker: userAddress || "Unknown",
      firebaseID: key,
      rewardPerUser: surveyData?.rewardPerUser,
    };

    try {
      const response = await fetch(
        "https://surveywei-1b1e0-default-rtdb.firebaseio.com/responses.json",
        {
          method: "POST",
          body: JSON.stringify({
            [uuidv4()]: {
              title: surveyData?.title,
              creator: surveyData?.creator || "Unknown", // Using optional chaining and fallback value
              responses: responses,
              taker: userAddress || "Unknown",
              rewardEarned: surveyData?.rewardPerUser,
              firebaseID: key,
              timeStarted: Date.now(),
            },
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const responseBody = await response.json(); // Extract the JSON object from the response body
        const uniqueKey = responseBody.name; // Get the unique key from the JSON object
        console.log("Firebase unique key:", uniqueKey); // Use the unique key as needed
      }
    } catch (error) {
      console.error("Error:", error);
    }
    localStorage.removeItem("startActive");
    localStorage.removeItem("timeLeft");

    console.log("Responses:", responseData);
    console.log("Survey submitted, time stopped");
    resetStartState();
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const formatQuestion = (questionText) => {
    const capitalizedFirstLetter =
      questionText.charAt(0).toUpperCase() + questionText.slice(1);
    const endsWithQuestionMark = capitalizedFirstLetter.endsWith("?");
    return endsWithQuestionMark
      ? capitalizedFirstLetter
      : capitalizedFirstLetter + "?";
  };

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  const resetStartState = () => {
    localStorage.removeItem("startActive");
  };

  return (
    <>
      {!isUserCreator && (
        <Start
          timeLimit={surveyData?.timeLimit || 5}
          rewardPerUser={surveyData?.rewardPerUser || 0}
          onStart={startTimer}
          resetStartState={resetStartState}
        />
      )}
      <ToastContainer position="top-center" />
      <div className="bg-[#4bc7e8] min-h-screen font-sans pt-8">
        <div className="flex flex-col items-center">
          {timeLeft !== null && (
            <div className="text-3xl font-bold  md:hidden mb-4">
              Time Left: {formatTime(timeLeft)}
            </div>
          )}
          <h1 className="font-bold text-3xl text-center mb-4 text-[#1c1b53]">
            {surveyData.title}
          </h1>
          {timeLeft !== null && (
            <div
              className="hidden lg:block text-3xl font-bold fixed right-10 top-0 p-4 lg:top-1/2 lg:-translate-y-1/2"
              style={{ zIndex: 1000 }}
            >
              {timeLeft !== null && (
                <div>Time Left: {formatTime(timeLeft)}</div>
              )}
            </div>
          )}
        </div>
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit}
          style={{
            pointerEvents:
              timeLeft === 0 || formSubmitted || isUserCreator
                ? "none"
                : "auto",
          }}
        >
          {surveyData.questions &&
            surveyData.questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="border-2 mb-10 p-6 bg-white rounded shadow-lg w-full sm:w-11/12 md:w-3/4 lg:w-1/2"
              >
                <h3 className="font-bold text-xl mb-6 text-center text-[#1c1b53]">
                  {formatQuestion(question.question)}
                </h3>
                {question.answers.map((answer, answerIndex) => (
                  <div key={answerIndex} className="mb-2 text-center">
                    <input
                      type="radio"
                      id={`question-${questionIndex}-answer-${answerIndex}`}
                      name={`question-${questionIndex}`}
                      value={answer}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`question-${questionIndex}-answer-${answerIndex}`}
                      className="text-gray-700"
                    >
                      {answer}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          <button
            type="submit"
            className="btn rounded-xl py-2 px-4 bg-[#6166ae] hover:bg-[#1c1b53] text-white flex align-center justify-center text-center mx-auto my-1 mb-3 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default Survey;