import { PostView } from 'lemmy-js-client';
import default_image from '../assets/default_post_image.png'
import { Link } from 'react-router-dom';
import LikeHandler from './LikeHandler';
import { PostBodyType, getPostBody } from '../library/PostBodyType';
import { constructImageUrl } from '../library/ImageHandling';

let styles: { [key: string]: React.CSSProperties } = {
    post: {
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "2%"
    },
    imageContainer: {
        flex: 1,
        aspectRatio: "1",
        overflow: "hidden",
        margin: "2%"
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "10px"
    },
    details: {
        flex: 4
    }
}

export default function PostSnippet({ postView }: { postView: PostView }) {
    // A succint display of primary information of the post

    const postBody: PostBodyType = getPostBody(postView)

    return (
        <div style={styles.post}>

            <div style={styles.imageContainer}>
                <img
                    src={postBody.imageData ? constructImageUrl(postBody.imageData.filename) : default_image}
                    alt="PostImage"
                    style={styles.image} />
            </div>

            <div style={styles.details}>
                <Link to={"/post/" + postView.post.id}>
                    <h3>{postView.post.name}</h3>
                </Link>
                <Link to={"/profile/" + postView.creator.name}>
                    {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}
                </Link>
                <Link to={"/community/" + postView.community.id}>
                    <p>{postView.community.name}</p>
                </Link>
            </div>

            <LikeHandler forPost={true} isInitiallyLiked={postView.my_vote == 1} initialLikes={postView.counts.score} id={postView.post.id} />

        </div >
    );
}