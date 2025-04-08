import MeetUpPostSnippet from "./MeetUpSnippet";
import { PostView } from "lemmy-js-client";

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    }
};

export default function MeetUpPostList({ postViews }: { postViews: PostView[] }) {
    return (
        <ul style={styles.list}>
            {postViews.map(postView => (
                <li key={postView.post.id}>
                    <MeetUpPostSnippet postView={postView} />
                </li>
            ))}
        </ul>
    );
}
