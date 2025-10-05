const { contextBridge, ipcRenderer } = require('electron')

// Renderer 프로세스에 안전하게 API 노출
contextBridge.exposeInMainWorld('electronAPI', {
  // 채팅 연결
  connectChat: (streamerId, prefix) => 
    ipcRenderer.invoke('connect-chat', { streamerId, prefix }),
  
  // 채팅 연결 해제
  disconnectChat: () => 
    ipcRenderer.invoke('disconnect-chat'),
  
  // 연결 상태 확인
  getConnectionStatus: () => 
    ipcRenderer.invoke('get-connection-status'),
  
  // 연결 상태 변경 리스너
  onConnectionStatus: (callback) => {
    ipcRenderer.on('connection-status', (event, data) => callback(data))
  },
  
  // 신청곡 수신 리스너
  onNewSongRequest: (callback) => {
    ipcRenderer.on('new-song-request', (event, data) => callback(data))
  },
  
  // 리스너 제거
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  }
})
