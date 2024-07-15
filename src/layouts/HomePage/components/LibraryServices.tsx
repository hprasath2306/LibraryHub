import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export const LibraryServices = () => {
  const { isSignedIn } = useAuth();
  return (
    <div className="container my-5">
      <div className="row p-4 align-items-center border shadow-lg">
        <div className="col-lg-7 p-3">
          <h1 className="display-4 fw-bold">
            Can't find what you are looking for?
          </h1>
          <p className="lead">
            If you cannot find what you are looking for, send our library
            admin's a personal message!
          </p>
          <div className="d-grid gap-2 justify-content-md-start mb-4 mb-lg-3">
            {isSignedIn ? (
              <Link className="btn main-color btn-lg text-white" to="#">
                Library services
              </Link>
            ) : (
              <a
                className="btn main-color btn-lg text-white"
                href="https://large-grubworm-54.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fhome"
              >
                Sign up
              </a>
            )}
          </div>
        </div>
        <div className="col-lg-4 offset-lg-1 shadow-lg lost-image"></div>
      </div>
    </div>
  );
};
