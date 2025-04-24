import MeetUpPostSnippet from "./MeetUpSnippet";
import { PostView } from "lemmy-js-client";
import './MeetUpPostList.css'; 

export default function MeetUpPostList({ postViews }: { postViews: PostView[] }) {
    return (
        <div className="meetup-post-list">
            {postViews.map(postView => (
                <div key={postView.post.id} className="meetup-post-list-item">
                    <MeetUpPostSnippet postView={postView} />
                </div>
            ))}
        </div>
    );
}
