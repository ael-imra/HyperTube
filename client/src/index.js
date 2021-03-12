import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./Components/App";
import Axios from "axios";
import { LiteYouTubeEmbed } from "react-lite-youtube-embed";
Axios.defaults.baseURL = "http://localhost:1337";

ReactDOM.render(<LiteYouTubeEmbed id='L2vS_050c-M' title='What’s new in Material Design for the web (Chrome Dev Summit 2019)' noCookie={true} />, document.getElementById("root"));
