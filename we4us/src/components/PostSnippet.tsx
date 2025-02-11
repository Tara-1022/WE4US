import { PostView } from 'lemmy-js-client';
import default_image from '../assets/default_image.png'
import { Link } from 'react-router-dom';

export default function PostSnippet({postView}: {postView: PostView}){
    let styles: {[key: string]: React.CSSProperties } = {
        post: {
            display: "flex",
            flexFlow: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 10
        },
        imageContainer: {
            flex: 1,
            aspectRatio: "1",
            overflow: "hidden",
        },
        image: {
            width: "100%",
            height: "100%",
            objectFit: "cover"
        },
        details: {
            flex: 4
        }
    }
    return (
        <Link to={"/post/" + postView.post.id} style={styles.post}>
            <div style={styles.imageContainer}>
                <img 
                src={postView.image_details? postView.image_details.link : default_image} 
                alt="PostImage"
                style={styles.image} />
            </div>
            <div style={styles.details}>
                <h3>{postView.post.name}</h3>
                <p>{postView.creator.display_name?postView.creator.display_name:postView.creator.name}</p>
                <p>{postView.community.name}</p>
            </div>
        </Link>
    );
}