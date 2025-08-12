import React, {useEffect, useState} from 'react'

export default function Home(){
  const [books, setBooks] = useState([])
  const [q, setQ] = useState('')

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  async function fetchBooks(){
    try{
      const url = q ? `http://localhost:8080/api/books/search?q=${encodeURIComponent(q)}` : 'http://localhost:8080/api/books'
      const res = await fetch(url)
      const data = await res.json()
      setBooks(data)
    }catch(e){
      console.error(e);
      setMessage('Could not load books (backend must be running).');
      setSuccess(false);
    }
  }

  useEffect(()=>{ fetchBooks() }, [q])

  async function deleteBook(id,available){
    if(!available) {
      setMessage('Cannot remove a book that is currently borrowed.');
      setSuccess(false);
      return;
    }

    if(!window.confirm(`Are you sure you want to permanently remove this book?`)) return;


    try{
      const res = await fetch(`http://localhost:8080/api/books/delete/${id}`, {method:'DELETE'})
      if(res.ok){
        setMessage('Book removed successfully!');
        setSuccess(true);
        fetchBooks();
      } else {
        const errText = await res.text();
        setMessage('Failed to remove book: ' + errText);
        setSuccess(false);
      }
    }catch(e){
      console.error(e);
      setMessage('Error removing book: ' + (e.message || e));
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
        <div className="content-box2">
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
          <div className="card" style={{minWidth: 600}}>
            <h2 className = "heading">Search Books</h2>
            <div className="search-row">
              <input placeholder="Search by title, author or ISBN" value={q} onChange={e=>setQ(e.target.value)} style={{flex:1, padding:8}}/>
              <button className="btn" onClick={fetchBooks}>Search</button>
            </div>
            <table className="table">
              <thead><tr><th>Title</th><th>Author</th><th>ISBN</th><th>Available</th><th>Status</th><th>Book ID</th><th>Remove Book</th></tr></thead>
              <tbody>
                  {[...books].sort((a, b) => {
                    if (!a.title && !b.title) return 0;
                    if (!a.title) return 1;
                    if (!b.title) return -1;
                    return a.title.localeCompare(b.title, undefined, {sensitivity:'base'});
                  }).map(b=>(
                  <tr key={b.id} className={!b.available ? 'overdue' : ''}>
                    
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.isbn}</td>
                    <td>{b.available ? 'Yes' : 'No'}</td>
                    <td>
                      {b.available ? (
                        <span style={{color: '#2e7d32', fontWeight: 500}}>Currently available</span>
                      ) : (
                        <span style={{color: '#c62828', fontWeight: 500}}>Currently borrowed</span>
                      )}
                    </td>
                    <td>{b.id}</td>
                    <td><button className="btn thirdary" onClick={()=>deleteBook(b.id, b.available)}>❌</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
}
