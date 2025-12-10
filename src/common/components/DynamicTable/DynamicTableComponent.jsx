import React, { useEffect, useMemo, useState } from 'react'
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd'
import PropTypes from '../../PropTypes'
import EditableCellComponent from './EditableCellComponent'
import { patchMultiRecordDetails } from '../../services'
import lists from '../../lists'
import { handleError } from '../../helpers'
import dayjs from '../../dayjs'
import { useUI } from '../../UIProvider'
import _ from 'lodash'
import { useLocation, useNavigate } from 'react-router-dom'

const propTypes = {
  canNavigateToDetailPage: PropTypes.bool,
  handleRefreshData: PropTypes.func,
  isEditableTable: PropTypes.bool,
  tableColumns: PropTypes.array.isRequired,
  tableDataSource: PropTypes.array.isRequired,
  tableMetadataEntity: PropTypes.object,
  tablePrimaryKeyName: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired
}

const DynamicTableComponent = ({
  canNavigateToDetailPage,
  handleRefreshData,
  isEditableTable,
  tableColumns,
  tableDataSource,
  tableMetadataEntity,
  tablePrimaryKeyName,
  tableName
}) => {
  //hooks
  const [form] = Form.useForm()
  const ui = useUI()
  const navigate = useNavigate()
  const location = useLocation()
  //state
  const [metaEntityProperties, setMetaEntityProperties] = useState([])
  const [dataSource, setDataSource] = useState(tableDataSource)
  const [formMode, setFormMode] = useState('') // State to track form mode ('add' or 'edit')
  //others
  const [editingKey, setEditingKey] = useState('')
  const isEditing = (record) => record.key === editingKey

  // Update states when `tableMetadataEntity` changes
  useEffect(() => {
    if (tableMetadataEntity) {
      setMetaEntityProperties(tableMetadataEntity?.Property || [])
    }
  }, [tableMetadataEntity])
  useEffect(() => {
    if (!_.isEqual(dataSource, tableDataSource)) {
      console.log('refresh table datasource', tableDataSource)
      setDataSource(tableDataSource)
      setEditingKey('')
    }
  }, [tableDataSource])

  // Add a new row to the table
  const addRow = () => {
    // Check if there's already a row in editing mode
    if (editingKey) {
      ui.showWarning('Please save or cancel the current edit before adding a new row.') // Optionally show a warning
      return
    }

    const newRow = { key: `new_${Date.now()}` } // Generate a unique key

    // Populate newRow with default values based on metaEntityProperties
    metaEntityProperties.forEach((property) => {
      const fieldName = property['@_Name']
      const fieldType = property['@_Type']
      let defaultValue = null
      if (fieldType === 'Edm.Int32' || fieldType === 'Edm.Decimal') {
        defaultValue = 0
      } else if (fieldType === 'Edm.Boolean') {
        defaultValue = false
      } else if (fieldType === 'Edm.DateTimeOffset') {
        defaultValue = null
      }
      newRow[fieldName] = defaultValue
    })
    console.log('newRw: ', newRow)
    // Add the new row to the data source
    setDataSource((prev) => [...prev, newRow])

    // Set the new row in edit mode
    setEditingKey(newRow.key)
    setFormMode('add') // Set form mode to 'add'

    // Initialize form values for the new row
    form.setFieldsValue(newRow)
  }

  const edit = (record) => {
    console.log(record)
    const processedRecord = {}

    // Ensure you're using the correct metadata array (e.g., metaEntityProperties)
    for (let index = 0; index < metaEntityProperties.length; index++) {
      const property = metaEntityProperties[index]
      const fieldName = property['@_Name']
      const fieldType = property['@_Type']

      if (fieldType === 'Edm.DateTimeOffset') {
        // Use dayjs to format DateTimeOffset fields
        processedRecord[fieldName] = record[fieldName] ? dayjs(record[fieldName]) : null
      } else if (fieldType === 'Edm.Boolean') {
        // Ensure booleans are correctly formatted
        processedRecord[fieldName] = Boolean(record[fieldName])
      } else {
        // For other types, keep the original value
        processedRecord[fieldName] = record[fieldName]
      }
    }

    console.log('Processed Record:', processedRecord)
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...processedRecord
    })
    setEditingKey(record.key)
    setFormMode('edit') // Set form mode to 'edit'
  }

  const cancel = (record) => {
    console.log('record cacelling', record)
    if (typeof record.key === 'string' && record?.key?.startsWith('new_')) {
      setDataSource((prev) => prev.filter((item) => item.key !== record.key))
    }
    setEditingKey('')
    setFormMode('') // Reset form mode
  }
  const save = async (key) => {
    try {
      const updatedRow = await form.validateFields()
      console.log(updatedRow)

      //const updatedRow = await form.getFieldsValue()
      let processedRecord = {}
      for (let index = 0; index < metaEntityProperties.length; index++) {
        const property = metaEntityProperties[index]
        const fieldName = property['@_Name']
        const fieldType = property['@_Type']

        // Ensure the primary key is included in the processed record
        if (fieldName === tablePrimaryKeyName) {
          if (formMode === 'add') {
            continue
          } else {
            processedRecord[fieldName] =
              updatedRow[fieldName] || tableDataSource.find((item) => item.key === key)?.[fieldName]
            continue
          }
        }

        // Skip writing 'lu_updated' if it is null
        if (fieldName === 'lu_updated') {
          continue
        }

        if (fieldType === 'Edm.DateTimeOffset') {
          // Use dayjs to format DateTimeOffset fields
          processedRecord[fieldName] = updatedRow[fieldName]
            ? dayjs(updatedRow[fieldName]).format()
            : null
        } else if (fieldType === 'Edm.Boolean') {
          // Ensure booleans are correctly formatted
          processedRecord[fieldName] = Boolean(updatedRow[fieldName])
        } else {
          // For other types, keep the original value
          processedRecord[fieldName] = updatedRow[fieldName]
        }
      }
      console.log('Processed Record:', [processedRecord])
      try {
        await patchMultiRecordDetails(lists?.[tableName].listName, [processedRecord])
        setEditingKey('') // Exit editing mode
        handleRefreshData()
        ui.notiSuccess('Thành công')
      } catch (error) {
        handleError(error)
        ui.notiError('Thất bại')
      }
    } catch (errInfo) {
      console.error('Validation Failed:', errInfo)
    }
  }

  const navigateToDetailPage = (record) => {
    const column = lists[tableName].detailPageUrlParam || lists[tableName].primaryKeyName // console.log(record?.invoice_no_)

    navigate(`${location.pathname}/${record[column]}`)
  }

  // Filter columns to only include those that are not hidden
  const displayColumns = tableColumns.filter(
    (column) => column?.col_hidden === false || column?.col_hidden == null
  )

  const mergedColumns = [
    ...displayColumns,
    isEditableTable && {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            {canNavigateToDetailPage && (
              <Typography.Link
                onClick={() => {
                  navigateToDetailPage(record)
                }}>
                {' '}
                See Detail{' '}
              </Typography.Link>
            )}
          </>
        )
      },
      fixed: 'right'
    }
  ].filter(Boolean) // Filter out false values
  const totalWidth = mergedColumns.reduce((sum) => sum + 170, 0)

  return (
    <Form form={form} component={false}>
      <div className=""> Priamry key: {tablePrimaryKeyName}</div>
      <Table
        className="custom-table"
        components={{
          body: {
            cell: EditableCellComponent //editingKey ? EditableCellComponent : null
          }
        }}
        bordered
        dataSource={tableDataSource}
        // rowHoverable={false}
        rowHoverable={false}
        // tableLayout="fixed"
        scroll={{
          x: totalWidth,
          y: 50 * 11
          // y: 'max-content'
          // y: 300
        }}
        // columns={mergedColumns}
        columns={mergedColumns.map((col) => {
          if (!col.editable) {
            return {
              ...col,
              width: '200px',
              onCell: () => ({}) // Optional cell customization
            }
          }
          return {
            ...col,

            onCell: (record) => ({
              record,
              inputType: col.dataIndex === 'age' ? 'number' : 'text',
              dataIndex: col.dataIndex,
              title: col.title,
              // width: '100px', // Set a fixed width for non-editable columns
              editing: isEditing(record),
              fieldProp: tableMetadataEntity?.Property.find((prop) => prop['@_Name'] == col.title)
            })
          }
        })}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  )
}

DynamicTableComponent.propTypes = propTypes

export default DynamicTableComponent
