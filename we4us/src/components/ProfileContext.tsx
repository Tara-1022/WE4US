import { createContext, useEffect, useState } from "react";
import { useSafeContext } from "../library/useSafeContext";
import { updateDisplayName } from "../library/LemmyApi";

// TODO: Add necessary details to connect to Who's who
export type profileInfoType = {
    lemmyId: number;
    displayName: string;
    userName: string;
    isAdmin: boolean;
    cohort?: string;
    companyOrUniversity?: string;
    currentRole?: string;
    yearsOfExperience?: number;
    areasOfInterest?: string[];
}

export type profileContextType = {
    profileInfo: profileInfoType | undefined;
    setProfileInfo: React.Dispatch<React.SetStateAction<profileInfoType | undefined>>;
}

export const ProfileContext = createContext<profileContextType | undefined>(undefined);

export const useProfileContext = () => {
    return useSafeContext<profileContextType>(ProfileContext, "Profile Context");
}

export default function ProfileContextProvider({ children }: { children: React.ReactNode }) {
    const [profileInfo, setProfileInfo] = useState<profileInfoType | undefined>(undefined);
    
    
    useEffect(
        () => {
            if (profileInfo) {
                console.log("Triggered. on:", profileInfo);
                updateDisplayName(profileInfo.displayName)
                    .then(
                        (status) => {
                            if (status) console.log("Lemmy name updated successfully")
                            else throw new Error("Could not update Lemmy display name");
                        })
                    .catch(
                        (error) => {
                            window.alert(error);
                            // right now all it does is update display name. An error here is not breaking 
                            // anything, so we won't bubble it up further.
                        }
                    )
            }
        },
        // this is the only editable information shared with lemmy
        [profileInfo?.displayName]
    )
    
    const contextValue: profileContextType = {
        profileInfo, setProfileInfo
    }
    return (
        <ProfileContext.Provider value={contextValue}>
            {children}
        </ProfileContext.Provider>
    )
}