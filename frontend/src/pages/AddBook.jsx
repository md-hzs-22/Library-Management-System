import React, {useState, useEffect} from 'react'

export default function AddBook(){
  const [title,setTitle]=useState('');
  const [author,setAuthor]=useState('');
  const [isbn,setIsbn]=useState('');
  const [quantity, setQuantity] = useState(1);

  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  async function submit(e){
    e.preventDefault();
    try{
      const res = await fetch('http://localhost:8080/api/books', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({title,author,isbn,quantity: Number(quantity)})
      })
      if(res.ok){
        const data = await res.json();
        const count = Array.isArray(data) ? data.length : 1;
        setMessage(`${count} book${count > 1 ? 's' : ''} added successfully!`);
        setSuccess(true);
        setTitle(''); setAuthor(''); setIsbn(''); setQuantity(1);
      }
      else {
        setMessage('Failed to add books');
        setSuccess(false);
      }
    }catch(e){
      console.error(e);
      setMessage('Error');
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
            <h2 className = "heading">Add Book</h2>
            <form onSubmit={submit}>
              <div className="form-row"><label>Title<br/><input placeholder = "Enter Full Book name" required value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%'}}/></label></div>
              <div className="form-row"><label>Author<br/><input placeholder = "Enter author's fullname" required value={author} onChange={e=>setAuthor(e.target.value)} style={{width:'100%'}}/></label></div>
              <div className="form-row"><label>Quantity<br/><input type="number" min="1" value={quantity} onChange={e=>setQuantity(e.target.value)} style={{width:'100%'}} required/></label></div>
              <div><button className="btn" type="submit" style={{marginLeft:'27vh'}}>Add Book</button></div>
            </form>
          </div>
        </div>
      </div>
    )
}
