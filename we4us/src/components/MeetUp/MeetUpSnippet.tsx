import { Link } from "react-router-dom";
import { PostView } from "lemmy-js-client";
import { MeetUpPostBody } from "./MeetUpPostTypes";
import { Clock } from "lucide-react";

export default function MeetUpPostSnippet({
  postView,
}: {
  postView: PostView;
}) {
  let parsedBody: MeetUpPostBody = {
    title: "",
    location: "Unknown",
    datetime: "Not Specified",
    open_to: "All",
    url: undefined,
    additional_details: "",
  };

  if (postView.post.body) {
    try {
      parsedBody = JSON.parse(postView.post.body);
    } catch (error) {
      console.error("Error parsing post body:", error);
      parsedBody = {
        title: "Error: Unable to parse title",
        location: "Error: Unable to parse location",
        datetime: "Error: Unable to parse date/time",
        open_to: "Error: Unable to parse access information",
        url: undefined,
        additional_details: "",
      };
    }
  }

  const readableDateTime =
    parsedBody.datetime && !parsedBody.datetime.startsWith("Error")
      ? new Date(parsedBody.datetime).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : parsedBody.datetime;

  const styles = {
    card: {
      backgroundColor: "#2f2f2f",
      borderRadius: "12px",
      padding: "20px 24px",
      margin: "20px 0",
      transition: "background-color 0.2s ease",
      fontFamily: "'Inter', sans-serif",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      position: "relative" as const,
    },
    hover: {
      backgroundColor: "#3a3a3a",
    },
    title: {
      fontSize: "20px",
      fontWeight: 600,
      color: "#ffffff",
      marginBottom: "12px",
    },
    detail: {
      fontSize: "15px",
      color: "#dddddd",
      marginBottom: "6px",
      lineHeight: "1.6",
    },
    link: {
      color: "#90cdf4",
      textDecoration: "underline",
      wordBreak: "break-word",
    },
    dateTimeTopRight: {
      position: "absolute" as const,
      top: "16px",
      right: "20px",
      fontSize: "13px",
      color: "#bbbbbb",
      fontStyle: "italic",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
  };

  const handleHover = (e: React.MouseEvent<HTMLDivElement>, hover: boolean) => {
    Object.assign(
      e.currentTarget.style,
      hover ? styles.hover : { backgroundColor: styles.card.backgroundColor }
    );
  };

  return (
    <Link
      to={`/meetup/${postView.post.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={styles.card}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        <h3 style={styles.title}>{parsedBody.title}</h3>

        <div style={styles.dateTimeTopRight}>
          <Clock size={14} strokeWidth={1.5} />
          {readableDateTime}
        </div>

        <p style={styles.detail}>
          <strong>Location:</strong> {parsedBody.location}
        </p>
        <p style={styles.detail}>
          <strong>Open To:</strong> {parsedBody.open_to}
        </p>
        {parsedBody.url && (
          <p style={styles.detail}>
            <strong>Event Link:</strong>{" "}
            <a
              href={parsedBody.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              {parsedBody.url}
            </a>
          </p>
        )}
      </div>
    </Link>
  );
}
