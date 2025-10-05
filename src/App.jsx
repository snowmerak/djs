import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

// 페이지 컴포넌트들
const Home = () => (
  <div className="page">
    <h1>홈페이지</h1>
    <p>React SPA 프로젝트에 오신 것을 환영합니다!</p>
    <p>이 앱은 Single Page Application으로 구성되어 있어 빠른 네비게이션을 제공합니다.</p>
  </div>
)

const About = () => (
  <div className="page">
    <h1>소개</h1>
    <p>이것은 React와 Vite로 만든 SPA 프로젝트입니다.</p>
    <ul>
      <li>React 18</li>
      <li>React Router Dom</li>
      <li>Vite 빌드 도구</li>
      <li>모던 CSS</li>
    </ul>
  </div>
)

const Contact = () => (
  <div className="page">
    <h1>연락처</h1>
    <p>문의사항이 있으시면 언제든지 연락주세요.</p>
    <div className="contact-info">
      <p>📧 이메일: contact@example.com</p>
      <p>📞 전화: 010-1234-5678</p>
      <p>📍 주소: 서울특별시 강남구</p>
    </div>
  </div>
)

const NotFound = () => (
  <div className="page">
    <h1>404 - 페이지를 찾을 수 없습니다</h1>
    <p>요청하신 페이지가 존재하지 않습니다.</p>
    <Link to="/" className="home-link">홈으로 돌아가기</Link>
  </div>
)

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">React SPA</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">홈</Link></li>
          <li><Link to="/about">소개</Link></li>
          <li><Link to="/contact">연락처</Link></li>
        </ul>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>&copy; 2025 React SPA Project. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App