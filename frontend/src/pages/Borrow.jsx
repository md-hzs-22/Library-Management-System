import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function Borrow(){
  const [bookId, setBookId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  
  async function borrow(e){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Invalid email format');
      setSuccess(false);
      return;
    }

    e.preventDefault();
    try {
      // First, try to get the user by name and phone
      const searchRes = await fetch(`http://localhost:8080/api/users/search?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`);
      let user = null;
      if (searchRes.ok) {
        user = await searchRes.json();
      }
      
      // Now borrow the book
      const res = await fetch('http://localhost:8080/api/borrow/borrow', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({bookId: Number(bookId), userId: user.id})
      });
      console.log("Res : {}",res);
      let borrowData = null;
      const borrowContentType = res.headers.get('content-type');
      if (borrowContentType && borrowContentType.includes('application/json')) {
        borrowData = await res.json();
      } else {
        const borrowText = await res.text();
        setMessage('Failed: ' + borrowText);
        setSuccess(false);
        return;
      }
      if(res.ok && borrowData && !borrowData.error){
        setMessage('Borrow recorded');
        setSuccess(true);
        setBookId(''); setName(''); setEmail(''); setPhone('');
      } else {
        setMessage('Failed: ' + (borrowData && borrowData.error ? borrowData.error : 'Unknown error'));
        setSuccess(false);
      }
    } catch(e){
      console.error(e);
      setMessage('Error: ' + (e.message || e));
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
            <h2 className = "heading">Borrow Book</h2>
            <form onSubmit={borrow} >
              <div className="form-row"><label>Book ID<br/><input placeholder = "Enter Book ID" value={bookId} onChange={e=>setBookId(e.target.value)} required style={{width:'100%'}}/></label></div>
              <div className="form-row"><label>Name<br/><input placeholder = "Enter Fullname" value={name} onChange={e=>setName(e.target.value)} required style={{width:'100%'}}/></label></div>
              <div className="form-row"><label>Phone<br/><input placeholder = "Enter Valid Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} required style={{width:'100%'}}/></label></div>
              <div className="form-row"><label>Email<br/><input placeholder = "Enter Valid Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%'}}/></label></div>
              <div><button className="btn" type="submit" style={{marginLeft:'27vh'}} >Borrow</button></div>
            </form>
            <p className="muted"><small>Tip: get Book ID from the Home page table.</small></p>
          </div>
        </div>
      </div>
    )
}
