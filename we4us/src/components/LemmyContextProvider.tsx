// maintain context - site data, list of communities etc
import { createContext, useState } from "react";
import { CommunityView } from "lemmy-js-client";
import { useSafeContext } from "../library/useSafeContext";

export type lemmyInfoType = {
    communities: CommunityView[]
}

export type lemmyContextValueType = {
    lemmyInfo: lemmyInfoType | undefined;
    setLemmyInfo: React.Dispatch<React.SetStateAction<lemmyInfoType | undefined>>
}

export const LemmyContext = createContext<lemmyContextValueType | undefined>(undefined);

export const useLemmyInfo = () => {
    return useSafeContext(LemmyContext, "Lemmy Context");
}

export default function LemmyContextProvider({children}: {children: React.ReactNode}){
    const [lemmyInfo, setLemmyInfo] = useState<lemmyInfoType | undefined>(undefined);

    const contextValue: lemmyContextValueType = {
        lemmyInfo, setLemmyInfo
    }
    
    return (
        <LemmyContext.Provider value={contextValue}>
            {children}
        </LemmyContext.Provider>
    )
}