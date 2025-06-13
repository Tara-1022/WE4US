import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { useProfileContext } from '../components/ProfileContext';
import { useParams } from 'react-router-dom';
import { Message } from '../library/PostgresAPI';
import { Socket, Channel } from "phoenix";
import { Link } from 'react-router-dom';
import RedirectPage from './RedirectPage';
import "../styles/ChatPage.css";
import { getLemmyToken } from '../library/LemmyApi';

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

export async function initializeSocket(sender: string, recipient: string): Promise<{ channel: Channel | null, messages: Message[] }> {
  console.log(sender, recipient)
  if (!sender || !recipient) {
    console.error("Username is undefined. Cannot initialize socket.");
    return { channel: null, messages: [] };
  }

  try {
    console.log("Using username as auth token:", sender);

    socket = new Socket("wss://we4us.co.in/socket", { params: { token: getLemmyToken() } });
    socket.connect();
    console.log("Socket connection attempted");
    const users = [sender, recipient].sort();
    const topic = `message:${users.join("#")}`;
    channel = socket.channel(topic, { username: sender });

    const joinResponse = await new Promise<{ messages: Message[] }>((resolve, reject) => {
      channel!.join()
        .receive("ok", (response) => {
          console.log("Successfully joined the channel", response);
          socketInitialized = true;
          resolve(response);
        })
        .receive("error", (error: any) => {
          if (error.reason === "Profile does not exist") reject(new Error("ProfileNotFound"));
          else reject(new Error("SocketJoinFailed"));
        });
    });

    return { channel, messages: joinResponse.messages || [] };
  } catch (error) {
    console.error("Error during socket initialization:", error);
    socketInitialized = false;
    throw error;
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
  const [redirect, setRedirect] = useState(false)

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
        if (error instanceof Error && error.message === "ProfileNotFound") {
          window.alert("Profile does not exist!")
          setRedirect(true);
        }
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

  if (redirect) return <RedirectPage />

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 className="chat-title">Chat with {to_user}</h1>
      </div>

      <div className="chat-messages-container">

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
                <div key={`date-${dateString}-${index}`} className="chat-date-separator">
                  <div className="chat-date-text">
                    {dateString}
                  </div>
                </div>
              );
            }

            // Add the message
            messageGroups.push(
              <div
                key={msg.id || index}
                className={`chat-message-wrapper ${isOwnMessage ? 'own-message' : 'other-message'} `}
              >
                <div className="chat-message-content">
                  <div className={`chat-username ${isOwnMessage ? 'own' : 'other'}`}>
                    {isOwnMessage ? 'You' : <Link
                      to={`/profile/${msg.from_user}`}
                      className="chat-username-link"
                    >
                      {msg.from_user}
                    </Link>}
                  </div>

                  <div className={`chat-message-bubble ${isOwnMessage ? 'own' : 'other'}`} >
                    <p className="chat-message-text">{msg.body}</p>
                    <small className="chat-message-time">
                      {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

      <div className="chat-input-container ">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="chat-message-input"
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="chat-send-button"
        >
          Send
        </button>
      </div>
    </div>
  );



};

export default Chat;