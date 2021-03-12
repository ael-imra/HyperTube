import React, { useState, useEffect } from "react";
import "../Css/Users.css";
import Button from "@material-ui/core/Button";
import Search from "./Search";
import { DataContext } from "../Context/AppContext";
import FindReplaceIcon from "@material-ui/icons/FilterList";
import axios from "axios";
import noData from "../Images/no-data.svg";
import CircularProgress from "@material-ui/core/CircularProgress";

export function Users() {
  const ctx = React.useContext(DataContext);
  const [users, changeUsers] = useState([]);
  const [display, changeDisplay] = useState("none");
  const [search, changeSearch] = useState("");

  async function getData() {
    changeDisplay("block");
    await axios.get(`http://localhost:1337/profile/allProfiles/${search}`, { withCredentials: true }).then((res) => {
      /*let array = [...users];
      array.push(res.data.body[0]);
      changeUsers(array);*/
      changeUsers(res.data.body);
      changeDisplay("none");
    });
  }

  useEffect(async () => {
    changeDisplay("block");
    await axios.get(`http://localhost:1337/profile/allProfiles`, { withCredentials: true }).then((res) => {
      changeUsers(res.data.body);
      changeDisplay("none");
    });
  }, []);
  return (
    <div style={{ display: "flex", flexFlow: "column", marginTop: "120px" }}>
      <div className="searchUsers">
        <Search
          Onchange={(str) => {
            changeSearch(str);
          }}
        />
        <Button
          id="search"
          variant="contained"
          size="large"
          startIcon={<FindReplaceIcon style={{ fontSize: "25px" }} />}
          style={{
            backgroundColor: "#ec4646",
            color: "white",
            textTransform: "none",
            width: "11%",
            maxWidth: "120px",
            minWidth: "100px",
            fontSize: "18px",
            height: "45px",
          }}
          onClick={getData}
        >
          {ctx.Languages[ctx.Lang].Search}
        </Button>
      </div>
      <div className="userParent" id="test">
        {users.length > 0 ? (
          users.map((value, key) => (
            <div className="user Fhover" key={key}>
              <img
                className="userImg"
                src={
                  value.image.includes("http://") || value.image.includes("https://") || value.image.includes("data:image/")
                    ? value.image
                    : `http://localhost:1337${value.image}`
                }
              />
              <div className="infoUser">
                <p style={{ color: "white", margin: "0px", fontSize: "13px", letterSpacing: "0.9px" }}>
                  <span>{value.firstName + " "}</span>
                  <span>{value.lastName}</span>
                </p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p className="watchFavor">{`@${value.userName}`}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="NoData">
            <img src={noData} className="ImageNoData" />
            <p>Ups!... no results found</p>
          </div>
        )}
      </div>
      <div className="loading" style={{ display: display }}>
        <CircularProgress color="secondary" style={{ width: "70px", height: "70px", position: "absolute", top: "23%", left: "45%" }} />
      </div>
    </div>
  );
}
