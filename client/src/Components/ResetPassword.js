import React from "react";
import Input from "./Input";
import Button from "@material-ui/core/Button";
import { DataContext } from "../Context/AppContext";
import Axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function ResetPassword(props) {
  const [password, changePassword] = React.useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [resetPassword, setResetPassword] = React.useState(false);
  let { token } = useParams();
  const history = useHistory();
  const ctx = React.useContext(DataContext);

  const ResetPassword = async () => {
    if (ctx.Validator("password", password.newPassword) && password.newPassword === password.confirmPassword) {
      const result = await Axios.post(`/auth/updatePassword`, { newPassword: password.newPassword, token: token });
      if (result.data.type === "success") history.push("/");
      props.handleShowMessage(result.data.type, result.data.body[ctx.Lang]);
    } else props.handleShowMessage("error", ctx.Languages[ctx.Lang].passwordNotMatch);
  };
  React.useEffect(() => {
    let unmount = false;
    async function leakData() {
      const checkToken = await Axios.get(`/auth/check/${token}`);
      if (checkToken.data.body !== true) {
        props.handleShowMessage(checkToken.data.type, checkToken.data.body[ctx.Lang]);
        props.setIsLogin(true);
        history.push("/");
      } else if (!unmount) setResetPassword(true);
    }
    leakData();
    return () => (unmount = true);
  }, []);
  if (resetPassword)
    return (
      <div className='Sing'>
        <p className='Title-1'> {ctx.Languages[ctx.Lang].ResetPassword}</p>
        <div className='Form-Group' style={{ width: "100%" }}>
          <p>{ctx.Languages[ctx.Lang].NewPassword}</p>
          <Input
            DefaultValue={password.newPassword}
            Onchange={(newPassword) => {
              changePassword((oldValue) => ({ ...oldValue, newPassword: newPassword }));
            }}
            Disabled='false'
            Type='password'
            OnEnter={ResetPassword}
          />
          <p>{ctx.Languages[ctx.Lang].ConfirmPassword}</p>
          <Input
            DefaultValue={password.confirmPassword}
            Onchange={(confirmPassword) => {
              changePassword((oldValue) => ({ ...oldValue, confirmPassword: confirmPassword }));
            }}
            Disabled='false'
            OnEnter={ResetPassword}
            Type='password'
          />
        </div>
        <Button
          variant='contained'
          size='large'
          onClick={ResetPassword}
          style={{
            backgroundColor: "#03a9f1",
            color: "white",
            textTransform: "none",
            width: "250px",
            marginTop: "15px",
          }}>
          {ctx.Languages[ctx.Lang].ResetPassword}
        </Button>
      </div>
    );
  else return <CircularProgress />;
}
