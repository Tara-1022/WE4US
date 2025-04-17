import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Collapsible(
    { children, CollapsedIcon = ChevronDown, OpenIcon = ChevronUp, initiallyExpanded = true, onToggle }:
        {
            children: React.ReactNode,
            CollapsedIcon?: React.FC, OpenIcon?: React.FC,
            initiallyExpanded?: boolean,
            onToggle?: () => void
        }) {
    let styles = {
        collapsibleIcon: {
            cursor: 'pointer'
        }
    }
    const [isExpanded, setExpanded] = useState(initiallyExpanded);
    function toggle() {
        setExpanded(!isExpanded);
        onToggle && onToggle();
    }
    return (
        <div className="collapsible">
            <div onClick={toggle} style={styles.collapsibleIcon}>
                {isExpanded ?
                    <CollapsedIcon /> : <OpenIcon />}
            </div>
            {isExpanded && children}
        </div>
    );
}