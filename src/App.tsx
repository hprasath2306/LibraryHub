import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import { HomePage } from "./layouts/HomePage/HomePage";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { SearchBooksPage } from "./layouts/SearchBookPage/SearchBooksPage";
import { BookCheckoutPage } from "./layouts/BookCheckoutPage/BookCheckoutPage";
import { ReviewListPage } from "./layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
import { ShelfPage } from "./layouts/ShelfPage/ShelfPage";
import { AddNewBook } from "./layouts/ManageLibraryPage/components/AddNewBook";

export const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Switch>
          <Route path={"/"} exact>
            <Redirect to={"/home"} />
          </Route>
          <Route path={"/home"}>
            <HomePage />
          </Route>
          <Route path={"/search"}>
            <SearchBooksPage />
          </Route>
          <Route path={"/checkout/:bookId"}>
            <BookCheckoutPage />
          </Route>
          <Route path={"/reviewList/:bookId"}>
            <ReviewListPage />
          </Route>
          <Route path={"/shelf"}>
            <ShelfPage />
          </Route>
          <Route path={"/admin"}>
            <AddNewBook />
          </Route>
        </Switch>
      </div>

      <Footer />
    </div>
  );
};
