import "../styles/CommunitySelector.css"
import { CommunityView } from "lemmy-js-client";
import { useEffect, useState } from "react";
import { DEFAULT_COMMUNITY_LIST_LIMIT } from "../constants";
import { search } from "../library/LemmyApi";
import { formatToN } from "../library/Utils";

const formatTo50 = (s: string) => formatToN(s, 50);

// referring https://github.com/LemmyNet/lemmy-ui/blob/129fb5b2f994e02bfecc36e3f6884bdbf485b87a/src/shared/components/post/post-form.tsx#L681C16-L681C32
// and https://codesandbox.io/p/sandbox/searchable-dropdown-forked-krtmc5?file=%2Fsrc%2FSearchableDropdown.js%3A7%2C3-7%2C14

/** 
 * Performs interactive community selection.
 * Contains a form input field that returns communityId as a string
 * or an empty string, if it does not exist
 * */
export default function CommunitySelector({ name, isRequired = false }:
    { name: string, isRequired?: boolean }) {
    const [communities, setCommunities] = useState<CommunityView[]>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
    // Fields that are part of a controlled form should never be undefined or null
    // https://reactjs.org/link/controlled-components
    const [searchText, setSearchText] = useState<string>("");

    useEffect(
        () => {
            search({
                q: searchText || "",
                type_: "Communities",
                limit: DEFAULT_COMMUNITY_LIST_LIMIT,
                sort: "Active"
            }).then(
                (response) => setCommunities(response.communities
                    .filter(c => c.community.nsfw != true)
                )
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
            setSelectedCommunityId(null);
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
            <div className="control" onClick={() => setIsOpen(!isOpen)}>
                <input
                    className="search-value"
                    type="text"
                    value={searchText}
                    onChange={handleSearchTextChange}
                    placeholder="Search for a community"
                />
                {/* 
                We want this to be a completely independent component that the form can treat as a 'community ID selector'.
                So, we need an input field that returns the expected name in formData.
                We're sending the id back through a hidden input 
                */}
                {selectedCommunityId ?
                    <input
                        // Developer note: change type to "text" when debugging
                        type="hidden"
                        name={name}
                        value={selectedCommunityId}
                        required={isRequired}
                    />
                    :
                    // If we want to make use of the form's normal 'required' check, 
                    // it has to be on a non-hidden input. so we'll use css to 'hide' it
                    // This is a little hacky but it makes it act like a regular form field
                    <input
                        type="text"
                        name={name}
                        required={isRequired}
                        value=""
                        onChange={() => { }}
                        style={{ position: "absolute", width: 0, height: 0, opacity: 0 }}
                    />
                }
                <div className={`arrow ${isOpen ? "open" : ""}`}>
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
        </div>
    )
}