import { useProfileContext } from "../components/ProfileContext"

function ProfilePage() {
  const { profileInfo } = useProfileContext();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">ProfilePage</h1>
      <p>{"Lemmy ID " + profileInfo?.lemmyId}</p>
      <p>{"User Name " + profileInfo?.userName}</p>
      <p>{"Display name " + profileInfo?.displayName}</p>
    </div>
  )
}

export default ProfilePage