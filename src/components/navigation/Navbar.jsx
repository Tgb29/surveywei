import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/LogoTransparent.png";

function Navbar({ connectedAddress, setConnectedAddress }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const closeDropdown = () => {
    setDropdownOpen(false);
  };
  const checkMetamaskConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setConnectedAddress(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error);
      }
    }
  };
  useEffect(() => {
    checkMetamaskConnection();
    const handleClickOutside = (e) => {
      if (
        e.target.closest("#hamburger-icon") === null &&
        e.target.closest("#dropdown") === null &&
        e.target.closest(".nav-link") === null
      ) {
        setDropdownOpen(false);
      }
    };

    const handleScroll = () => {
      setDropdownOpen(false);
    };

    window.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setConnectedAddress(accounts[0]);
      } else {
        setConnectedAddress(null);
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setConnectedAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed.");
    }
  };
  return (
    <>
      <div
        id="navbar-container"
        className="flex border-b-2 bg-white py-1 md:py-0"
      >
        <Link to="/" className="flex items-center w-full md:w-1/3 pl-5">
          <img
            src={Logo}
            alt="SurveyWei Logo"
            className="w-1/3 md:w-1/4 max-w-full max-h-20 md:max-h-24 xl:max-h-24"
          />
          <div
            id="logo-container"
            className="ml-[-16px] md:ml-[-24px] xl:ml-[-24px] text-2xl md:text-3xl font-bold text-[#1c1b53]"
          >
            Survey<span className="text-[#4bc7e8]">Wei</span>
          </div>
        </Link>
        <div
          id="menu-container"
          className="hidden md:flex items-center justify-end w-2/3 pr-5 space-x-10"
        >
          <Link to="/find" className="flex ">
            <button className="nav-link btn btn-link font-semibold text-[#1c1b53] hover:text-[#4bc7e8]">
              Find Survey
            </button>
          </Link>
          <Link to="/build" className="flex ">
            <button className="nav-link btn btn-link font-semibold text-[#1c1b53] hover:text-[#4bc7e8]">
              Build Survey
            </button>
          </Link>
          <button
            className={`${
              connectedAddress ? "hidden" : ""
            } bg-[#4bc7e8] rounded-full px-4 py-2 text-white font-semibold hover:bg-blue-600`}
            onClick={connectMetamask}
          >
            Connect
          </button>
          {connectedAddress ? (
            <Link to={`/user/${connectedAddress}`}>
              <i className="fas fa-user-circle text-[#4bc7e8] text-4xl cursor-pointer"></i>
            </Link>
          ) : (
            <i className="hidden fas fa-user-circle text-[#4bc7e8] text-4xl cursor-pointer"></i>
          )}
        </div>
        <div className="md:hidden w-1/3 flex justify-center items-center">
          <i
            id="hamburger-icon"
            className="fas fa-bars text-2xl cursor-pointer"
            onClick={toggleDropdown}
          ></i>
        </div>
        <div className="md:hidden w-1/3 flex justify-end items-center pr-5">
          <i
            className={`${
              connectedAddress ? "hidden" : ""
            } fas fa-wallet text-[#4bc7e8] text-2xl cursor-pointer`}
            onClick={connectMetamask}
          ></i>
          {connectedAddress ? (
            <Link to={`/user/${connectedAddress}`}>
              <i className="fas fa-user-circle text-[#4bc7e8] text-3xl cursor-pointer"></i>
            </Link>
          ) : (
            <i className="hidden fas fa-user-circle text-[#4bc7e8] text-3xl cursor-pointer"></i>
          )}
        </div>

        {dropdownOpen && (
          <div
            id="dropdown"
            className="md:hidden w-48 bg-white border-t-2 py-2 absolute left-1/2 -translate-x-1/2 mt-20 ml-28 shadow-md rounded-md"
          >
            <Link to="/find" className="block py-2 px-5">
              <button
                className="nav-link btn btn-link font-semibold text-gray-700 hover:text-gray-900"
                onClick={closeDropdown}
              >
                Find Survey
              </button>
            </Link>
            <Link to="/build" className="block py-2 px-5">
              <button
                className="nav-link btn btn-link font-semibold text-gray-700 hover:text-gray-900"
                onClick={closeDropdown}
              >
                Build Survey
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
