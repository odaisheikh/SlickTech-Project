import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Typography, Rating, TextField, Alert } from "@mui/material";
import ReviewForm from "../views/ReviewForm";
import ReviewList from "../views/ReviewList";

const Detail = () => {
  const [product, setProduct] = useState({});
  const { productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [productLoaded, setProductLoaded] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [count, setCount] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products/" + productId, {
        withCredentials: true,
      })
      .then((res) => {
        setProduct(res.data);
        setProductLoaded(true);
      })
      .catch((err) => console.error(err));

    axios
      .get(
        "http://localhost:8000/api/getProductReviews/" + productId,

        { withCredentials: true }
      )
      .then((res) => {
        setReviews(res.data);
        setReviewsLoaded(true);
      })
      .catch((err) => console.error(err.response));
  }, [productId]);

  const createReview = (review) => {
    axios
      .post(
        "http://localhost:8000/api/reviews",
        { ...review, productId },
        { withCredentials: true }
      )
      .then((res) => {
        setReviews([...reviews, res.data]);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const AddToCart = (count) => {
    axios
      .put(
        `http://localhost:8000/api/addToCart`,
        { productId, count },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        console.log(productId);
        console.log(count);
        setMsg("Successfully added to cart!");
      })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  let sum = 0;
  for (const review of reviews) {
    sum += review.rating;
  }
  const totalRating = sum / reviews.length;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "10%",
        }}
      >
        <div style={{ width: "30%", height: "25rem" }}>
          {productLoaded && product.image && (
            <img
              src={require("../images/" + product.image)}
              alt="ff"
              className="imgCard"
              style={{ height: "100%", width: "100%" }}
            ></img>
          )}
          {productLoaded && !product.image && (
            <img
              src={require("../images/productPlaceholder.jpg")}
              alt="ff"
              className="imgCard"
              style={{ height: "100%", width: "100%" }}
            ></img>
          )}
        </div>
        <div
          style={{
            width: "50%",
            height: "25rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            border: "2px solid rgba(158, 153, 158, 0.45)",
            textAlign: "start",
          }}
        >
          <div>
            <h1
              style={{ display: "inline", marginTop: "20px", marginLeft: "5%" }}
            >
              {" "}
              {product.title}
            </h1>
            <br />
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "start",
                }}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: "5%" }}
                  icon="star"
                  className="fa-lg "
                />
                <h2 style={{ display: "inline", marginTop: "20px" }}>
                  <Typography
                    style={{
                      marginLeft: "5%",
                      fontWeight: "700",
                      marginBottom: "10%",
                    }}
                    component="legend"
                  >
                    Rating:
                  </Typography>
                </h2>
                <Rating
                  style={{ marginLeft: "2%" }}
                  name="read-only"
                  value={totalRating}
                  readOnly
                />
              </div>
              <hr />
            </div>
          </div>
          {msg && <Alert severity="success">{msg}</Alert>}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "start",
            }}
          >
            <FontAwesomeIcon
              style={{ marginLeft: "5%" }}
              icon="money-bill"
              className="fa-lg"
            />

            <Typography
              style={{
                marginLeft: "2%",
                fontWeight: "700",
                fontSize: "25px",
                width: "60px",
              }}
              component="legend"
            >
              Price:
            </Typography>

            <Button
              variant="contained"
              disabled
              style={{
                display: "inline",
                padding: "3px",
                fontSize: "18px",
                backgroundColor: "#1c96f8",
                color: "white",
                marginLeft: "3%",
                borderRadius: "10px",
              }}
            >
              {" "}
              {product.price} $
            </Button>
            <br />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                textAlign: "start",
              }}
            >
              <FontAwesomeIcon
                style={{ marginLeft: "5%" }}
                icon=" fa-circle-check"
                className=" fa-lg "
              />
              <Typography
                style={{
                  marginLeft: "1%",
                  fontWeight: "700",
                  fontSize: "25px",
                  width: "40%",
                }}
                component="legend"
              >
                Description:
              </Typography>
            </div>
            <p style={{ marginLeft: "5%", width: "80%" }}> {product.desc}</p>
            <br />
          </div>

          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button variant="contained">Buy Now</Button>
            <TextField
              type="number"
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              onChange={(e) => setCount(e.target.value)}
            />
            <Button
              style={{ backgroundColor: "#ff3648" }}
              onClick={() => AddToCart(count)}
              variant="contained"
            >
              Add To Cart
            </Button>
          </div>
        </div>
      </div>

      <ReviewForm
        onSubmitProp={createReview}
        initialComment=""
        initialRating=""
      />

      <div style={{ marginTop: "10%", textAlign: "start", marginLeft: "5%" }}>
        <h2 style={{ marginBottom: "2%" }}>Product Reviews:</h2>
        {reviewsLoaded && <ReviewList reviews={reviews} />}
      </div>
    </>
  );
};

export default Detail;
