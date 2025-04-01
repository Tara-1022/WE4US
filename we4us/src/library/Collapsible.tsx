import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Collapsible(
    { children, CollapsedIcon = ChevronDown, OpenIcon = ChevronUp, initiallyExpanded = true, style }:
        {
            children: React.ReactNode,
            CollapsedIcon?: React.FC,
            OpenIcon?: React.FC, initiallyExpanded?: boolean,
            style?: React.CSSProperties
        }) {
    let styles = {
        collapsibleIcon: {
            cursor: 'pointer'
        }
    }
    const [isExpanded, setExpanded] = useState(initiallyExpanded);
    function toggle() {
        setExpanded(!isExpanded);
    }
    return (
        <div className="collapsible">
            <div onClick={toggle} style={style || styles.collapsibleIcon}>
                {isExpanded ?
                    <CollapsedIcon /> : <OpenIcon />}
            </div>
            {isExpanded && children}
        </div>
    );
}