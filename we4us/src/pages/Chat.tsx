import React, { useState, ChangeEvent, useEffect } from 'react';
import { initializeSocket, sendMessage } from '../../../postgres-wrapper/assets/js/socket';
import { useProfileContext } from '../components/ProfileContext';

interface Message {
  name: string;
  message: string;
  inserted_at: string;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { profileInfo } = useProfileContext();
  useEffect(() => {
    const initialize = async () => {
      if (!profileInfo?.userName) {
        console.error("Profile info is not available. Cannot initialize socket.");
        return;
      }
  
      try {
        const channel = await initializeSocket(profileInfo.userName);
        setIsSocketInitialized(true);
  
        if (channel) {
          // Listen for 'shout' events
          channel.on("shout", (payload: Message) => {
            console.log("Received message:", payload);
            setMessages((prevMessages) => [...prevMessages, payload]);
          });
        }
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };
  
    initialize();
  }, [profileInfo]);
  const handleSendMessage = async (): Promise<void> => {
    if (!isSocketInitialized) {
      console.error("Socket is not initialized. Cannot send message.");
      return;
    }

    try {
      await sendMessage(message);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setMessage(e.target.value);
  };

  return (
    <div>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.name}</strong>: {msg.message} <em>({msg.inserted_at})</em>
            </li>
          ))}
        </ul>
      </div>

      <input
        type="text"
        value={message}
        onChange={handleChange}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;