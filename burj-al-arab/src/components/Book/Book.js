import DateFnsUtils from "@date-io/date-fns";
import { Button, Grid } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import Bookings from "../Bookings/Bookings";

const Book = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [selectedDate, setSelectedDate] = useState({
    checkIn: new Date(),
    checkOut: new Date(),
  });

  const { bedType } = useParams();
  const handleCheckInDate = (date) => {
    const newDate = { ...selectedDate };
    newDate.checkIn = date;
    setSelectedDate(newDate);
  };

  const handleCheckOutDate = (date) => {
    const newDate = { ...selectedDate };
    newDate.checkOut = date;
    setSelectedDate(newDate);
  };
  const handleBooking = () => {
    let newBooking = { ...loggedInUser, ...selectedDate };
    fetch("http://localhost:5000/addBooking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <div style={{ textAlign: "center" }}>
      <h1>
        Hey {loggedInUser.name} 🎉🎉, Let's book a {bedType} Room.
      </h1>
      <p>
        Want a <Link to="/home">different room?</Link>{" "}
      </p>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Check in date"
            value={selectedDate.checkIn}
            onChange={handleCheckInDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Check out date"
            format="MM/dd/yyyy"
            value={selectedDate.checkOut}
            onChange={handleCheckOutDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </Grid>
        <Button onClick={handleBooking} variant="outlined" color="primary">
          Book now
        </Button>
      </MuiPickersUtilsProvider>
      <Bookings />
    </div>
  );
};

export default Book;
