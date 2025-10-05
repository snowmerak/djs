# SOOP DJ Helper

SOOP(구 아프리카TV) 스트리머를 위한 신청곡 관리 데스크톱 애플리케이션입니다.

## 기능

- 🎵 **실시간 신청곡 수집**: 특정 prefix로 시작하는 채팅을 자동으로 수집
- ⏰ **타임스탬프 정렬**: 신청 시간 순으로 정렬된 목록 제공
- 👤 **유저 정보 표시**: 신청자 이름과 채팅 내용 표시
- 🔄 **자동 재연결**: 연결이 끊어지면 자동으로 재연결 시도
- 📋 **목록 관리**: 복사, 삭제, 초기화 기능
- 💻 **데스크톱 앱**: Electron 기반 크로스 플랫폼 지원

## 기술 스택

- **Electron** - 데스크톱 애플리케이션 프레임워크
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **soop-extension** - SOOP 채팅 연동 라이브러리

## 시작하기

### 의존성 설치

```powershell
npm install
```

### 개발 모드 실행

```powershell
npm run electron:dev
```

- Vite 개발 서버와 Electron이 동시에 실행됩니다
- 핫 리로드가 적용되어 코드 수정 시 자동으로 반영됩니다

### 프로덕션 빌드

```powershell
npm run electron:build
```

- Windows, macOS, Linux용 설치 파일이 `release/` 폴더에 생성됩니다

## 사용 방법

1. **스트리머 ID 입력**: SOOP 채널의 스트리머 ID를 입력합니다
2. **Prefix 설정**: 신청곡으로 인식할 prefix를 입력합니다 (예: `!신청`, `!song`)
3. **연결하기**: 버튼을 클릭하여 채팅방에 연결합니다
4. **신청곡 확인**: prefix로 시작하는 채팅이 실시간으로 수집됩니다
5. **목록 관리**: 복사, 개별 삭제, 전체 초기화 등의 기능을 사용합니다

## 프로젝트 구조

```
├── electron/           # Electron 메인 프로세스
│   ├── main.js        # 메인 프로세스 (SOOP 채팅 연동)
│   └── preload.js     # Preload 스크립트 (IPC 브릿지)
├── src/               # React 앱 (렌더러 프로세스)
│   ├── App.jsx        # 메인 컴포넌트
│   ├── App.css        # 스타일
│   ├── main.jsx       # React 진입점
│   └── index.css      # 글로벌 스타일
├── public/            # 정적 파일
├── dist/              # 빌드된 React 앱
├── release/           # 빌드된 Electron 앱
└── package.json       # 프로젝트 설정
```

## 개발 명령어

```powershell
# Vite 개발 서버만 실행
npm run dev

# Electron만 실행 (개발 모드)
npm run electron

# Vite + Electron 동시 실행 (권장)
npm run electron:dev

# React 앱 빌드
npm run build

# Electron 앱 빌드 및 패키징
npm run electron:build

# 코드 린팅
npm run lint
```

## 주의사항

- SOOP 채팅 연결은 공개 방송 중인 채널에만 가능합니다
- 로그인 없이 연결하므로 채팅 송신 기능은 사용할 수 없습니다
- 방송이 종료되면 자동으로 연결이 해제되며, 5초 후 재연결을 시도합니다

## 라이선스

MIT License
