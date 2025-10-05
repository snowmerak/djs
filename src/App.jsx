import React from 'react'
import './App.css'

function App() {
  const [streamerId, setStreamerId] = React.useState('')
  const [prefix, setPrefix] = React.useState('!신청')
  const [isConnected, setIsConnected] = React.useState(false)
  const [connectionMessage, setConnectionMessage] = React.useState('')
  const [songRequests, setSongRequests] = React.useState([])
  const [showSettings, setShowSettings] = React.useState(true)

  React.useEffect(() => {
    // Electron API 존재 확인
    if (!window.electronAPI) {
      console.error('Electron API not available')
      return
    }

    // 연결 상태 리스너
    window.electronAPI.onConnectionStatus((data) => {
      setConnectionMessage(data.message)
      
      if (data.status === 'connected' || data.status === 'entered') {
        setIsConnected(true)
      } else if (data.status === 'disconnected' || data.status === 'error') {
        setIsConnected(false)
      }
    })

    // 신청곡 리스너
    window.electronAPI.onNewSongRequest((data) => {
      setSongRequests(prev => [...prev, data])
    })

    return () => {
      window.electronAPI.removeAllListeners('connection-status')
      window.electronAPI.removeAllListeners('new-song-request')
    }
  }, [])

  const handleConnect = async () => {
    if (!streamerId.trim()) {
      alert('스트리머 ID를 입력해주세요')
      return
    }
    if (!prefix.trim()) {
      alert('신청곡 prefix를 입력해주세요')
      return
    }

    try {
      await window.electronAPI.connectChat(streamerId.trim(), prefix.trim())
      setShowSettings(false)
    } catch (error) {
      alert(`연결 실패: ${error.message}`)
    }
  }

  const handleDisconnect = async () => {
    try {
      await window.electronAPI.disconnectChat()
      setIsConnected(false)
    } catch (error) {
      alert(`연결 해제 실패: ${error.message}`)
    }
  }

  const handleClearList = () => {
    if (confirm('신청곡 목록을 초기화하시겠습니까?')) {
      setSongRequests([])
    }
  }

  const handleRemoveRequest = (index) => {
    setSongRequests(prev => prev.filter((_, i) => i !== index))
  }

  const handleCopyList = () => {
    const text = songRequests
      .map((req, idx) => `${idx + 1}. [${req.timestamp}] ${req.username}: ${req.songRequest}`)
      .join('\n')
    
    navigator.clipboard.writeText(text)
      .then(() => alert('목록이 클립보드에 복사되었습니다'))
      .catch(err => alert('복사 실패: ' + err.message))
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎵 SOOP DJ Helper</h1>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● 연결됨' : '○ 연결 안됨'}
          </span>
          {connectionMessage && <span className="status-message">{connectionMessage}</span>}
        </div>
      </header>

      <main className="main-content">
        {showSettings ? (
          <div className="settings-panel">
            <h2>⚙️ 설정</h2>
            <div className="form-group">
              <label htmlFor="streamerId">스트리머 ID</label>
              <input
                type="text"
                id="streamerId"
                value={streamerId}
                onChange={(e) => setStreamerId(e.target.value)}
                placeholder="예: beststreamer"
                disabled={isConnected}
              />
            </div>
            <div className="form-group">
              <label htmlFor="prefix">신청곡 Prefix</label>
              <input
                type="text"
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="예: !신청"
                disabled={isConnected}
              />
            </div>
            <div className="button-group">
              {!isConnected ? (
                <button className="btn btn-primary" onClick={handleConnect}>
                  연결하기
                </button>
              ) : (
                <>
                  <button className="btn btn-secondary" onClick={() => setShowSettings(false)}>
                    신청곡 목록 보기
                  </button>
                  <button className="btn btn-danger" onClick={handleDisconnect}>
                    연결 해제
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="requests-panel">
            <div className="panel-header">
              <h2>📋 신청곡 목록 ({songRequests.length})</h2>
              <div className="button-group">
                <button className="btn btn-secondary" onClick={() => setShowSettings(true)}>
                  ⚙️ 설정
                </button>
                <button className="btn btn-info" onClick={handleCopyList} disabled={songRequests.length === 0}>
                  📋 복사
                </button>
                <button className="btn btn-warning" onClick={handleClearList} disabled={songRequests.length === 0}>
                  🗑️ 초기화
                </button>
              </div>
            </div>

            {songRequests.length === 0 ? (
              <div className="empty-state">
                <p>아직 신청곡이 없습니다</p>
                <p className="empty-hint">&quot;{prefix}&quot;로 시작하는 채팅이 수집됩니다</p>
              </div>
            ) : (
              <div className="requests-list">
                <table className="requests-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>시간</th>
                      <th>유저명</th>
                      <th>신청곡</th>
                      <th>전체 메시지</th>
                      <th>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {songRequests.map((request, index) => (
                      <tr key={`${request.timestamp}-${request.userId}-${index}`}>
                        <td>{index + 1}</td>
                        <td className="timestamp">{new Date(request.timestamp).toLocaleTimeString('ko-KR')}</td>
                        <td className="username">{request.username}</td>
                        <td className="song-title">{request.songRequest}</td>
                        <td className="full-comment">{request.comment}</td>
                        <td>
                          <button 
                            className="btn-remove" 
                            onClick={() => handleRemoveRequest(index)}
                            title="삭제"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>SOOP DJ Helper v1.0 - 스트리머를 위한 신청곡 관리 도구</p>
      </footer>
    </div>
  )
}

export default App
