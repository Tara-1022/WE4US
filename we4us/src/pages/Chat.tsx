import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { useProfileContext } from '../components/ProfileContext';
import { useParams } from 'react-router-dom';
import { Socket, Channel } from "phoenix";

interface Message {
  id: string;
  from_user: string;
  to_user: string;
  body: string;
  inserted_at: string;
}

let socket: Socket | null = null;
let channel: Channel | null = null;
let socketInitialized: boolean = false;

export async function initializeSocket(sender: string, recipient: string): Promise<{channel: Channel | null, messages: Message[]}> {
  if (!sender || !recipient) {
    console.error("Username is undefined. Cannot initialize socket.");
    return { channel: null, messages: [] };
  }

  try {
    console.log("Using username as auth token:", sender);

    socket = new Socket("ws://localhost:4000/socket", { params: { token: sender } });
    socket.connect();
    console.log("Socket connection attempted");

    const topic = `message:${recipient}`;
    channel = socket.channel(topic, { user_id: sender });
    
    const joinResponse = await new Promise<{messages: Message[]}>((resolve, reject) => {
      channel!.join()
        .receive("ok", (response) => {
          console.log("Successfully joined the channel", response);
          socketInitialized = true;
          resolve(response);
        })
        .receive("error", (error: any) => {
          console.error("Failed to join the channel:", error);
          reject(error);
        });
    });

    return { channel, messages: joinResponse.messages || [] };
  } catch (error) {
    console.error("Error during socket initialization:", error);
    socketInitialized = false;
    return { channel: null, messages: [] };
  }
}

export async function sendMessage(message: string, recipient: string): Promise<void> {
  if (!socketInitialized || !channel) {
    console.error("Socket is not initialized. Call initializeSocket first.");
    return;
  }
  
  if (!message || !recipient) {
    console.error("Message or recipient is missing.");
    return;
  }

  try {
    console.log("Sending message:", message);
    await new Promise((resolve, reject) => {
      channel!
        .push("send_message", { body: message, to: recipient })
        .receive("ok", (response) => {
          console.log("Message sent successfully:", response);
          resolve(response);
        })
        .receive("error", (error: any) => {
          console.error("Message not sent:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { profileInfo } = useProfileContext();
  const { to_user } = useParams<{ to_user: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const initialize = async () => {
      if (!profileInfo?.userName || !to_user) {
        console.error("Profile info is not available. Cannot initialize socket.");
        return;
      }
  
      try {
        const { channel, messages: historicalMessages } = await initializeSocket(
          profileInfo.userName, 
          to_user
        );
        
        setIsSocketInitialized(true);
        
        // Set initial messages from history
        if (historicalMessages.length > 0) {
          setMessages(historicalMessages);
        }
  
        if (channel) {
          // Listen for new messages
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
    
    // Cleanup on unmount
    return () => {
      if (channel) {
        channel.leave();
      }
    };
  }, [profileInfo, to_user]);

  const handleSendMessage = async (): Promise<void> => {
    if (!isSocketInitialized || !to_user || !message.trim()) {
      return;
    }

    try {
      await sendMessage(message, to_user);
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const currentUser = profileInfo?.userName;

  return (

      <div className="flex flex-col h-screen text-blue-900 bg-gray-100">
        <div className="chat-header">
          <h2 className="text-blue-900">Chat with {to_user}</h2>
        </div>
    
        <div className="messages-container" >
          {messages.map((msg, index) => {
            const isOwnMessage = msg.from_user === currentUser;
            return (
              <div 
                key={msg.id || index} 
                className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
                style={{ borderRadius: '100px', backgroundColor:'black', padding: '10px', margin:'10px', width: 'fit-content',}}
              >
                {/* Add the sender name above the message */}
                <div className="message-sender" style={{ fontWeight: 'bold', display:'flex', color: isOwnMessage ? 'cyan' : 'green' , alignSelf: isOwnMessage ? 'flex-end' : 'flex-start'}}>
                  {isOwnMessage ? 'You' : msg.from_user}
                </div>
                <div className="message-content">
                  <p>{msg.body}</p>
                  <small className="message-time">
                    {new Date(msg.inserted_at).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
    
        <div className="message-input">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage} disabled={!message.trim()}>
            Send
          </button>
        </div>
      </div>
    );

};

export default Chat;