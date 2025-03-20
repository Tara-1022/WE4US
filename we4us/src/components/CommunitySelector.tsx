import { useLemmyInfo } from "./LemmyContextProvider";

function formatTo50(s: string){
    if (s.length <= 50) return s;
    return s.slice(0, 50 - 2) + "..";
}

export default function CommunitySelector({ name, isRequired = false }: { name: string, isRequired?: boolean }) {
    const communities = useLemmyInfo().lemmyInfo?.communities;
    const optionsList = communities?.map(
        (communityView) => <option value={communityView.community.id} key={communityView.community.id}>
            {formatTo50(communityView.community.name + " (" + communityView.community.title + ")")}
        </option>
    )
    return (
        <select name={name} required={isRequired}>
            <option value={''} key={undefined}>No community selected</option>
            {optionsList}
        </select>
    )
}