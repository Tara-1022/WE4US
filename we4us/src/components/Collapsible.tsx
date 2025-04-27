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
    
    const styles = {
        collapsible: {
            margin: "8px 0"
        },
        header: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            padding: "4px 0",
            fontWeight: "500",
            color: "#a0a8b0",
            fontSize: "13px"
        },
        content: {
            marginTop: "8px"
        }
    };
    
    const [isExpanded, setExpanded] = useState(initiallyExpanded);
    
    function toggle() {
        setExpanded(!isExpanded);
        onToggle && onToggle();
    }
    
    return (
        <div style={styles.collapsible}>
            <div onClick={toggle} style={styles.header}>
                {isExpanded ? <OpenIcon /> : <CollapsedIcon />}
            </div>
            
            {isExpanded && (
                <div style={styles.content}>
                    {children}
                </div>
            )}
        </div>
    );
}