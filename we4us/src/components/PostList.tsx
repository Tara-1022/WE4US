import Post from "./Post";
import { PostView } from 'lemmy-js-client';

export default function PostList({ postViews }: { postViews: PostView[] }) {
    let styles = {
        list: {
            listStyleType: "none",
            margin: 0,
            padding: 0
        },
        listItem: {

        }
    }
    const list = postViews.map(
        postView => <li key={postView.post.id} style={styles.listItem}>
                        <Post postView={postView} />
                    </li>
    );
    return <ul style={styles.list}>{list}</ul>;
}