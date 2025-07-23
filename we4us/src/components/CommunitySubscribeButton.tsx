import { useState } from "react";
import { updateSubscriptionStatus } from "../library/LemmyApi";
import {  IoIosNotifications, IoIosNotificationsOff } from "react-icons/io";
import "../styles/CommunitySubscribeButton.css";

export default function CommunitySubscribeButton({ communityId, isSubscribed }:
    { communityId: number, isSubscribed: boolean }) {
    const [isSubscribedState, setSubscribedState] = useState<boolean>(isSubscribed);

    function handleUpdateStatus(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (!confirm(
            isSubscribedState ?
                "You will no longer receive notifications for this community! Are you sure?"
                :
                "You will start receiving notifications for activity in this community.")) {
            return;
        }

        updateSubscriptionStatus(communityId, !isSubscribed).then(
            (sub_status) => {
                if (sub_status != isSubscribedState) {
                    window.alert("Updated successfully!");
                    setSubscribedState(sub_status);
                }
                else window.alert("Could not update.")
            }
        )
    }

    return (
 <button
            onClick={handleUpdateStatus}
            className="unsubscribe-button"
        >
            {isSubscribedState
                ? <IoIosNotificationsOff size={32} />
                : <IoIosNotifications size={32} />
            }
        </button>
)
}