import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { HOST } from '../constants';
export const ImageProfile = (props) => {
  if (props.image)
    return (
      <img
        src={
          props.image.includes('http://') || props.image.includes('https://') || props.image.includes('data:image/')
            ? props.image
            : `${HOST}${props.image}`
        }
        style={{ ...props.style }}
      />
    );
  else
    return (
      <Avatar style={{ ...props.style, backgroundColor: 'rgb(236, 70, 70)' }}>
        {props.userName.substring(0, 2).toUpperCase()}
      </Avatar>
    );
};
