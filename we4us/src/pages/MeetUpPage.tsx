import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import MeetUpPostList from "../components/MeetUp/MeetUpPostList";
import { Loader } from "lucide-react";
import { getMeetUpPostList } from "../library/LemmyApi";
import PostCreationHandler from "../components/MeetUp/PostCreationHandler";

export default function MeetUpPage() {
    const [postViews, setPostViews] = useState<PostView[] | null>(null);

    useEffect(() => {
        getMeetUpPostList().then((postViews) => {
            setPostViews(postViews);
        });
    }, []);

    if (!postViews) return <Loader />;
    if (postViews.length === 0) return <h3>No posts to see!</h3>;

    // Ensure only relevant data (location, datetime, access) is processed
    const filteredPostViews = postViews.map((postView) => {
        let parsedBody = { location: "Unknown", datetime: "Not Specified", access: "Open to All" };

        if (postView.post.body && typeof postView.post.body === "string") {
            try {
                parsedBody = JSON.parse(postView.post.body);
            } catch (error) {
                console.error("Error parsing post body:", error);
            }
        }

        return {
            ...postView,
            post: {
                ...postView.post,
                body: JSON.stringify(parsedBody) // Ensure consistent structure
            }
        };
    });

    return (
        <>
            <h3>Meet Up</h3>
            <PostCreationHandler
                handleCreatedPost={(newPost) => {
                    let parsedBody = { location: "Unknown", datetime: "Not Specified", access: "Open to All" };

                    if (newPost.post.body && typeof newPost.post.body === "string") {
                        try {
                            parsedBody = JSON.parse(newPost.post.body);
                        } catch (error) {
                            console.error("Error parsing new post body:", error);
                        }
                    }

                    setPostViews([
                        {
                            ...newPost,
                            post: {
                                ...newPost.post,
                                body: JSON.stringify(parsedBody),
                            },
                        },
                        ...filteredPostViews,
                    ]);
                }}
            />
            <MeetUpPostList postViews={filteredPostViews} />
        </>
    );
}
