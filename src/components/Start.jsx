import React from "react";
import { Link, useParams } from "react-router-dom";

function Start() {
  const { key, id } = useParams();
  return (
    <>
      <Link
        to={`/survey/${key}/${id}`}
        className="btn rounded-xl bg-[lightgreen] flex w-40 mx-auto align-center justify-center"
      >
        Start Survey
      </Link>
    </>
  );
}

export default Start;
