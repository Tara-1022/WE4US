import { Link } from 'react-router-dom';

let styles: { [key: string]: React.CSSProperties } = {
    post: {
        display: "flex",
        flexFlow: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2%"
    },
    details: {
        flex: 4
    }
};

export default function MeetUpPostSnippet({ location, datetime, access }: { location: string; datetime: string; access: string }) {
    return (
        <div style={styles.post}>
            <div style={styles.details}>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Time & Date:</strong> {datetime}</p>
                <p><strong>Open To:</strong> {access}</p>
                <Link to="/meet-up">View Details</Link>
            </div>
        </div>
    );
}
