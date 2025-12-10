import React from 'react'

const CustomFooter = () => {
  return (
    <div
      //style={{ position: 'relative', height: '100%' }}
      className="row mt-2 bg-gradient-to-r from-[#F8F6DC] to-[#BAD5D5] p-1">
      {/* Gradient từ xanh lá nhạt đến xanh da trời nhạt */}
      <div className="col flex flex-col items-center">
        <div className="font-bold text-center mb-2">Copyright © 2024 by FV Hospital</div>
      </div>
    </div>
  )
}

export default CustomFooter

//Code CustomFooter
