import CommunitySnippet from "./CommunitySnippet";
import { CommunityView } from "lemmy-js-client";

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {

    }
}

export default function CommunityList({communityViews}: {communityViews: CommunityView[]}){
    // Return a list of CommunitySnippets
    const list = communityViews.map(
        communityView => <li key={communityView.community.id} style={styles.listItem}>
            <CommunitySnippet communityView={communityView} />
        </li>
    );
    return <ul style={styles.list}>{list}</ul>;
}