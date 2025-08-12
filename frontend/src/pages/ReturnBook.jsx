import React, { useState, useEffect } from 'react';

export default function ReturnBook() {
  const [borrowId, setBorrowId] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleReturn(e) {
    e.preventDefault();
    setMessage('');
    setSuccess(false);
    try {
      const res = await fetch(`http://localhost:8080/api/borrow/${borrowId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        setMessage('Book returned successfully!');
        setSuccess(true);
      } else {
        const err = await res.text();
        setMessage('Error: ' + err);
        setSuccess(false);
      }
    } catch (e) {
      setMessage('Error: ' + e.message);
      setSuccess(false);
    }
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="blur-bg"></div>
      <div className="content-box">
        {message && (
          <div style={{
            margin: '16px auto',
            maxWidth: 600,
            background: success ? '#b9fbc0' : '#ffe0e0',
            color: '#1a202c',
            padding: '10px 16px',
            borderRadius: 6,
            fontWeight: 500,
            textAlign: 'center',
            transition: 'opacity 0.3s',
          }}>{message}</div>
        )}
        <div className="card">
          <h2 style={{color:'#1a202c', marginLeft:'25vh'}}>Return Book</h2>
          <form onSubmit={handleReturn}>
            <div className="form-row">
              <label>Borrow ID<br/><input type="number" value={borrowId} onChange={e => setBorrowId(e.target.value)} required style={{width:'100%'}} placeholder="Enter the Borrow ID from Records page" /></label>
            </div>
            <div><button className="btn" type="submit" style={{marginLeft:'25vh'}}>Return Book</button></div>
          </form>
        </div>
      </div>
    </div>
  );
}
