import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

const Bookings = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/bookings?email=" + loggedInUser.email)
      .then((res) => res.json())
      .then((data) => setBookings(data));
  });
  return (
    <div>
      <h3>You have {bookings.length} bookings: </h3>
      {bookings.map((bk) => (
        <li>
          {bk.name} from: {new Date(bk.checkIn).toDateString("MM/dd/yy")} to:{" "}
          {new Date(bk.checkOut).toDateString("MM/dd/yy")}
        </li>
      ))}
    </div>
  );
};

export default Bookings;
