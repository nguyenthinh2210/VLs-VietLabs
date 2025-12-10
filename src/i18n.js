import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend'
import config from './common/config'

i18n
  .use(HttpApi) // Dùng backend để load file JSON
  .use(I18nextBrowserLanguageDetector) // Phát hiện ngôn ngữ tự động
  .use(initReactI18next) // Kết nối với React
  .init({
    backend: {
      loadPath: `${config.HOME_PAGE}locales/{{lng}}/translation.json` // Đường dẫn file JSON
    },
    supportedLngs: ['local', 'en'],
    fallbackLng: 'local',
    detection: {
      order: ['localStorage'], // Thứ tự phát hiện ngôn ngữ
      caches: ['localStorage'] // Lưu ngôn ngữ vào localStorage
    },
    interpolation: {
      escapeValue: false // Không escape ký tự đặc biệt
    }
  })

export default i18n
