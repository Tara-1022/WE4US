import React, { useState, ChangeEvent, useEffect } from 'react';
import { useProfileContext } from '../components/ProfileContext';
import { useParams } from 'react-router-dom';
import { Socket, Channel } from "phoenix";

interface Message {
  from_user: string;
  body: string;
  to_user: string;
}
interface MessagePayload {
  body: string;
}

interface ServerResponse {
  status: string;
  message: string;
}

let socket: Socket | null = null;
let channel: Channel | null = null;
let socketInitialized: boolean = false;
let currentUsername: string | null = null;


export async function initializeSocket(sender: string, recipient:string): Promise<Channel | null> {
  if (!sender || !recipient) {
    console.error("Username is undefined. Cannot initialize socket.");
    return null;
  }

  try {
    console.log("Using username as auth token:", sender);

    currentUsername = sender; 

    socket = new Socket("ws://localhost:4000/socket", { params: { token: sender } });

    socket.connect();
    console.log("Socket connection attempted");

    const topic = `message:${recipient}`;
    channel = socket.channel(topic, {});
    await channel.join()
      .receive("ok", () => {
        console.log("Successfully joined the channel");
        socketInitialized = true;
      })
      .receive("error", (error: any) => {
        console.error("Failed to join the channel:", error);
        throw new Error("Failed to join the channel.");
      });

  
    return channel;
  } catch (error) {
    console.error("Error during socket initialization:", error);
    socketInitialized = false;
    return null;
  }
}

export async function sendMessage(message: string, recipient:string): Promise<void> {
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
    channel
      .push("send_message", { body: message, to: recipient })
      .receive("ok", (response: ServerResponse) => {
        console.log("Message sent successfully:", response);
      })
      .receive("error", (error: any) => {
        console.error("Message not sent:", error);
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