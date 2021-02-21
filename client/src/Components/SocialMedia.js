import React from 'react';
import Google from '../Images/google.svg';
import Intra42 from '../Images/Intra42.jpg';
import Github from '../Images/github.svg';
import { DataContext } from '../Context/AppContext';
import '../Css/SocialMedia.css';

function getImage(type) {
  if (type === 'Gmail') return <img src={Google} alt='Google' />;
  if (type === 'Intra') return <img src={Intra42} alt='Google' />;
  if (type === 'Github') return <img src={Github} alt='Google' />;
}
export default function SocialMedia(props) {
  const ctx = React.useContext(DataContext);
  return (
    <div
      className='socialMedia'
      style={{
        backgroundColor: `${props.type === 'Gmail' ? '#EA4335' : props.type === 'Intra' ? '#00babc' : '#f6f8fa'}`,
      }}>
      {getImage(props.type)}
      <p style={{ color: `${props.type === 'Github' ? 'black' : 'white'}` }}>
        {props.mode === 'login' ? `${ctx.Languages[ctx.Lang].Login}` : `${ctx.Languages[ctx.Lang].Register}`} {ctx.Languages[ctx.Lang].With} {props.type === 'Gmail' ? 'Gmail' : props.type === 'Intra' ? 'Intra 42' : 'Github'}
      </p>
    </div>
  );
}
