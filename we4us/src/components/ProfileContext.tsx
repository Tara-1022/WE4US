import { createContext, useState } from "react";
import { useSafeContext } from "../library/useSafeContext";

// TODO: Add necessary details to connect to Who's who
export type profileInfoType = {
    lemmyId: number;
    displayName: string;
    userName: string;
    cohort?: string;
    companyOrUniversity?: string;
    currentRole?: string;
    yearsOfExperience?: number;
    areasOfInterest?: string[];
}

export type profileContextType = {
    profileInfo: profileInfoType | undefined;
    setProfileInfo: (newInfo: profileInfoType) => void;
}

export const ProfileContext = createContext<profileContextType | undefined>(undefined);

export const useProfileContext = () =>{
    return useSafeContext<profileContextType>(ProfileContext, "Profile Context");
}

export default function ProfileContextProvider({children}:{children: React.ReactNode}){
    const [profileInfo, setProfileInfo] = useState<profileInfoType | undefined>(undefined);
    const contextValue : profileContextType = {
        profileInfo, setProfileInfo
    }
    return(
        <ProfileContext.Provider value={contextValue}>
            {children}
        </ProfileContext.Provider>
    )
}