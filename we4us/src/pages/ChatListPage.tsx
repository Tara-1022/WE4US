import { useState, useEffect } from "react";
import { fetchLastMessages, Message } from "../library/PostgresAPI";
import { Loader, MessageSquare } from 'lucide-react';
import { useProfileContext } from "../components/ProfileContext";
import { formatToN } from "../library/Utils";
import { useNavigate } from "react-router-dom";
import '../styles/ChatListPage.css'

export default function ChatListPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { profileInfo } = useProfileContext();
    const navigate = useNavigate();

    const this_user = profileInfo?.username;

    useEffect(() => {
        setIsLoading(true);

        if (!this_user) {
            setIsLoading(false)
            return;
        }

        fetchLastMessages(this_user)
            .then(
                (messageData) => setMessages(messageData)
            )
            .catch(
                (error) => window.alert(error instanceof Error
                    ? error.message
                    : "An unknown error occurred."))
            .finally(() => setIsLoading(false));
    }, [this_user]);

    if (isLoading) return <Loader />;

    if (!this_user) return <p className="error-message">Unable to fetch your username! Try logging in again.</p>

    return (
        <div className="chat-list-container">
            <h2>Private Messages</h2>
            <ul className="chat-list">
                {
                    messages.length > 0
                        ?
                        messages.map(
                            (message) => {
                                let other_user = message.from_user == this_user
                                    ? message.to_user
                                    : message.from_user;
                                return <li
                                    className="message-snippet"
                                    key={message.from_user + "#" + message.to_user}
                                    onClick={() => navigate("/chat/" + other_user)}
                                >
                                    <MessageSquare className="message-icon" size={70} strokeWidth={1} />
                                    <div className="content">
                                        <h3>{other_user}</h3>
                                        <span className="sender">
                                            {(message.from_user == other_user ? other_user : "You")
                                                + ": "}
                                        </span>
                                        <span className="message">
                                            {formatToN(message.body, 50)}
                                        </span>
                                        <span className="date-time">
                                            {(new Date(message.inserted_at)).toLocaleString()}
                                        </span>
                                    </div>
                                </li>
                            }
                        )
                        : <span>No Chats yet!</span>
                }
            </ul>
        </div>
    )
}