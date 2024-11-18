import React, { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import './App.css'
const host = "http://localhost:1337";

function App() {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [id, setId] = useState();

  const socketRef = useRef();
  const messagesEnd = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);
  
    socketRef.current.on('getId', data => {
      console.log(`getId ${data}`);
      setId(data);
    })

    socketRef.current.on('sendDataServer', receivedData => {
      console.log('sendDataServer');
      console.log(receivedData);
      setChat(oldChats => [...oldChats, receivedData.data]);
      scrollToBottom();
    })

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if(message !== null) {
      const msg = {
        content: message, 
        id: id
      }
      socketRef.current.emit('sendDataClient', msg);
      setMessage('');
    }
  }

  const scrollToBottom = () => {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }
  

  const renderChats = chat.map((m, index) => 
        <div key={index} className={`${m.id === id ? 'your-message' : 'other-people'} chat-item`}>
          {m.content}
        </div>
      );

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const onEnterPress = (e) => {
    if(e.keyCode == 13 && e.shiftKey == false) {
      sendMessage()
    }
  }

  return (
    <div class="box-chat">
      <div class="box-chat_message">
      {renderChats}
      <div style={{ float:"left", clear: "both" }} ref={messagesEnd}></div>
      </div>

      <div class="send-box">
          <textarea 
            value={message}  
            onKeyDown={onEnterPress}
            onChange={handleChange} 
            placeholder="Enter message ..." 
          />
          <button onClick={sendMessage}>
            Send
          </button>
      </div>

    </div>
  );
}

export default App;