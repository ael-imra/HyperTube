import React from "react";
import "../Css/Profile.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import { InformationUser } from "./InformationUser";
import { UpdateInfoUser } from "./UpdateInfoUser";
import { UpdatePassword } from "./UpdatePassword";
import { GetUserInfo } from "../Assets/GetInfoUser";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Skeleton from "@material-ui/lab/Skeleton";
import { DataContext } from "../Context/AppContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MovieCart } from "./MovieCart";
import Axios from "axios";
import CropOriginalIcon from "@material-ui/icons/PhotoCamera";
import { useParams } from "react-router-dom";
import { ImageProfile } from "./ImageProfile";

export const Profile = () => {
  const [actionProfile, setActionProfile] = React.useState(0);
  const { userName } = useParams();
  const ctx = React.useContext(DataContext);
  const [userInfo, setUserInfo] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    fixFirstName: "",
    fixLastName: "",
    fixEmailName: "",
    fixUserName: "",
    middleware: false,
    listMovies: [],
  });
  const [contentMessage, setContentMessage] = React.useState({ type: "", content: "", state: false });
  const handleCloseMessage = () => {
    setContentMessage({ type: "info", content: "", state: false });
  };
  const updateImageProfile = (e) => {
    let reader = new FileReader();
    setUserInfo((oldValue) => ({ ...oldValue, image: "X" }));
    reader.onload = async () => {
      const backupImage = userInfo;
      const imageData = await Axios.put(`/profile/image`, { image: reader.result }, { withCredentials: true });
      if (imageData.data.type === "success") setUserInfo((oldValue) => ({ ...oldValue, image: reader.result }));
      else setUserInfo({ ...backupImage });
      setContentMessage({ type: imageData.data.type, content: imageData.data.body[ctx.Lang], state: true });
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  React.useEffect(() => {
    let unmount = false;
    async function awaitData() {
      const data = await GetUserInfo(userName);
      if (!unmount)
        setUserInfo({
          ...data,
          middleware: true,
          fixFirstName: data.firstName,
          fixLastName: data.lastName,
          fixEmailName: data.email,
          fixUserName: data.userName,
        });
    }
    if (!unmount) awaitData();
    return () => (unmount = true);
  }, []);
  const GetLastMovies = async () => {
    const lastMovies = await Axios.get(`/watchedMovie/lastWatchedMovies/sel-hamr`, { withCredentials: true });
    const listFavorite = await Axios(`/favorite/imdbID`, { withCredentials: true });
    const data =
      lastMovies.data.body instanceof Array
        ? lastMovies.data.body.map((movie, key) => ({
            image: `https://image.tmdb.org/t/p/original/${movie.movieImage}`,
            year: movie.movieRelease,
            titre: movie.movieTitle,
            description: movie.movieDescription,
            rating: movie.movieRating,
            runtime: movie.movieTime,
            genres: movie.movieGenre ? JSON.parse(movie.movieGenre) : [],
            language: movie.movieLanguage,
            imdbCode: movie.imdbID,
            id: movie.viewedID,
            isFavorite: listFavorite.data.body instanceof Array && listFavorite.data.body.findIndex((a) => a.imdbID === movie.imdbID) !== -1 ? true : false,
            isWatched: true,
          }))
        : [];
    return data;
  };
  return (
    <div className='Profile'>
      {userInfo.middleware ? (
        userInfo.hasOwnProperty("firstName") ? (
          <>
            <div className='detailUser'>
              <div className='UserInfo'>
                <div className={`${userInfo.isProfileOfYou ? "ImageProfile" : ""}`}>
                  {userInfo.image === "X" ? (
                    <Skeleton variant='circle' width={200} height={200} style={{ backgroundColor: "rgb(165 165 165)" }} />
                  ) : (
                    <ImageProfile
                      image={userInfo.image}
                      userName={userInfo.userName}
                      style={{ width: "200px", height: "200px", fontSize: "70px", borderRadius: "50%", marginTop: `${userInfo.isProfileOfYou ? "0px" : "15px"}` }}
                    />
                  )}
                  {userInfo.image === "X" || !userInfo.isProfileOfYou ? (
                    ""
                  ) : (
                    <input
                      type='file'
                      accept='image/*'
                      style={{ position: "absolute", width: "100%", height: "100%", opacity: "0", top: "0", left: "0", borderRadius: "50%", cursor: "pointer", zIndex: "8" }}
                      onChange={updateImageProfile}
                    />
                  )}
                  {userInfo.isProfileOfYou ? (
                    <div className='UpdateImage'>
                      <CropOriginalIcon style={{ fontSize: "47px", color: "rgb(34, 40, 49)" }} />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <p>{userInfo.fixUserName}</p>
                <p>{userInfo.fixEmailName}</p>
                <div className='CountWatchAndFavorite'>
                  <div>
                    <p>{userInfo.countMoviesWatch}</p>
                    <p>{ctx.Languages[ctx.Lang].Watch}</p>
                  </div>
                  <div></div>
                  <div>
                    <p>{userInfo.countFavorite}</p>
                    <p>{ctx.Languages[ctx.Lang].Favorite}</p>
                  </div>
                </div>
              </div>
              <div className='ActionInfo' style={{ height: userInfo.isProfileOfYou ? "400px" : "300px" }}>
                <AppBar style={{ backgroundColor: "transparent", height: "48px" }} position='static'>
                  <Tabs variant='scrollable' value={actionProfile} onChange={(event, newValue) => setActionProfile(newValue)}>
                    <Tab label={ctx.Languages[ctx.Lang].Information} />
                    {userInfo.isProfileOfYou ? <Tab label={ctx.Languages[ctx.Lang].UpdateInformation} /> : ""}
                    {userInfo.userFrom === "local" && userInfo.isProfileOfYou ? <Tab label={ctx.Languages[ctx.Lang].UpdatePassword} /> : ""}
                  </Tabs>
                </AppBar>
                {actionProfile === 0 ? (
                  <InformationUser
                    UserInfo={{
                      firstName: userInfo.fixFirstName,
                      lastName: userInfo.fixLastName,
                      userName: userInfo.fixUserName,
                      email: userInfo.fixEmailName,
                      isProfileOfYou: userInfo.isProfileOfYou,
                    }}
                  />
                ) : actionProfile === 1 ? (
                  <UpdateInfoUser setUserInfo={setUserInfo} userInfo={userInfo} setContentMessage={setContentMessage} />
                ) : (
                  <UpdatePassword setContentMessage={setContentMessage} />
                )}
              </div>
            </div>
            <div className='MoviesWatch'>
              <p>{ctx.Languages[ctx.Lang].LastWatch}</p>
              <div className='lastMovies'>
                {userInfo.listMovies.length !== 0 ? (
                  userInfo.listMovies.map((movie, key) => <MovieCart movie={movie} key={key} style={{ position: "absolute", left: key * 320 }} />)
                ) : (
                  <p className='alertNoResult'>{ctx.Languages[ctx.Lang].NoResult}</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className='alertNoResult'>{ctx.Languages[ctx.Lang].NoResult}</p>
        )
      ) : (
        <CircularProgress color='secondary' />
      )}

      {contentMessage.type !== "info" ? (
        <Snackbar open={contentMessage.state} autoHideDuration={5000} onClose={handleCloseMessage}>
          <Alert severity={contentMessage.type} onClose={handleCloseMessage} variant='filled'>
            {contentMessage.content}
          </Alert>
        </Snackbar>
      ) : (
        ""
      )}
    </div>
  );
};
