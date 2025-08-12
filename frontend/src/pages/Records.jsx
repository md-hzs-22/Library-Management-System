import React, {useEffect, useState} from 'react'

export default function Records(){
  const [records, setRecords] = useState([])
  const [bookName, setBookName] = useState('');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  async function fetchRecords(){
    try{
      const res = await fetch('http://localhost:8080/api/borrow/records')
      const data = await res.json()
      setRecords(data)
    }catch(e){
      console.error(e);
      setMessage('Could not load records');
      setSuccess(false);
    }
  }
      
  useEffect(()=>{ fetchRecords() }, [])

  // The Mark Returned button uses BorrowRecord ID, and the backend robustly maps it to the correct Borrow entry.
  async function returnRec(id){
    try{
      const res = await fetch(`http://localhost:8080/api/borrow/${id}/return`, {method:'POST'})
      let data = null;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const errText = await res.text();
        setMessage('Failed to return: ' + errText);
        setSuccess(false);
        return;
      }
      if(res.ok && data && !data.error){
        setMessage('Book returned successfully!');
        setSuccess(true);
        fetchRecords();
      } else {
        setMessage('Failed to return: ' + (data && data.error ? data.error : 'Unknown error'));
        setSuccess(false);
      }
    }catch(e){
      console.error(e);
      setMessage('Error returning book: ' + (e.message || e));
      setSuccess(false);
    }
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Filter records by multiple fields
  const filteredRecords = records.filter(r => {
    const bookTitle = r.book?.title?.toLowerCase() || '';
    const user = r.user || {};
    const userNameVal = user.name?.toLowerCase() || '';
    const phoneVal = user.phone?.toLowerCase() || '';
    const emailVal = user.email?.toLowerCase() || '';

    return (
      (bookName === '' || bookTitle.includes(bookName.toLowerCase())) &&
      (userName === '' || userNameVal.includes(userName.toLowerCase())) &&
      (phone === '' || phoneVal.includes(phone.toLowerCase())) &&
      (email === '' || emailVal.includes(email.toLowerCase()))
    );
  });

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="blur-bg"></div>
        <div className="content-box2">
          {message && (
            <div style={{
              margin: '16px auto',
              width: '100%',
              background: success ? '#b9fbc0' : '#ffe0e0',
              color: '#1a202c',
              padding: '10px 16px',
              borderRadius: 6,
              fontWeight: 500,
              textAlign: 'center',
              transition: 'opacity 0.3s',
            }}>{message}</div>
          )}
          <div className="card2">
            <h2 className = "heading">Search Borrow Records</h2>
            <div className="search-row" style={{marginBottom: 12, display: 'flex', gap: 8}}>
              <input
                placeholder="Enter Book name"
                value={bookName}
                onChange={e => setBookName(e.target.value)}
                style={{padding:8, minWidth: 224}}
              />
              <input
                placeholder="Enter User name"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                style={{padding:8, minWidth: 224}}
              />
              <input
                placeholder="Enter Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{padding:8, minWidth: 224}}
              />
              <input
                placeholder="Enter Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{padding:8, minWidth: 224}}
              />
            </div>
            <table className="table">
              <thead><tr><th>Borrow ID</th><th>Book</th><th>Username</th><th>Phone</th><th>Email</th><th>Borrow Date</th><th>Return Date</th></tr></thead>
              <tbody>
                  {[...filteredRecords].sort((a, b) => {
                    const ta = a.book?.title || "";
                    const tb = b.book?.title || "";
                    return ta.localeCompare(tb, undefined, {sensitivity:'base'});
                  }).map(r=>(
                  <tr key={r.id} className={(r.returnDate==null && new Date(r.borrowDate) < new Date(Date.now() - 1000*60*60*24*14)) ? 'overdue' : ''}>
                    <td>{r.id}</td>
                    <td>{r.book?.title} (ID:{r.book?.id})</td>
                    <td>{r.user?.name}</td>
                    <td>{r.user?.phone}</td>
                    <td>{r.user?.email}</td>
                    <td>{new Date(r.borrowDate).toLocaleString()}</td>
                    <td>
  {r.returnDate ? new Date(r.returnDate).toLocaleString() : <button className="btn secondary" onClick={()=>returnRec(r.id)}>Mark Returned</button>}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
}
