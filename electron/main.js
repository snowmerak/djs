const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { SoopChatEvent, SoopClient } = require('soop-extension')

let mainWindow
let soopChat = null
let isConnected = false
let reconnectTimer = null
let currentConfig = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // Webpack으로 빌드된 파일 로드
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  
  // 개발 환경에서만 DevTools 자동 열기 (패키징된 앱에서는 열지 않음)
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    disconnectChat()
    app.quit()
  }
})

// 채팅 연결 함수
async function connectChat(streamerId, prefix) {
  try {
    if (soopChat) {
      await disconnectChat()
    }

    currentConfig = { streamerId, prefix }
    const client = new SoopClient()

    soopChat = client.chat({
      streamerId: streamerId
    })

    // 연결 성공
    soopChat.on(SoopChatEvent.CONNECT, response => {
      isConnected = true
      mainWindow.webContents.send('connection-status', {
        status: 'connected',
        message: `${streamerId} 채팅방에 연결됨`,
        timestamp: response.receivedTime
      })
    })

    // 채팅방 입장
    soopChat.on(SoopChatEvent.ENTER_CHAT_ROOM, response => {
      mainWindow.webContents.send('connection-status', {
        status: 'entered',
        message: '채팅방 입장 완료',
        timestamp: response.receivedTime
      })
    })

    // 일반 채팅 수신
    soopChat.on(SoopChatEvent.CHAT, response => {
      // prefix로 시작하는 채팅만 필터링
      if (response.comment && response.comment.startsWith(prefix)) {
        mainWindow.webContents.send('new-song-request', {
          timestamp: response.receivedTime,
          username: response.username,
          userId: response.userId,
          comment: response.comment,
          songRequest: response.comment.substring(prefix.length).trim()
        })
      }
    })

    // 방송 종료
    soopChat.on(SoopChatEvent.DISCONNECT, response => {
      isConnected = false
      mainWindow.webContents.send('connection-status', {
        status: 'disconnected',
        message: '방송이 종료되었습니다',
        timestamp: response.receivedTime
      })
      // 재연결 시도
      attemptReconnect()
    })

    // 채팅 연결
    await soopChat.connect()

  } catch (error) {
    isConnected = false
    mainWindow.webContents.send('connection-status', {
      status: 'error',
      message: `연결 오류: ${error.message}`,
      timestamp: new Date().toISOString()
    })
    // 재연결 시도
    attemptReconnect()
  }
}

// 채팅 연결 해제
async function disconnectChat() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  if (soopChat) {
    try {
      // soop-extension에 명시적인 disconnect 메서드가 있다면 호출
      soopChat = null
      isConnected = false
      currentConfig = null
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }
}

// 재연결 시도
function attemptReconnect() {
  if (!currentConfig || reconnectTimer) return

  mainWindow.webContents.send('connection-status', {
    status: 'reconnecting',
    message: '5초 후 재연결 시도...',
    timestamp: new Date().toISOString()
  })

  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null
    if (currentConfig) {
      await connectChat(currentConfig.streamerId, currentConfig.prefix)
    }
  }, 5000)
}

// IPC 핸들러
ipcMain.handle('connect-chat', async (event, { streamerId, prefix }) => {
  await connectChat(streamerId, prefix)
  return { success: true }
})

ipcMain.handle('disconnect-chat', async () => {
  await disconnectChat()
  mainWindow.webContents.send('connection-status', {
    status: 'disconnected',
    message: '연결 해제됨',
    timestamp: new Date().toISOString()
  })
  return { success: true }
})

ipcMain.handle('get-connection-status', () => {
  return { isConnected }
})
