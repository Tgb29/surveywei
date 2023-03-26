import React from "react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import UserAddressContext from "../../UserAddressContext";
import Web3 from "web3";
import Web3Modal from "web3modal";
import contractAbi from "../../abi/surveywei.abi.json";
import Spinner from "../../assets/spinner.gif";

function Start({ timeLimit, rewardPerUser, onStart, resetStartState }) {
  const { key, id } = useParams();

  const [active, setActive] = useState(
    () => JSON.parse(localStorage.getItem("startActive")) ?? true
  );

  const [waiting, setWaiting] = useState(false);

  // const startSurvey = () => {
  //   console.log("surveyStarted");
  // };
  const connectToMetaMask = async () => {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  };

  useEffect(() => {
    localStorage.setItem("startActive", JSON.stringify(active));
  }, [active]);

  const beginSurvey = async (firebaseID, contractInstance, userAddress) => {
    try {
      setWaiting(true);
      const tx = await contractInstance.methods
        .beginSurvey(firebaseID)
        .send({ from: userAddress });
      console.log("Transaction: ", tx);

      setActive(!active);
      setWaiting(false);

      //want to add time started function to pass the time the waiting went to false as time started on the survey page
      onStart();
    } catch (error) {
      console.error("Error:", error);
      setWaiting(false);
    }
  };

  const startSurveyBlockchain = async (firebaseID) => {
    console.log(firebaseID);

    const contractAddress = "0xd3f2E5e4891E8F779533f95DA7A5AB075F9afd86";
    const userAddress = await connectToMetaMask();
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    console.log("Connected to smart contract:", contract);
    console.log(contract, userAddress);
    beginSurvey(firebaseID, contract, userAddress);
  };
  const continueToSurvey = (e) => {
    e.preventDefault();
    startSurveyBlockchain(key);
  };

  useEffect(() => {
    return () => {
      resetStartState();
    };
  }, []);
  return (
    <>
      {waiting ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
          <img src={Spinner} alt="spinner" className="w-24 h-24" />
        </div>
      ) : (
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
                You will have{" "}
                <span className="font-bold">{timeLimit} minutes </span>to
                complete this survey
              </p>
              <p className="mb-6">
                Upon completion you will receive {rewardPerUser.toFixed(2)} wei
              </p>
              <button
                // to={`/survey/${key}/${id}`}
                className="btn rounded-xl bg-[#5cc5c6] hover:bg-[#16a085] flex w-40 mx-auto align-center justify-center mb-6"
                onClick={continueToSurvey}
              >
                Start Survey
              </button>
              <p>Must sign into MetaMask to continue</p>
              <p>***Please do not refreash once survey begins***</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Start;
