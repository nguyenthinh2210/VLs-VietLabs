import React from 'react'
import { Dropdown, Space } from 'antd'
import config from '../config'
import { useTranslation } from 'react-i18next'
import localIcon from '../../assets/local-flag.png'
import enIcon from '../../assets/en-flag.png'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  console.log(i18n)

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('i18nextLng', lng) // Lưu vào localStorage để giữ ngôn ngữ khi reload
  }

  const languageLabels = {
    en: 'English',
    local: config.LOCAL_LANGUAGE_LABEL
  }

  const items = [
    {
      key: 'en',
      label: (
        <span className="d-flex gap-2" onClick={() => changeLanguage('en')}>
          <img width={16} src={enIcon} />
          {languageLabels.en}
        </span>
      )
    },
    {
      key: 'local',
      label: (
        <span className="d-flex gap-2" onClick={() => changeLanguage('local')}>
          <img width={16} src={localIcon} />
          {languageLabels.local}
        </span>
      )
    }
  ]

  return (
    <div>
      <Dropdown
        className="p-1 px-3 border border-primary rounded cursor-pointer"
        menu={{ items }}
        placement="bottomRight"
        trigger={['click']}>
        <Space style={{ cursor: 'pointer' }}>
          <img width={16} src={i18n.language === 'en' ? enIcon : localIcon} />
          Tiếng Việt
        </Space>
      </Dropdown>
    </div>
  )
}

export default LanguageSwitcher
