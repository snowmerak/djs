# React SPA 프로젝트

React와 Vite로 만든 Single Page Application입니다.

## 기능

- ⚡ Vite를 사용한 빠른 개발 서버
- 🔄 React Router를 통한 클라이언트 사이드 라우팅
- 📱 반응형 디자인
- 🎨 모던 CSS 스타일링
- 🔧 ESLint를 통한 코드 품질 관리

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 프로덕션 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 배포

이 프로젝트는 SPA로 구성되어 있어 다음과 같은 정적 호스팅 서비스에 배포할 수 있습니다:

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

빌드 후 `dist` 폴더의 내용을 호스팅 서비스에 업로드하면 됩니다.

## 기술 스택

- **React 18** - UI 라이브러리
- **React Router Dom** - 클라이언트 사이드 라우팅
- **Vite** - 빌드 도구 및 개발 서버
- **ESLint** - 코드 품질 관리

## 라이선스

MIT License