import React from 'react'

import UsersSelect from './UsersSelect'
import { useDispatch, useSelector } from 'react-redux'
import { authActions, MODULE_AUTH } from '../../store/auth'

const propTypes = {}

function ChangeLoginUserSelect() {
  const { currentUser } = useSelector((state) => state[MODULE_AUTH])
  const dispatch = useDispatch()
  const handleOnChangeUser = (value) => {
    dispatch(authActions.setCurrentUser(value))
  }

  return (
    <UsersSelect
      defaultSelectedUser={currentUser}
      handleOnChangeUser={handleOnChangeUser}
      isReset={true}
    />
  )
}

ChangeLoginUserSelect.propTypes = propTypes
export default ChangeLoginUserSelect
