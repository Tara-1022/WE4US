import { PostView } from 'lemmy-js-client';
import default_image from '../assets/default_image.png'

export default function Post({postView}: {postView: PostView}){
    let styles = {
        post: {
            display: "flex",
            flexFlow: "row wrap",
        },
        details: {
        },
        image: {
        }
    }
    return (
        <div style={styles.post}>
            <a href='/sample_post' style={styles.image}>
                <img src={postView.image_details? postView.image_details.link : default_image} alt="PostImage" />
            </a>
            <div style={styles.details}>
                <h3>{postView.post.name}</h3>
                <p>{postView.creator.display_name?postView.creator.display_name:postView.creator.name}</p>
                <p>{postView.community.name}</p>
            </div>
        </div>
    );
}