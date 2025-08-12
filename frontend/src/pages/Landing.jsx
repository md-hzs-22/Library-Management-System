import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    // Hide scrollbars when Landing is mounted
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
  return (
    <div
      className="landing-page"
      style={{
        marginTop: '5vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent' // ✅ Removed the strip overlay
      }}
    >
      <div
        className="landing-content"
        style={{
          background: 'rgba(255,255,255,0.95)', // ✅ White box remains
          borderRadius: 20,
          padding: 40,
          boxShadow: '0 4px 32px #0002',
          maxWidth: 600,
          textAlign: 'center'
        }}
      >
        <h1 style={{ color: '#27855e', marginBottom: 16 }}>
          Welcome to the Library Management System
        </h1>
        <p style={{ fontSize: 18, marginBottom: 24 }}>
          Our library system offers a seamless experience for managing books,
          borrowing, and returns.
          <br />
          <br />
          <b>Services Provided:</b>
          <ul
            style={{
              textAlign: 'left',
              margin: '16px auto',
              marginBottom: 24,
              maxWidth: 400,
              fontSize: 16
            }}
          >
            <li>View all available books in the library, complete with details like title, author, and availability status.</li>
            <li>Search for books quickly using keywords such as title, author name, or ISBN for precise results.</li>
            <li>Simple user friendly interface to add new books to the collection. Also handles database</li>
            <li>Borrow books through a streamlined process, along with tracking for each borrowing transaction.</li>
            <li>Return borrowed books easily, with the system automatically updating availability and user records.</li>
            <li>Access a complete list of borrowing records.</li>
            <li>Enjoy a modern, user-friendly interface designed for easy navigation and efficient library management.</li>

          </ul>
        </p>
        <button
          className="btn"
          style={{ fontSize: 18, padding: '12px 32px', marginTop: 16 }}
          onClick={() => navigate('/ui')}
        >
          User Interface
        </button>
      </div>
    </div>
  );
}
