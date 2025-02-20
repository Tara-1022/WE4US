import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Collapsible({children}: {children: React.ReactNode}) {
    let styles = {
        collapsible:{
        }
    }
    const [isExpanded, setExpanded] = useState(true);
    function toggle(){
        setExpanded(!isExpanded);
    }
    return (
        <div className="collapsible" style={styles.collapsible}>
            {isExpanded? <ChevronDown onClick={toggle} /> : <ChevronUp onClick={toggle}/>}
            {isExpanded && children}
        </div>
    );
}