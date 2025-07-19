import { updateSubscriptionStatus } from "../library/LemmyApi";

export default function CommunitySubscribeButton({ communityId, isSubscribed }:
    { communityId: number, isSubscribed: boolean }) {

    function handleUpdateStatus(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (!confirm(
            isSubscribed ?
                "You will no longer receive notifications for this community! Are you sure?"
                :
                "You will start receiving notifications for activity in this community.")) {
            return;
        }

        updateSubscriptionStatus(communityId, !isSubscribed).then(
            (sub_status) => {
                if (sub_status != isSubscribed) {
                    window.alert("Updated successfully!");
                }
                else window.alert("Could not update.")
            }
        )
    }

    return <button
        onClick={handleUpdateStatus}
        className="subscription-status"
    >
        {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </button>
}