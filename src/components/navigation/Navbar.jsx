import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div id="navbar-container" className="flex border-b-2 ">
        <Link to="/" className="flex my-auto bg-[yellow] w-1/3 py-5">
          <div id="logo container" className="text-3xl font-bold text-black">
            Survey<span className="text-white">Wei</span>
          </div>
        </Link>
        <div id="menu container" className="flex m-auto space-x-10">
          <Link to="/build" className="flex m-auto">
            <button className="btn btn-link">Build Survey</button>
          </Link>

          <button className="btn btn-link">Find Survey</button>
          <button className="bg-[blue] rounded-full px-3 py-1 text-white">
            Connect
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
