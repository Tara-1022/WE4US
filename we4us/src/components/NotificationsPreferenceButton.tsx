import { updateNotificationsPreference } from "../library/LemmyApi";
import { useProfileContext } from '../components/ProfileContext';

export default function NotificationsPreferenceButton() {

    const { profileInfo, setProfileInfo } = useProfileContext();

    function handleUpdatePreference(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (!confirm("Are you sure you want to update your email preference?")) {
            return;
        }
        if (!profileInfo) {
            window.alert("Unable to fetch profile");
            return;
        }

        updateNotificationsPreference(!profileInfo.is_email_notifications_on).then(
            (success) => {
                if (success) {
                    setProfileInfo(
                        {
                            ...profileInfo,
                            is_email_notifications_on: !profileInfo.is_email_notifications_on
                        }
                    )
                    window.alert("Updated successfully!");
                }
                else window.alert("Could not update preference.")
            }
        )
    }

    return <button
        onClick={handleUpdatePreference}
        className="notifs-preference"
    >
        {profileInfo?.is_email_notifications_on ? "Don't ": ""} Send Me Emails!
    </button>
}