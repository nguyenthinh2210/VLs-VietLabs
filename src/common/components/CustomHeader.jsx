import React, { useState } from 'react'
import { Image, Input, Popover, Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import lists from '../lists'
import PropTypes from 'prop-types'
import { logbookActions } from '../../store/logbook'
import { handleError } from '../helpers'
import { getItemsService } from '../services'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../AuthProvider'
import { MODULE_AUTH } from '../../store/auth'
import imgLogo2 from '../../assets/logoFV 1.png'
import imgAvatar from '../../assets/avatar.png'

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

const propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func
}

const CustomHeader = ({ collapsed, setCollapsed }) => {
  const [searchValue, setSearchValue] = useState('') // State để lưu giá trị input
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state[MODULE_AUTH])

  const content = (
    <div>
      <Button type="text" onClick={() => console.log('Logged out')}>
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" /> {/* Thêm icon Logout */}
        Logout
      </Button>
    </div>
  )

  return (
    <div className="row mt-2 bg-gradient-to-r from-[#F8F6DC] to-[#BAD5D5] p-1 ">
      <Button
        size="large"
        type="text"
        icon={
          collapsed ? (
            <MenuUnfoldOutlined style={{ fontSize: '24px' }} />
          ) : (
            <MenuFoldOutlined style={{ fontSize: '24px' }} />
          )
        }
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64
        }}
      />

      <div className="col flex items-end">
        <Image height={60} preview={false} src={imgLogo2} alt="Logo" />
      </div>

      <div className="col flex justify-end gap-2 items-center">
        {/* <Input.Search
          style={{ width: '60%' }}
          value={searchValue}
          placeholder="Search Record Logbook No"
          onChange={(e) => setSearchValue(e.target.value)} // Cập nhật giá trị khi nhập
          onSearch={navigateToElogbookDetail} // Gọi hàm khi nhấn Enter hoặc icon kính lúp
        /> */}

        <div className="flex items-center">
          <div className="mr-2">{currentUser.Employee_name}</div>
          <span className="text-lg cursor-pointer" onClick={() => console.log('User Icon Clicked')}>
            <Popover content={content} trigger="click">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-200">
                <img src={imgAvatar} className="text-lg" />
              </div>
            </Popover>
          </span>
        </div>
      </div>
    </div>
  )
}
CustomHeader.propTypes = propTypes
export default CustomHeader
