import { useLemmyInfo } from "./LemmyContextProvider";

export default function CommunitySelector({ name, isRequired = false }: { name: string, isRequired?: boolean }) {
    const communities = useLemmyInfo().lemmyInfo?.communities;
    const optionsList = communities?.map(
        (communityView) => <option value={communityView.community.id} key={communityView.community.id}>
            {communityView.community.name}
        </option>
    )
    return (
        <select name={name} required={isRequired}>
            <option value={''} key={undefined}>No community selected</option>
            {optionsList}
        </select>
    )
}