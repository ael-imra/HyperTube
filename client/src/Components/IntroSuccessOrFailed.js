import React from "react";
import { DataContext } from "../Context/AppContext";

export const IntroSuccessOrFailed = (props) => {
  const ctx = React.useContext(DataContext);
  return <div className='Titre'>{props.type === "success" ? <p>{ctx.Languages[ctx.Lang].AccountActive}</p> : <p>{ctx.Languages[ctx.Lang].NoResult}</p>}</div>;
};
