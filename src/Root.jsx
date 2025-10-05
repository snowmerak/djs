import React from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.jsx'
import { themes } from './themes'

// 기본 테마 생성 함수
const createTheme = (themeKey = 'purple') => {
  const selectedTheme = themes[themeKey]
  
  return extendTheme({
    config: {
      initialColorMode: selectedTheme.isDark ? 'dark' : 'light',
      useSystemColorMode: false,
    },
    colors: {
      brand: selectedTheme.colors.brand,
    },
    fonts: {
      heading: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', sans-serif`,
      body: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', sans-serif`,
    },
  })
}

function Root() {
  const [currentTheme, setCurrentTheme] = React.useState(() => {
    // localStorage에서 저장된 테마 불러오기
    return localStorage.getItem('djeve-theme') || 'purple'
  })

  const changeTheme = (themeKey) => {
    setCurrentTheme(themeKey)
    localStorage.setItem('djeve-theme', themeKey)
  }

  return (
    <ChakraProvider theme={createTheme(currentTheme)}>
      <App currentTheme={currentTheme} themes={themes} onThemeChange={changeTheme} />
    </ChakraProvider>
  )
}

export default Root
