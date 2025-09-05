import React from 'react';
import Logo from './Logo.jsx';

function Header({onclick, username}) {
  return (
    <div>
      <div className='header'>
        <Logo/>
        <button onClick={() => onclick()}>Log out</button>
      </div>
        <h2 style={{marginLeft: "50px"}}>{username || "Username"}</h2>
    </div>
  )
}

export default Header
