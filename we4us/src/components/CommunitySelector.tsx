import { useLemmyInfo } from "./LemmyContextProvider";

export default function CommunitySelector({ name }: { name: string }) {
    const communities = useLemmyInfo().lemmyInfo?.communities;
    const optionsList = communities?.map(
        (communityView) => <option value={communityView.community.id} key={communityView.community.id}>
            {communityView.community.name}
        </option>
    )
    return (
        <select name={name}>
            <option value={''} key={undefined}>unselected</option>
            {optionsList}
        </select>
    )
}