import React from "react";

import { useState, useEffect, useRef, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserAddressContext from "../../UserAddressContext";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import Web3Modal from "web3modal";

function Form2() {
  const [title, setTitle] = useState("");
  const [respondentsOption, setRespondentsOption] = useState("fixed");
  const [numberOfRespondents, setNumberOfRespondents] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [rewardPerUser, setRewardPerUser] = useState(0);
  const [timeLength, setTimeLength] = useState(null);
  const [formData, setFormData] = useState([{}]);
  const [questions, setQuestions] = useState([]);
  const [questionRefs, setQuestionRefs] = useState([React.createRef()]);
  const [firebaseID, setFirebaseId] = useState(null);

  const connectedAddress = useContext(UserAddressContext);
  const navigate = useNavigate();
  const connectToMetaMask = async () => {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  };

  const onChange = (index) => (e) => {
    setFormData((prevState) => {
      const newState = [...prevState];
      newState[index] = { ...newState[index], [e.target.id]: e.target.value };
      return newState;
    });
  };

  const onRespondentsOptionChange = (e) => {
    setRespondentsOption(e.target.value);
  };

  const makeQuestions = () => {
    const newQuestions = [];
    for (let i = 0; i < formData.length; i++) {
      const question = formData[i][`question${i + 1}`];
      const answers = [
        formData[i].answer1,
        formData[i].answer2,
        formData[i].answer3,
        formData[i].answer4,
      ];
      newQuestions[i] = { question: question, answers: answers };
    }
    return newQuestions;
  };

  const onClick = async () => {
    if (!validateForm()) {
      return;
    }

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

    const updatedQuestions = makeQuestions();
    setQuestions(updatedQuestions);

    try {
      const response = await fetch(
        "https://surveywei-1b1e0-default-rtdb.firebaseio.com/surveys.json",
        {
          method: "POST",
          body: JSON.stringify({
            [uuidv4()]: {
              title: title,
              creator: userAddress,
              questions: updatedQuestions,
              rewardPerUser: rewardPerUser,
              timeLength: timeLength,
              type: respondentsOption,
              numberOfQuestions: updatedQuestions.length,
            },
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const responseBody = await response.json(); // Extract the JSON object from the response body
        const uniqueKey = responseBody.name; // Get the unique key from the JSON object
        console.log("Firebase unique key:", uniqueKey); // Use the unique key as needed
        console.log(responseBody);
        console.log(response);
        setFirebaseId(uniqueKey);

        showSuccessToast();
        console.log(uniqueKey);
        createSurveytoBlockchain(
          uniqueKey,
          totalReward,
          numberOfRespondents,
          timeLength
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setTimeout(() => {
      navigate("/user/:connectedAddress");
    }, 2000);
  };

  const createSurveytoBlockchain = (
    firebaseID,
    reward,
    respondents,
    timeLength
  ) => {
    console.log(firebaseID, reward, respondents, timeLength);
  };

  const showSuccessToast = () => {
    toast.success("Survey submitted successfully!", {
      position: "top-center",
      autoClose: 1000,
    });
  };

  useEffect(() => {
    if (formData.length > 1) {
      questionRefs[formData.length - 1].current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [formData]);

  useEffect(() => {
    if (numberOfRespondents > 0) {
      setRewardPerUser(totalReward / numberOfRespondents);
    } else {
      setRewardPerUser(0);
    }
  }, [numberOfRespondents, totalReward]);

  const addQuestion = () => {
    if (formData.length < 5) {
      setFormData((prevFormData) => [...prevFormData, { id: uuidv4() }]);
      setQuestions((prevQuestions) => [...prevQuestions, {}]);
      setQuestionRefs((prevRefs) => [...prevRefs, React.createRef()]);
    } else {
      alert("You have reached the maximum limit of 5 questions.");
    }
  };

  const removeQuestion = (index) => {
    setFormData((prevState) => prevState.filter((_, i) => i !== index));
    setQuestions((prevState) => prevState.filter((_, i) => i !== index));
    setQuestionRefs((prevState) => prevState.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!title) {
      toast.error("Please enter a survey title.", { position: "top-center" });
      return false;
    }
    if ((respondentsOption === "fixed") & !numberOfRespondents) {
      toast.error("Please enter amount of respondents intended", {
        position: "top-center",
      });
      return false;
    }
    if ((respondentsOption === "fixed") & !totalReward) {
      toast.error("Please enter amount of reward ", { position: "top-center" });
      return false;
    }

    for (let i = 0; i < formData.length; i++) {
      const question = formData[i][`question${i + 1}`];
      const answers = [
        formData[i].answer1,
        formData[i].answer2,
        formData[i].answer3,
        formData[i].answer4,
      ];

      if (!question) {
        toast.error(`Please enter a question for Question ${i + 1}.`, {
          position: "top-center",
        });
        return false;
      }

      const hasAtLeastOneAnswer = answers.some((answer) => answer);

      if (!hasAtLeastOneAnswer) {
        toast.error(
          `Please provide at least one answer for Question ${i + 1}.`,
          {
            position: "top-center",
          }
        );
        return false;
      }
    }

    return true;
  };

  const questionBlocks = formData.map((question, i) => (
    <div
      key={question.id}
      ref={questionRefs[i]}
      id={`question${i + 1}-block`}
      className="flex align-center justify-center mx-auto text-center border-2 mb-10 p-4 bg-white rounded-xl shadow-lg w-full sm:w-11/12 md:w-3/4 lg:w-1/2"
    >
      <div>
        <label className="mr-2">{`Question ${i + 1}:`}</label>
        <input
          type="text"
          className="border-2 bg-gray-100 shadow-md mb-4 px-2 py-1"
          placeholder={`Enter Question ${i + 1}`}
          id={`question${i + 1}`}
          onChange={onChange(i)}
        />
        <h2>Answers:</h2>
        {Array.from({ length: 4 }, (_, j) => (
          <div key={j} className="mb-2">
            <label className="mr-2">{`Option ${j + 1}:`}</label>
            <input
              type="text"
              className="border-2 bg-gray-100 shadow-md px-2 py-1"
              placeholder={`Enter Option ${j + 1}`}
              id={`answer${j + 1}`}
              onChange={onChange(i)}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center ml-2 sm:ml-4 md:ml-10">
        <button
          type="button"
          onClick={() => removeQuestion(i)}
          className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full text-red-500 border border-red-500"
        >
          <i className="fas fa-minus"></i>
        </button>
        {i === formData.length - 1 && (
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full text-blue-500 border border-blue-500 ml-2"
          >
            <i className="fas fa-plus"></i>
          </button>
        )}
      </div>
    </div>
  ));

  return (
    <>
      <div className="bg-[#4bc7e8]  font-sans pb-10">
        <div className="flex align-center justify-center mx-auto"></div>
        <div
          id="form-container"
          className="flex-col align-center justify-center mx-auto "
        >
          <div id="headline-container">
            <h1 className="font-bold text-2xl text-center mt-8 mb-4 text-[#1c1b53]">
              Create Survey
            </h1>
          </div>
          <div id="form-block" className="flex-col mx-auto">
            <div className="flex-col align-center justify-center mx-auto text-center border-2 mb-10 p-4 bg-white rounded-xl shadow-lg w-full sm:w-11/12 md:w-3/4 lg:w-1/2">
              <div
                id="title-container"
                className="flex items-center justify-center mx-auto text-center mb-2"
              >
                <label className="mr-2 align-middle">Survey Title: </label>
                <input
                  type="text"
                  className="border-2 bg-gray-100 shadow-md mt-3 mb-4 px-2 py-1 align-middle"
                  placeholder="Enter Survey Title"
                  id="title"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div>
              <div
                id="time-length-container"
                className="flex items-center justify-center mx-auto text-center mb-2"
              >
                <label className="ml-20 mr-2">Time Length: </label>
                <input
                  type="text"
                  className="border-2 bg-gray-100 shadow-md mt-3 mb-4 px-2 py-1 align-middle"
                  placeholder="Enter time length"
                  id="timeLength"
                  onChange={(e) => {
                    setTimeLength(e.target.value);
                  }}
                />
                <p className="ml-2 font-bold"> in Minutes</p>
              </div>
              <div className="flex items-center justify-center mx-auto text-center mb-2 mr-2 ">
                Survey Type:
                <div className="flex items-center mr-4 ml-2">
                  <input
                    type="radio"
                    id="fixedLimit"
                    name="respondentsOption"
                    value="fixed"
                    checked={respondentsOption === "fixed"}
                    onChange={onRespondentsOptionChange}
                  />
                  <label htmlFor="fixedLimit" className="ml-2">
                    Fixed Limit
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="noLimit"
                    name="respondentsOption"
                    value="noLimit"
                    checked={respondentsOption === "noLimit"}
                    onChange={onRespondentsOptionChange}
                  />
                  <label htmlFor="noLimit" className="ml-2">
                    No Limit
                  </label>
                </div>
              </div>
              <div
                id="fixed-limt-form-container"
                hidden={respondentsOption === "noLimit"}
              >
                <div
                  id="respondents-container"
                  className="flex items-center justify-center mx-auto text-center mb-2"
                >
                  <label className="mr-2 align-middle"># of Respondents:</label>
                  <input
                    type="number"
                    className="border-2 bg-gray-100 shadow-md mt-3 mb-4 px-2 py-1 align-middle mr-10"
                    placeholder="Enter # of Respondents"
                    id="numberOfRespondents"
                    onChange={(e) => {
                      setNumberOfRespondents(e.target.value);
                    }}
                  />
                </div>
                <div
                  id="reward-container"
                  className="flex items-center justify-center mx-auto text-center "
                >
                  <label className="ml-8 mr-2 align-middle">
                    Total reward:
                  </label>
                  <input
                    type="number"
                    className="border-2 bg-gray-100 shadow-md mt-3 mb-4 px-2 py-1 align-middle mr-2"
                    placeholder="Enter Total Rewards"
                    id="reward"
                    onChange={(e) => {
                      setTotalReward(e.target.value);
                    }}
                  />
                  <h1 className="font-bold ">USD</h1>
                </div>
                <p className="flex items-center justify-center mx-auto text-center mb-5 ">
                  Reward per user :{"   "}
                  <span className="font-bold mx-2">{rewardPerUser}</span> USD
                </p>
              </div>
            </div>
            {questionBlocks}
          </div>
        </div>
        <button
          type="button"
          onClick={onClick}
          className="btn rounded-xl py-2 px-4 bg-[#6166ae] text-white flex align-center justify-center text-center mx-auto my-1 mb-3"
        >
          Submit Survey
        </button>
      </div>
      <ToastContainer />
    </>
  );
}

export default Form2;
