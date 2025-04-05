import React, { useState, ChangeEvent, useEffect } from 'react';
import { initializeSocket, sendMessage } from '../../../postgres-wrapper/assets/js/socket';
import { useProfileContext } from '../components/ProfileContext';
import { useParams } from 'react-router-dom';

interface Message {
  from_user: string;
  body: string;
  to_user: string;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { profileInfo } = useProfileContext();
  const {to_user} = useParams<{ to_user: string}>();
  useEffect(() => {
    const initialize = async () => {
      if (!profileInfo?.userName || !to_user) {
        console.error("Profile info is not available. Cannot initialize socket.");
        return;
      }
  
      try {
        const channel = await initializeSocket(profileInfo.userName, to_user);
        setIsSocketInitialized(true);
  
        if (channel) {
          // Listen for 'shout' events
          channel.on("new_message", (payload: Message) => {
            console.log("Received message:", payload);
            setMessages((prevMessages) => [...prevMessages, payload]);
          });
        }
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };
  
    initialize();
  }, [profileInfo, to_user]);
  const handleSendMessage = async (): Promise<void> => {
    if (!isSocketInitialized || !to_user) {
      console.error("Socket is not initialized. Cannot send message.");
      return;
    }

    try {
      await sendMessage(message, to_user);
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
              <strong>{msg.from_user}</strong>: {msg.body} <em>({msg.to_user})</em>
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