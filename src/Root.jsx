import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import App from './App.jsx'

// Chakra UI 테마 커스터마이징
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#f5e9ff',
      100: '#dac1ff',
      200: '#bf99ff',
      300: '#a571ff',
      400: '#8a49ff',
      500: '#7030e6',
      600: '#5724b4',
      700: '#3e1882',
      800: '#260d50',
      900: '#0e0120',
    },
  },
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', sans-serif`,
    body: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Malgun Gothic', sans-serif`,
  },
})

function Root() {
  return (
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  )
}

export default Root
