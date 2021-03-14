import React from "react";
import { DataContext } from "../Context/AppContext";

export const IntroSuccessOrFailed = () => {
  const ctx = React.useContext(DataContext);
  return (
    <div className='Titre'>
      <p>{ctx.Languages[ctx.Lang].TitleLogin}</p>
    </div>
  );
};
