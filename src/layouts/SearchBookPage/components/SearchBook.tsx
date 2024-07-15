import { Link } from "react-router-dom";
import BookModel from "../../../models/BookModel";
import { supabase } from "../../../supabaseClient";
import { useEffect, useState } from "react";
import axios from "axios";

export const SearchBook: React.FC<{ book: BookModel }> = (props) => {

  const { data } = supabase.storage.from("lms").getPublicUrl(props.book.img!);
  // console.log(props.book.img);

  const [imageSrc, setImageSrc] = useState("");
  // console.log(data.publicUrl.slice(0, 72));

    const fetchImage = async () => {
      const url =
        data.publicUrl;
      try {
        const response = await axios.get(url);
        setImageSrc(response.data);
      } catch (error) {
        // console.error("Error fetching the image:", error);
      }
    };

    fetchImage();
  

  return (
    <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
      <div className="row g-0">
        <div className="col-md-2">
          <div className="d-none d-lg-block">
            {imageSrc ? (
              <img src={imageSrc} width="123" height="196" alt="Book" />
            ) : (
              <img
                src={require("./book-luv2code-1000.png")}
                width="123"
                height="196"
                alt="Book"
              />
            )}
          </div>
          <div
            className="d-lg-none d-flex justify-content-center 
                        align-items-center"
          >
            {imageSrc ? (
              <img src={imageSrc} width="123" height="196" alt="Book" />
            ) : (
              <img
                src={require("./book-luv2code-1000.png")}
                width="123"
                height="196"
                alt="Book"
              />
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <h5 className="card-title">{props.book.author}</h5>
            <h4>{props.book.title}</h4>
            <p className="card-text">{props.book.description}</p>
          </div>
        </div>
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <Link
            className="btn btn-md main-color text-white"
            to={`/checkout/${props.book.id}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
