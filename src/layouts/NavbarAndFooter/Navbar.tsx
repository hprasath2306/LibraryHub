import { NavLink } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

export const Navbar = () => {
  const { isSignedIn, user } = useUser();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">
          <NavLink to="/" className="navbar-brand">
            LMS
          </NavLink>
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/search" className="nav-link">
                Search books
              </NavLink>
            </li>
            {isSignedIn &&
              <li className='nav-item'>
                <NavLink className='nav-link' to='/shelf'>Shelf</NavLink>
              </li>
            }
            
            {isSignedIn && user?.emailAddresses[0].emailAddress === 'hariprasaths21cs@psnacet.edu.in' &&
              <li className='nav-item'>
                <NavLink className='nav-link' to='/admin'>Admin</NavLink>
              </li>
            }
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item m-1">
              <SignedOut>
                <a
                  href="https://large-grubworm-54.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fhome"
                  type="button"
                  className="btn btn-outline-light"
                >
                  Sign in
                </a>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
