import React from 'react'
import Avatar from "react-avatar";

const Client = ({userId}) => {
  return (
    <div className='client'>
        <Avatar name = {userId} size = {50} round = "14px"/>
        <span className='user'>{userId}</span>
    </div>
  );
};

export default Client;