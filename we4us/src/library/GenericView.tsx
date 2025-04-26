import { CommentView, PostView } from 'lemmy-js-client';
import AnnouncementPostSnippet from '../components/Announcements/AnnouncementPostSnippet';
import MeetUpPostSnippet from '../components/MeetUp/MeetUpSnippet';
import PgPostSnippet from '../components/PgFinder/PgPostSnippet';
import JobPostSnippet from '../components/JobBoard/JobPostSnippet';
import CommentSnippet from '../components/CommentSnippet';
import { ANNOUNCEMENTS_COMMUNITY_NAME, JOB_BOARD_COMMUNITY_NAME, MEET_UP_COMMUNITY_NAME, PG_FINDER_COMMUNITY_NAME } from '../constants';
import { ReviewSnippet } from '../components/PgFinder/Review';
import PostSnippet from '../components/PostSnippet';

export type GenericView = {
    type_: "comment" | "post",
    data: CommentView | PostView,
    id: number,
    community_name: string
}

export function postToGenericView(p: PostView): GenericView {
    return {
        type_: "post",
        data: p,
        id: p.post.id,
        community_name: p.community.name
    } as GenericView
}

export function commentToGenericView(c: CommentView): GenericView {
    return {
        type_: "comment",
        data: c,
        id: c.comment.id,
        community_name: c.community.name
    } as GenericView
}

export function GenericViewSnippet({ view }: { view: GenericView }) {
    switch (view.type_) {
        case "comment":
            switch (view.community_name) {
                case PG_FINDER_COMMUNITY_NAME:
                    return <ReviewSnippet review={view.data as CommentView} withPostLink={true}/>
                default:
                    return <CommentSnippet commentView={view.data as CommentView} withPostLink={true} />
            }

        case "post":
            const postView = view.data as PostView;
            switch (view.community_name) {
                case ANNOUNCEMENTS_COMMUNITY_NAME:
                    return <AnnouncementPostSnippet postView={postView} />
                case MEET_UP_COMMUNITY_NAME:
                    return <MeetUpPostSnippet postView={postView} />
                case PG_FINDER_COMMUNITY_NAME:
                    return <PgPostSnippet postView={postView} />
                case JOB_BOARD_COMMUNITY_NAME:
                    return <JobPostSnippet postView={postView} />
                default:
                    return <PostSnippet postView={postView} />
            }
        default:
            return <></>
    }
}

export function GenericViewList({ views }: { views: GenericView[] }) {
    const list = views.map(
        view => <li key={view.type_ + view.id}>
            <GenericViewSnippet view={view} />
        </li>
    );
    return <ul style={{
        listStyleType: "none",
        margin: 0,
        padding: 0
    }}>{list}</ul>
}