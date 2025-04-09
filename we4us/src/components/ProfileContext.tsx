import { createContext, useEffect, useState } from "react";
import { useSafeContext } from "../library/useSafeContext";
import { updateDisplayName } from "../library/LemmyApi";
import { Profile } from "../library/PostgresAPI";

// TODO: Add necessary details to connect to Who's who
export type profileInfoType = Profile & {
    lemmyId: number;
    isAdmin: boolean;
};

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
    // profileInfo is changed twice before we actually want to track it
    // once, setting it to undefined on start
    // and second, from undefined to fetched information on login
    // we don't want to be sending requests to lemmy on each login
    // TODO: change the condition to <=2
    // on deployment. Since the 'setting to undefined on start' occurs twice in 
    // strict dev mode.
    const [countTriggers, setCountTriggers] = useState<number>(0);

    useEffect(
        () => {
            console.log("Display name is now: ", profileInfo ? profileInfo.display_name : profileInfo);
            if (profileInfo && countTriggers > 2) {
                console.log("Triggered. on:", profileInfo);
                updateDisplayName(profileInfo.display_name)
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
            // the context switches from undefined to fetched value on login
            // there's no need to make an update if it's the first trigger (on login)
            console.log("Times display name changed: ", countTriggers);
            setCountTriggers(a => a + 1);
        },
        // this is the only editable information shared with lemmy
        [profileInfo?.display_name]
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