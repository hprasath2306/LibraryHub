import { ReturnBook } from "./ReturnBook";
import { useState, useEffect } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const Carousel = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const url: string = "https://lms-backend-im3n.onrender.com/api/books?page=0&size=9";
      const respone = await fetch(url);
      if (!respone.ok){
        setError(true);
      };
      const data = await respone.json();
      setBooks(data._embedded.books);
      setIsLoading(false);
    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      console.log(error);
    });
  }, []);

  if(error){
    books[0] = {
      id: 1,
      title: "The Da Vinci Code",
    }
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Something went wrong. Please try again later.
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <SpinnerLoading />
    );
  }
  return (
    <div className="container mt-5" style={{ height: 550 }}>
      <div className="homepage-carousel-title">
        <h3>Find your next "I stayed up too late reading" book.</h3>
      </div>
      <div
        id="carouselExampleControls"
        className="carousel carousel-dark slide mt-5 
                d-none d-lg-block"
        data-bs-interval="false"
      >
        {/* Desktop */}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(0, 3).map((book) => {
                return <ReturnBook book={book} key={book.id || null} />;
              })}
            </div>
          </div>
          <div className="carousel-item">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(3, 6).map((book) => {
                return <ReturnBook book={book} key={book.id || null} />;
              })}
            </div>
          </div>
          <div className="carousel-item">
            <div className="row d-flex justify-content-center align-items-center">
              {books.slice(6, 9).map((book) => {
                return <ReturnBook book={book} key={book.id || null} />;
              })}
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="d-lg-none mt-3">
        <div className="row d-flex justify-content-center align-items-center">
          <ReturnBook book={books[0]} key={books[0].id || null} />
        </div>
      </div>
      <div className="homepage-carousel-title mt-3">
        <Link className="btn btn-outline-secondary btn-lg" to="/search">
          View More
        </Link>
      </div>
    </div>
  );
};
