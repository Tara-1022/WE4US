import { AnnouncementData, AnnouncementForm } from "./AnnouncementCreationModal";
import { PostView } from "lemmy-js-client";
import { editPost } from "../../library/LemmyApi";

export default function AnnouncementEditor({ postView, onPostUpdated, onClose }:
    { postView: PostView, onPostUpdated: (updatedPostView: PostView) => void, onClose: () => void }) {

    function handleEdit(data: AnnouncementData) {
        editPost({
            post_id: postView.post.id,
            name: data.title,
            body: data.body
        }).then(
            (updatedPostView: PostView) => {
                window.alert("Announcement Updated!");
                onPostUpdated(updatedPostView);
                onClose();
            }
        )
            .catch(
                (error: Error) => {
                    window.alert("Could not update announcement");
                    console.error(error);
                }
            )
    }

    return <AnnouncementForm
        initialData={{ title: postView.post.name, body: postView.post.body || "" } as AnnouncementData}
        onSubmit={handleEdit}
        onClose={onClose}
    />

}