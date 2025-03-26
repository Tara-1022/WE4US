import "../styles/CommunitySelector.css"
import { CommunityView } from "lemmy-js-client";
import { useEffect, useState } from "react";
import { DEFAULT_COMMUNITY_LIST_LIMIT } from "../constants";
import { search } from "../library/LemmyApi";

function formatTo50(s: string) {
    if (s.length <= 50) return s;
    return s.slice(0, 50 - 2) + "..";
}

// referring https://github.com/LemmyNet/lemmy-ui/blob/129fb5b2f994e02bfecc36e3f6884bdbf485b87a/src/shared/components/post/post-form.tsx#L681C16-L681C32
// and https://codesandbox.io/p/sandbox/searchable-dropdown-forked-krtmc5?file=%2Fsrc%2FSearchableDropdown.js%3A7%2C3-7%2C14
export default function CommunitySelector({ name, isRequired = false }:
    { name: string, isRequired?: boolean }) {
    const [communities, setCommunities] = useState<CommunityView[]>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    // Fields that are part of a controlled form should not ever be undefined or null
    // https://reactjs.org/link/controlled-components
    const [searchText, setSearchText] = useState<string>("");
    const [selectedCommunityId, setSelectedCommunityId] = useState<string>("");

    useEffect(
        () => {
            search({
                q: searchText || "",
                type_: "Communities",
                limit: DEFAULT_COMMUNITY_LIST_LIMIT,
                sort: "Active"
            }).then(
                (response) => setCommunities(response.communities)
            )
        }
        , [searchText]
    )

    async function handleSearchTextChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        handleSelect({});
        setSearchText(e.target.value);
        setIsOpen(true);
    }

    function handleSelect({ communityId, displayText }: { communityId?: number, displayText?: string }) {
        if (communityId && displayText) {
            setSelectedCommunityId(communityId.toString());
            setSearchText(displayText);
        }
        else {
            setSelectedCommunityId("");
            setSearchText("");
        }
        setIsOpen(false);
    }

    const optionsList = communities?.map(
        (communityView) => {
            const displayText = formatTo50(communityView.community.name + " (" + communityView.community.title + ")");
            return <div
                onClick={() => handleSelect({
                    communityId: communityView.community.id,
                    displayText: displayText
                })}
                className={`option ${selectedCommunityId === communityView.community.id.toString() ? "selected" : ""}`}
                key={communityView.community.id}
            >
                {displayText}
            </div>
        }
    )
    return (
        <div className="dropdown">
            <div className="control">
                <input
                    className="search-value"
                    type="text"
                    value={searchText}
                    onChange={handleSearchTextChange}
                    placeholder="Search for a community"
                    onClick={() => setIsOpen(!isOpen)} />
                {/* 
                We want this to be a completely independent component that the form can treat as a 'community ID selector'.
                So, we need an input field that returns the expected name in formData.
                Since we've removed the html <select> (which handles this by default), we're sending the id back through a 
                hidden input 
                */}
                <input
                    // Developer note: change type to "text" when debugging
                    type="hidden"
                    name={name}
                    value={selectedCommunityId}
                    required={isRequired}
                    readOnly />
                <div className={`arrow ${isOpen ? "open" : ""}`}>
                </div>
            </div>
            
            {/* The list of options that pops up */}
            <div className={`options ${isOpen ? "open" : ""}`}>
                <div
                    onClick={() => handleSelect({})}
                    className={`option ${selectedCommunityId ? "" : "selected"}`}
                >
                    No community selected
                </div>
                {optionsList}
            </div>
        </div>
    )
}