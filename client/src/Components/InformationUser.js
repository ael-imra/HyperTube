import React from 'react';

export const InformationUser = (props) => {
  return (
    <div className='Info'>
      <div className='ew'>
        <p>FirstName</p>
        <p>{props.UserInfo.firstName}</p>
      </div>
      <div className='ew'>
        <p>lastName</p>
        <p>{props.UserInfo.lastName}</p>
      </div>
      <div className='ew'>
        <p>Email</p>
        <p>{props.UserInfo.email}</p>
      </div>
      <div className='ew'>
        <p>UserName</p>
        <p>{props.UserInfo.userName}</p>
      </div>
    </div>
  );
};
