import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import { PgPostBody } from '../components/PgFinder/PostCreationHandler';

export default function PgPostPage() {
    const pgId = Number(useParams().pgId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const { profileInfo } = useProfileContext();

    useEffect(
        () => {
            getPostById(pgId).then(
                response =>
                    setPostView(response ? response.post_view : null)
            )
        },
        [pgId]
    )
    if (!postView) return <Loader />;
    let pgDetails: PgPostBody = JSON.parse(postView.post.body || "{}");
    const formatRating = (rating: number | null) => {
        if (rating === null) return 'N/A';
        return rating === 0 ? '0' : rating;
    }

    return (
        <>
            <div>
                <h3>{postView.post.name}</h3>
                <p>Location : {pgDetails.location || 'N/A'}</p>
                {postView.post.url && (
                    <p>
                        <strong>Map URL:</strong>{" "}
                        <a href={postView.post.url} target="_blank" rel="noopener noreferrer">
                            {postView.post.url}
                        </a>
                    </p>
                )}
                <p>Cost Rating: {formatRating(pgDetails.ratings?.cost)}/5</p>
                <p>Safety Rating: {formatRating(pgDetails.ratings?.safety)}/5</p>
                <p>Food Rating: {formatRating(pgDetails.ratings?.food)}/5</p>
                <p>Cleanliness Rating: {formatRating(pgDetails.ratings?.cleanliness)}/5</p>
                <p>AC Available: {pgDetails.acAvailable ? 'Yes' : 'No'}</p>
                <p>Food Type: {pgDetails.foodType || 'N/A'}</p>
                <h5>Description (Extra Information:) </h5>
                <p>{pgDetails.description || 'No description provided'}</p>
                <Link to={"/profile/" + postView.creator.name}>
                    <p>{postView.creator.display_name ? postView.creator.display_name : postView.creator.name}</p>
                </Link>

            </div>

            {postView.creator.id == profileInfo?.lemmyId &&
                <PostDeletor postId={postView.post.id} />}

            <CommentsSection postId={postView.post.id} />
        </>
    );
}