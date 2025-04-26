import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import AnnouncementPostSnippet from "./AnnouncementPostSnippet";
import { Loader } from 'lucide-react';
import { getAnnouncementPostList } from "../../library/LemmyApi"
import "./AnnouncementsPreview.css"

export default function AnnouncementsPreview() {
    const [postViews, setPostViews] = useState<PostView[] | null>(null);

    useEffect(() => {
        const loadPosts = async () => {
            const posts = await getAnnouncementPostList({limit: 5});
            setPostViews(posts);
        };

        loadPosts();
    }, []);


    if (!postViews) return <Loader />;
    else {
        const list = postViews.map(
            postView => <li key={postView.post.id} className="announcement-snippet">
                <AnnouncementPostSnippet postView={postView} />
            </li>
        );
        return (
            <div className="announcements-preview-container">
                <ul className="announcement-list">{list}</ul>
            </div>
        );
    }
}
