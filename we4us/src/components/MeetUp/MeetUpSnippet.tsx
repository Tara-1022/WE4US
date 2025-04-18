import { Link } from "react-router-dom";
import { PostView } from "lemmy-js-client";
import { MeetUpPostBody } from "./MeetUpPostTypes";
import { Clock } from "lucide-react";
import './MeetUpSnippet.css'; 

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

  const DateAndTime =
    parsedBody.datetime && !parsedBody.datetime.startsWith("Error")
      ? new Date(parsedBody.datetime).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : parsedBody.datetime;

  return (
    <Link
      to={`/meetup/${postView.post.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card">
        <h3 className="title">{parsedBody.title}</h3>

        <div className="dateTimeTopRight">
          <Clock size={14} strokeWidth={1.5} />
          {DateAndTime}
        </div>

        <p className="detail">
          <strong>Location:</strong> {parsedBody.location}
        </p>
        <p className="detail">
          <strong>Open To:</strong> {parsedBody.open_to}
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
