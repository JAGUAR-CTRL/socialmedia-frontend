import React from 'react'
import "./spinner.css"
function Spinner({size}) {
  return (
    <div className='spinner' 
    style={{
        width: size,
        height: size,
        border: "3px solid #ddd",
        borderTop:"3.5px solid white",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    }}>
    </div>
  )
}

export default Spinner
