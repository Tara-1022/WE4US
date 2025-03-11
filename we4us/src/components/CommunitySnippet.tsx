import { CommunityView } from "lemmy-js-client";
import { Link } from "react-router-dom";

let styles: { [key: string]: React.CSSProperties } = {
    community: {
        alignItems: "center",
        justifyContent: "center",
        padding: "2%"
    },
}

export default function CommunitySnippet({ communityView }: { communityView: CommunityView }) {
    return (
        <div style={styles.community}>
            <Link to={"/community/" + communityView.community.id}>
                <h3>{communityView.community.name}</h3>
            </Link>
            <p>{communityView.community.title}</p>
            <p>{"This community has " + communityView.counts.posts +
                " Posts and " + communityView.counts.comments + " Comments!"}</p>
        </div>
    )
}