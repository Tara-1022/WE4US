import { PostView } from 'lemmy-js-client';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

let styles: { [key: string]: React.CSSProperties } = {
    post: {
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "2%"
    },
    details: {
        flex: 4
    },
    iconContainer: {
        display: "flex",
        flex: 1,
        aspectRatio: "1",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        width: "50%",
        height: "50%"
    }
}

export default function AnnouncementPostSnippet({ postView }: { postView: PostView }) {
    // A succint display of the announcement

    return (
        <div style={styles.post}>
            <div style={styles.iconContainer}>
                <Bell style={styles.icon} />
            </div>
            <div style={styles.details}>
                <Link to={"/announcements/" + postView.post.id}>
                    <h3>{postView.post.name}</h3>
                </Link>
                <p>{
                    postView.post.body ?
                        (postView.post.body.length <= 50) ?
                            postView.post.body
                            : postView.post.body.slice(0, 50 - 2) + ".."
                        : ""
                }</p>
            </div>
        </div>
    );
}