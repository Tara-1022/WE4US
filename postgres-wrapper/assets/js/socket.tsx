import { Socket, Channel } from "phoenix";

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
let currentUsername: string | null = null; // Store the username globally

export async function initializeSocket(username: string): Promise<Channel | null> {
  if (!username) {
    console.error("Username is undefined. Cannot initialize socket.");
    return null;
  }

  try {
    console.log("Using username as auth token:", username);

    currentUsername = username; // Store the username for later use

    socket = new Socket("ws://localhost:4000/socket", { params: { token: username } });

    socket.connect();
    console.log("Socket connection attempted");

    channel = socket.channel("message:lobby", {});
    await channel.join()
      .receive("ok", () => {
        console.log("Successfully joined the channel");
        socketInitialized = true;
      })
      .receive("error", (error: any) => {
        console.error("Failed to join the channel:", error);
        throw new Error("Failed to join the channel.");
      });

    // Listen for 'shout' events
    channel.on("shout", (payload) => {
      console.log("Received shout event:", payload);
    });

    return channel;
  } catch (error) {
    console.error("Error during socket initialization:", error);
    socketInitialized = false;
    return null;
  }
}

export async function sendMessage(message: string): Promise<void> {
  if (!socketInitialized || !channel) {
    console.error("Socket is not initialized. Call initializeSocket first.");
    return;
  }

  try {
    // Use the stored username for the name field
    channel.push('shout', { name: currentUsername || "guest", message, inserted_at: new Date() });
    console.log("Sending message:", message);
    channel
      .push("new_message", { body: message })
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