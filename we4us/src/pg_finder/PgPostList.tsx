import PgPostSnippet from './PgPostSnippet';
import { PostView } from 'lemmy-js-client';

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {

    }
}

export default function PgPostList({ postViews }: { postViews: PostView[] }) {
    // Simply return a styled list of PostSnippets
    const list = postViews.map(
        postView => <li key={postView.post.id} style={styles.listItem}>
                        <PgPostSnippet postView={postView} />
                    </li>
    );
    return <ul style={styles.list}>{list}</ul>;
}