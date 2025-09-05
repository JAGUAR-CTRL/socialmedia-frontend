import React from 'react';
import Spinner from './Spinner.jsx';
import "./spinner.css"
function ModalSpinner() {
  return (
    <div className='modal'>
      <Spinner size={70}/>
    </div>
  )
}

export default ModalSpinner
