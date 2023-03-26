import React from "react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Web3 from "web3";
import Web3Modal from "web3modal";
import contractAbi from "../../../abi/surveywei.abi.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";

function SurveyDetails({ connectedAddress }) {
  const { key, id } = useParams();
  const [claimed, setClaimed] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [survey, setSurvey] = useState(null);

  console.log(key, id);

  async function fetchSurveyResponse() {
    try {
      const response = await fetch(
        `https://surveywei-1b1e0-default-rtdb.firebaseio.com/responses/${key}/${id}.json`
      );

      if (response.ok) {
        const data = await response.json();
        setSurvey(data);
        console.log(data);
      } else {
        throw new Error("Failed to fetch surveys");
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  useEffect(() => {
    fetchSurveyResponse();
  }, [key]);

  const connectToMetaMask = async () => {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  };
  const claimBounty = async (firebaseID, contractInstance, userAddress) => {
    try {
      setWaiting(true);
      const tx = await contractInstance.methods
        .claimBounty(firebaseID)
        .send({ from: userAddress });
      console.log("Transaction: ", tx);
      setWaiting(false);
      toast.success("Successfully claimed reward", { position: "top-center" });
    } catch (error) {
      toast.error("Form Submission Unsuccessful", {
        position: "top-center",
      });
    }
  };

  const claimBountyBlockchain = async (firebaseID) => {
    console.log(firebaseID);

    const contractAddress = "0x12feB242DF388c4397EC8B1650F4A09C5C1f6542";
    const userAddress = await connectToMetaMask();
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    console.log("Connected to smart contract:", contract);
    console.log(contract, userAddress);
    claimBounty(firebaseID, contract, userAddress);
  };

  const date = new Date(survey?.timeStarted); // Replace with your desired date
  let timeLength = 10;
  const formattedDate = date.toLocaleString("en-US", {
    hour12: true,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  console.log(formattedDate);

  const timeStarted = new Date(survey?.timeStarted * 1000); // convert Unix timestamp to JavaScript Date object
  const formattedTimeStarted = timeStarted.toLocaleString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const timeFinished = new Date(survey?.timeFinished * 1000); // convert Unix timestamp to JavaScript Date object
  const formattedTimeFinished = timeFinished.toLocaleString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  console.log(formattedTimeStarted);

  console.log(survey);
  return (
    <>
      <ToastContainer />
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
                <h1>{survey?.title}</h1>
              </div>
              <div className="flex ">
                <h1 className="font-semibold mr-20">Date Started:</h1>
                <h1 className="ml-3">{formattedDate}</h1>
              </div>
              <div className="flex ">
                <h1 className="font-semibold mr-20">Time Started:</h1>
                <h1 className="ml-2">{formattedTimeStarted}</h1>
              </div>
              <div className="flex ">
                <h1 className="font-semibold mr-20">Time Finished:</h1>
                <h1 className="">{formattedTimeFinished}</h1>
              </div>
              <div className="flex ">
                <h1 className="font-semibold mr-10">Completion Status:</h1>
                <h1>Completed</h1>
              </div>
              <div className="flex ">
                <h1 className="font-semibold mr-24">Reward:</h1>
                <h1 className="ml-9">{survey?.rewardEarned} wei</h1>
              </div>
              <div className="flex ">
                <h1 className="font-semibold mr-28 mt-2">
                  <span title="You have already claimed the reward.">
                    Claimed:
                  </span>
                </h1>
                {claimed ? (
                  <span title="You have already claimed the reward.">
                    Claimed
                  </span>
                ) : (
                  <div className="flex-col">
                    <button
                      className="btn btn-sm bg-[#4bc7e8] text-white ml-2"
                      onClick={() => claimBountyBlockchain(key)}
                    >
                      Claim
                    </button>
                    <p className="text-sm mt-2">
                      **Unless your Survey Credit Score is good, you must wait 7
                      days after completing to claim
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SurveyDetails;
