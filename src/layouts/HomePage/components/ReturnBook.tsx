import React, { useState } from "react";
import BookModel from "../../../models/BookModel";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import axios from "axios";

export const ReturnBook: React.FC<{ book: BookModel }> = (props) => {
  const { data } = supabase.storage.from("lms").getPublicUrl(props.book.img!);
  // console.log(props.book.img);

  const [imageSrc, setImageSrc] = useState("");
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
    <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div className="text-center">
        {imageSrc ? (
          <img src={imageSrc} width="151" height="233" alt="book" />
        ) : (
          <img
            src={require("./book-luv2code-1000.png")}
            width="151"
            height="233"
            alt="book"
          />
        )}
        <h6 className="mt-2">{props.book.title}</h6>
        <p>{props.book.author}</p>
        <Link
          className="btn main-color text-white"
          to={`checkout/${props.book.id}`}
        >
          Reserve
        </Link>
      </div>
    </div>
  );
};
