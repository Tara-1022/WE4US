import PgPostSnippet from './PgPostSnippet';
import { PostView } from 'lemmy-js-client';
import "../styles/PgFinderPage.css";

export default function PgPostList({ postViews }: { postViews: PostView[] }) {
    // Simply return a styled list of PostSnippets
    const list = postViews.map(
        postView => <li key={postView.post.id} className="pg-post-list-item">
                        <PgPostSnippet postView={postView} />
                    </li>
    );
    return <ul className="pg-post-list">{list}</ul>;
}