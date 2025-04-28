import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { useProfileContext } from '../components/ProfileContext';
import { useParams } from 'react-router-dom';
import { Socket, Channel } from "phoenix";
import { Link } from 'react-router-dom';

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

const formatMessageDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  else {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
}

export async function initializeSocket(sender: string, recipient: string): Promise<{channel: Channel | null, messages: Message[]}> {
  console.log(sender, recipient)
  if (!sender || !recipient) {
    console.error("Username is undefined. Cannot initialize socket.");
    return { channel: null, messages: [] };
  }

  try {
    console.log("Using username as auth token:", sender);

    socket = new Socket("ws://localhost:4000/socket", { params: { token: sender } });
    socket.connect();
    console.log("Socket connection attempted");
    const users = [sender, recipient].sort();
    const topic = `message:${users.join("#")}`;
    channel = socket.channel(topic, { username: sender });
    
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

export async function sendMessage(message: string, recipient: string): Promise<Message | null> {
  if (!socketInitialized || !channel) {
    console.error("Socket is not initialized. Call initializeSocket first.");
    return null;
  }
  
  if (!message || !recipient) {
    console.error("Message or recipient is missing.");
    return null;
  }

  try {
    console.log("Sending message:", message);
    const response = await new Promise<Message>((resolve, reject) => {
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
    
    return response; // Return the message object
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
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
      if (!profileInfo?.username || !to_user) {
        console.error("Profile info is not available. Cannot initialize socket.");
        return;
      }
  
      try {
        const { channel, messages: historicalMessages } = await initializeSocket(
          profileInfo.username, 
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

  // Modify your handleSendMessage function
const handleSendMessage = async (): Promise<void> => {
  if (!isSocketInitialized || !to_user || !message.trim()) {
    return;
  }

  try {
    const messageText = message;
    
    // Send the message but don't add it to state
    // The channel.on("new_message") will handle adding it
    await sendMessage(messageText, to_user);
    
    // Clear the input field
    setMessage('');
  } catch (error) {
    console.error("Error sending message:", error);
    
    // Only add a fallback message if sending failed
    const fallbackMessage: Message = {
      id: `local-${Date.now()}`,
      from_user: currentUser || '',
      to_user: to_user || '',
      body: message,
      inserted_at: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, fallbackMessage]);
    setMessage('');
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
  
  const currentUser = profileInfo?.username;


    return (
      <div className="flex flex-col">
        <div className="flex justify-center sticky top-3.5 z-10">
          <h2 className="text-xl font-bold text-white">Chat with {to_user}</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">

      {(() => {
        let currentDate = '';
        let messageGroups: JSX.Element[] = [];
        
        messages.forEach((msg, index) => {
          const messageDate = new Date(msg.inserted_at);
          const dateString = formatMessageDate(messageDate);
          const isOwnMessage = msg.from_user === currentUser;
          

          if (dateString !== currentDate) {
            currentDate = dateString;
            messageGroups.push(
              <div key={`date-${dateString}-${index}`} className="flex justify-center my-4">
                <div className="text-white text-xl">
                  {dateString}
                </div>
              </div>
            );
          }
          
          // Add the message
          messageGroups.push(
            <div 
              key={msg.id || index} 
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
            >
              <div className="flex flex-col max-w-[70%]">
                <div className={`text-sm font-bold mb-1 ${isOwnMessage ? 'text-cyan-500 text-right' : 'text-green-500'}`}>
                  {isOwnMessage ? 'You' : <Link 
          to={`/profile/${msg.from_user}`}
          className="hover:underline cursor-pointer"
        >
          {msg.from_user}
        </Link>}
                </div>
                
                <div className="rounded-2xl bg-black min-h-[40px]" style={{ padding: '12px 16px' }}>
                  <p className="text-white">{msg.body}</p>
                  <small className="block text-right text-gray-400 text-xs mt-2">
                    {messageDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </small>
                </div>
              </div>
            </div>
          );
        });
        
        return messageGroups;
      })()}
      <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-gray-200 flex gap-2 sticky bottom-5   ">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-black border border-gray-300 rounded-full ml-4 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-custom-orange"
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!message.trim()}
            className={`rounded-full w-[100px] px-5 py-2 font-medium ${!message.trim() ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Send
          </button>
        </div>
      </div>
    );



};

export default Chat;