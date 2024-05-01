// I would like to thank Claude-3-Haiko and 2 bots for helping me 

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';



const socket = io('http://localhost:3000');




export default function App() {

  const [products,setProducts] = useState({})
  const [received,setReceived] = useState([])

  function connectSocket(){
    socket.on("connection",(socket) => {
      console.log(socket)
    })
    
    socket.on('update', (data) => {
      setReceived(data);
    });
    
  }
  
  useEffect(()=>{
    connectSocket();
    
  },[])
  
  useEffect(() => {
    // Log the received data when it changes
    // this needs understanding 
    if (received) {
      console.log('received is', received);
    }

  }, [received]);

  function handleInput(event){

    let{name,value}=event.target
    console.log({[name]:value})
    let currentObj = {[name]:value}
    setProducts((prev)=>({...prev,...currentObj}))
  }


  function handleDelete(index){
    socket.emit("delete",index)

  }

  function sendProducts(){
    socket.emit("products",products)
    console.log(products)
  }

  return (
    
      <div className='page-container'>
        <div className='header-container'>
          <h1 className="title">Real-Time Products</h1>
          <div className="input-container">
            <input type="text" name="product" onChange={handleInput} className="input" placeholder="Product" maxLength={18}/>
            <input type="number" name="price" onChange={handleInput} className="input" placeholder="Price" />
          </div>
          <button onClick={sendProducts} className="button">Send</button>
        </div>
        <div className='cards-container'>
        {received.map((receivedItem, index) => (
          <div className="product-card" key={index}>
            <h3>{receivedItem?.product}</h3>
            <p>Price: ${receivedItem?.price}</p>
            <button className='red-button' onClick={()=>handleDelete(index)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
        </div>
      </div>
    
  );
}





