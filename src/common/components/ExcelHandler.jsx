import React, { useState } from 'react'
import { Button, Upload, message } from 'antd'
import { utils, writeFile, read } from 'xlsx'
import PropTypes from 'prop-types'
import { UploadOutlined } from '@ant-design/icons'
import DynamicTableComponent from './DynamicTable/DynamicTableComponent'
import { generateTableColumns, generateTableDataSoruce } from '../../SI/helper'
import { patchMultiRecordDetails } from '../services'
import lists from '../lists'
import { useUI } from '../UIProvider'
import AsyncButton from './AsyncButton'
import COLOR from '../color'

export const DUPLICATE_ON_SYSTEM_INVALID_TYPE = 'DUPLICATE_ON_SYSTEM'
export const DUPLICATE_IN_FILE = 'DUPLICATE_IN_FILE'
export const EMPTY_TITLE = 'EMPTY_TITLE'
export const NO_EXIST_DATA = 'NO_EXIST_DATA'
export const DATA_NOT_VALID = 'DATA_NOT_VALID'
export const INVALID_TYPE = 'INVALID_TYPE'
export const INVALID_DATE = 'INVALID_DATE'
export const IS_AUXILIRAY_MACHINE = 'IS_AUXILIRAY_MACHINE'

const propTypes = {
  dataToExport: PropTypes.array.isRequired,
  dataTableName: PropTypes.string.isRequired,
  onImport: PropTypes.func,
  onSave: PropTypes.func
}

const ExcelHandler = ({ dataToExport, dataTableName, onImport, onSave, metadataEntity }) => {
  //hooks
  const ui = useUI()
  // State
  const [importedData, setImportedData] = useState(null)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const handleExport = () => {
    const ws = utils.json_to_sheet(dataToExport)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Data')
    writeFile(wb, 'exported_data.xlsx')
  }

  const validateData = (data) => {
    const errors = []
    const titles = new Set()

    // data.forEach((row, index) => {
    //   if (!row.title) {
    //     errors.push({ type: EMPTY_TITLE, row: index + 1 })
    //   }
    //   if (titles.has(row.title)) {
    //     errors.push({ type: DUPLICATE_IN_FILE, row: index + 1 })
    //   }
    //   titles.add(row.title)

    //   if (!row.date || isNaN(Date.parse(row.date))) {
    //     errors.push({ type: INVALID_DATE, row: index + 1 })
    //   }
    // })

    return errors
  }

  const handleImport = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = utils.sheet_to_json(worksheet)

      const errors = validateData(jsonData)
      if (errors.length > 0) {
        errors.forEach((error) => {
          message.error(`Error in row ${error.row}: ${error.type}`)
        })
      } else {
        setImportedData(jsonData)
        onImport(jsonData)
      }
    }
    reader.readAsArrayBuffer(file)
    return false // Prevent automatic upload
  }
  const handleSave = async (data) => {
    try {
      setIsLoadingSubmit(false)
      await patchMultiRecordDetails(dataTableName, data)
      setImportedData(null)
      ui.notiSuccess('Import thành công')
      onSave()
      setIsLoadingSubmit(true)
    } catch (error) {
      ui.notiError('Import thất bại')
    }
  }
  return (
    <div>
      <AsyncButton
        style={{
          backgroundColor: COLOR.lightgreen,
          color: COLOR.lime,
          borderColor: 'white'
        }}
        onClick={handleExport}>
        Export to Excel
      </AsyncButton>
      <Upload accept=".xlsx, .xls" beforeUpload={handleImport} showUploadList={false}>
        <Button
          style={{
            backgroundColor: COLOR.lime,
            color: 'white',
            borderColor: 'white'
          }}
          icon={<UploadOutlined />}>
          Import from Excel
        </Button>
      </Upload>
      {/* <AsyncButton
        style={{
          backgroundColor: COLOR.lime,
          color: 'white',
          borderColor: 'white'
        }}
        onClick={handleExport}>
        Nhập file
      </AsyncButton> */}
      {/* <Button onClick={handleExport}>Export to Excel</Button>
      <Upload accept=".xlsx, .xls" beforeUpload={handleImport} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Import from Excel</Button>
      </Upload> */}
      {importedData && (
        <Button loading={isLoadingSubmit} type="primary" onClick={() => handleSave(importedData)}>
          Save
        </Button>
      )}
      {importedData && (
        <DynamicTableComponent
          tableName={dataTableName}
          tableColumns={generateTableColumns(importedData)}
          isEditableTable={false}
          tableDataSource={generateTableDataSoruce(importedData)}></DynamicTableComponent>
      )}
    </div>
  )
}

ExcelHandler.propTypes = propTypes

export default ExcelHandler
