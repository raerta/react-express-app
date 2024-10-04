import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import AiMessage from './components/AiMessage';
import UserMessage from './components/UserMessage';

interface IMessage {
  role: "system" | "user" | "assistant" | "function"  | "tool";
  content: string
}


function App() {
  axios.defaults.withCredentials = true;

  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const focusRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    startSession();
  }, []);

  const startSession = async () => {
 
    try {
     await axios.post('http://localhost:3000/api/session/start');  
      fetchQuestion();
    } catch (err) {
      console.error("Error starting session:", err);
    }
  };

  const fetchQuestion = async () => {
    try {

      const response = await axios.get('http://localhost:3000/api/session/question');
      
      if (response.data.question) {
  
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: response.data.question }]);
      } else {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("Error fetching question:", err);
    }
  };

  const handleAnswerSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/api/session/answer', { answer });
      setAnswer('');
      setMessages(prevMessages => [...prevMessages, { role: 'user', content: answer }]);
      await fetchQuestion();

      if (focusRef.current) {
        focusRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {   
      console.error("Error submitting answer:", err);
    }
  };  



  return (
    <>
    
    
    <div className="App">
      <div className='container'>
      <div className="chat-container">
        <div className="message-list">
        {messages.map((msg, index) =>  msg.role === "assistant" ? <AiMessage key={index}> {msg.content}</AiMessage>: <UserMessage key={index}>{msg.content}</UserMessage>)}
        <div ref={focusRef} style={{marginTop: "50px"}}></div>
        </div>

        {!isCompleted && (
          <form className="input-container" onSubmit={handleAnswerSubmit}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              placeholder="Type your answer..."
            />
            <button type="submit">Submit</button>
          </form>
        )}

        {isCompleted && <h2>Questions has end!</h2>}
      </div>
      </div>
      
    </div>
    </>
   
    
  );
}

export default App;
