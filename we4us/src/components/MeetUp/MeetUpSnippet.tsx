import { Link } from "react-router-dom";
import { PostView } from "lemmy-js-client";
import { Clock } from "lucide-react";
import './MeetUpSnippet.css'; 
import { MeetUpPostType, defaultPostData } from "./MeetUpPostTypes";

export default function MeetUpPostSnippet({ postView }: { postView: PostView }) {
  let parsedBody: MeetUpPostType = defaultPostData;

  if (postView.post.body) {
    try {
      parsedBody = {
        title: postView.post.name,
        url: postView.post.url,
        body: JSON.parse(postView.post.body)
      };
    } catch (error) {
      console.error("Error parsing post body:", error);
      parsedBody = {
        title: "Error: Unable to parse title",
        url: undefined,
        body: {
          location: "Error: Unable to parse location",
          datetime: "Error: Unable to parse date/time",
          open_to: "Error: Unable to parse access information",
          additional_details: "",
        },
      };
    }
  }

  const formattedDateTime =
    parsedBody.body.datetime && !parsedBody.body.datetime.startsWith("Error")
      ? new Date(parsedBody.body.datetime).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : parsedBody.body.datetime;

  return (
    <Link
      to={`/meetup/${postView.post.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card">
        <h3 className="title">{parsedBody.title}</h3>

        <div className="dateTimeTopRight">
          <Clock size={14} strokeWidth={1.5} />
          {formattedDateTime}
        </div>

        <p className="detail">
          <strong>Location:</strong> {parsedBody.body.location}
        </p>
        <p className="detail">
          <strong>Open To:</strong> {parsedBody.body.open_to}
        </p>
        {parsedBody.url && (
          <p className="detail">
            <strong>Event Link:</strong>{" "}
            <a
              href={parsedBody.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {parsedBody.url}
            </a>
          </p>
        )}
      </div>
    </Link>
  );
}
