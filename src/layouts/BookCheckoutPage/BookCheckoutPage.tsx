import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../utils/SpinnerLoading";
import { StarsReview } from "../utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useAuth, useUser } from "@clerk/clerk-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { supabase } from "../../supabaseClient";
import axios from "axios";

export const BookCheckoutPage = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  // console.log(user?.emailAddresses[0].emailAddress);

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  // Loans Count State
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(true);

  // Is Book Check Out?
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  const [imageSrc, setImageSrc] = useState("");

  const bookId = window.location.pathname.split("/")[2];
  // console.log(bookId);

  
  // console.log(props.book.img);

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `https://lms-backend-im3n.onrender.com/api/books/${bookId}`;
      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const responseJson = await response.json();
      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };
      setBook(loadedBook);
      setIsLoading(false);
    };
    fetchBook().catch((error: any) => {
      setIsLoading(false);
      console.log(error);
    });
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `https://lms-backend-im3n.onrender.com/api/reviews/search/findByBookId?bookId=${bookId}`;
      const responseReviews = await fetch(reviewUrl);
      if (!responseReviews.ok) {
        throw new Error("Something went wrong!");
      }
      const responseJsonReviews = await responseReviews.json();
      const responseData = responseJsonReviews._embedded.reviews;
      const loadedReviews: ReviewModel[] = [];
      let weightedStarReviews: number = 0;
      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          book_id: responseData[key].bookId,
          reviewDescription: responseData[key].reviewDescription,
        });
        weightedStarReviews = weightedStarReviews + responseData[key].rating;
      }

      if (loadedReviews) {
        const round = (
          Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };

    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      console.log(error);
    });
  }, []);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (isSignedIn) {
        const url = `https://lms-backend-im3n.onrender.com/api/reviews/secure/user/book?bookId=${bookId}&userEmail=${user?.emailAddresses[0].emailAddress}`;
        const userReview = await fetch(url);
        if (!userReview.ok) {
          throw new Error("Something went wrong");
        }
        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);
      }
      setIsLoadingUserReview(false);
    };
    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
    });
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchCurrentLoansCount = async () => {
      if (!isSignedIn) {
        return;
      }
      const baseUrl: string = `https://lms-backend-im3n.onrender.com/api/books/secure/currentloans/count?userEmail=${user?.emailAddresses[0].emailAddress}`;
      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const responseJson = await response.json();
      setCurrentLoansCount(responseJson);
      setIsLoadingCurrentLoansCount(false);
    };
    fetchCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      console.log(error);
    });
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookCheckedOut = async () => {
      if (!isSignedIn) {
        return;
      }
      const baseUrl: string = `https://lms-backend-im3n.onrender.com/api/books/secure/ischeckedout/byuser?bookId=${bookId}&userEmail=${user?.emailAddresses[0].emailAddress}`;
      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const responseJson = await response.json();
      setIsCheckedOut(responseJson);
      setIsLoadingBookCheckedOut(false);
    };
    fetchBookCheckedOut().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      console.log(error);
    });
  }, []);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  async function checkoutBook() {
    console.log(book?.id);
    const url = `https://lms-backend-im3n.onrender.com/api/books/secure/checkout?bookId=${book?.id}&userEmail=${user?.emailAddresses[0].emailAddress}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setIsCheckedOut(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    );
    const url = `https://lms-backend-im3n.onrender.com/api/reviews/secure?userEmail=${user?.emailAddresses[0].emailAddress}`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel),
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setIsReviewLeft(true);
  }

  
  const { data } = supabase.storage.from("lms").getPublicUrl(book?.img!);
  // console.log(data.publicUrl.slice(0, 72));

  const fetchImage = async () => {
    const url = data.publicUrl;
    try {
      const response = await axios.get(url);
      setImageSrc(response.data);
    } catch (error) {
      // console.error("Error fetching the image:", error);
    }
  };

  fetchImage();
  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {imageSrc ? (
              <img src={imageSrc} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("./book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoansCount={currentLoansCount}
            isCheckedOut={isCheckedOut}
            isAuthenticated={isSignedIn}
            checkoutBook={checkoutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center alighn-items-center">
          {imageSrc ? (
            <img src={imageSrc} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansCount={currentLoansCount}
          isCheckedOut={isCheckedOut}
          isAuthenticated={isSignedIn}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
