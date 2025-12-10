import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { DatePicker, Form, Input, InputNumber } from 'antd'
import dayjs from '../../../common/dayjs'
import { FORMAT_DATETIME } from '../../../common/constant'

// Add PropTypes validation
const propTypes = {
  editing: PropTypes.bool, // `editing` must be a boolean and is required
  dataIndex: PropTypes.string, // The column identifier (e.g., 'name')
  fieldProp: PropTypes.object,
  title: PropTypes.string, // The title of the column
  inputType: PropTypes.string, // The input type, e.g., 'text' or 'number'
  record: PropTypes.object, // The data record for the current row
  index: PropTypes.number, // The row index (optional)
  children: PropTypes.array // The children inside the cell
}

const EditableCellComponent = ({
  editing,
  dataIndex,
  fieldProp,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
  const { TextArea } = Input
  // Function to format children based on type
  const formatDisplayValue = (value) => {
    if (!value) return null // Handle null or undefined values

    switch (fieldProp?.['@_Type']) {
      case 'Edm.String':
        return value.toString() // For strings, ensure it's displayed as text
      case 'Edm.Int32':
        return parseInt(value, 10).toLocaleString() // Format integers with commas
      case 'Edm.DateTimeOffset':
        return dayjs(value).format(FORMAT_DATETIME) // Format date using Day.js
      case 'Edm.Boolean':
        return value ? 'Yes' : 'No' // Custom display for booleans
      default:
        return value // Default: return as-is
    }
  }
  const renderControl = () => {
    switch (fieldProp?.['@_Type']) {
      case 'Edm.String':
        return <TextArea />
      case 'Edm.Int32':
        return <InputNumber />
      case 'Edm.Decimal':
        return <InputNumber />
      case 'Edm.DateTimeOffset':
        return (
          <DatePicker
            format={FORMAT_DATETIME}
            showTime={{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }}
          />
        )
      default:
        return <TextArea />
    }
  }
  // console.log('abcde', {
  //   editing,
  //   dataIndex,
  //   fieldProp,
  //   title,
  //   inputType,
  //   record,
  //   index,
  //   children,
  //   ...restProps
  // })
  // console.log('EditableCell children:', children)
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          // name={[record.key, dataIndex]} // Use a unique field name for each cell
          name={dataIndex}
          style={{
            margin: 0
          }}
          // rules={[
          //   {
          //     required: true,
          //     message: `Please Input ${title}!`
          //   }
          // ]}
        >
          {renderControl()}
        </Form.Item>
      ) : (
        formatDisplayValue(children[1])
      )}
    </td>
  )
}

EditableCellComponent.propTypes = propTypes

export default EditableCellComponent
