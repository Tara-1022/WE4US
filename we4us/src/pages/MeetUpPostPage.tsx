import { useState, useEffect, useRef } from "react";
import { PostView } from "lemmy-js-client";
import { getPostById } from "../library/LemmyApi";
import { Loader } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import CommentsSection from "../components/CommentsSection";
import PostDeletor from "../components/PostDeletor";
import { useProfileContext } from "../components/ProfileContext";
import ReactMarkdown from "react-markdown";
import { MeetUpPostType, defaultPostData } from '../components/MeetUp/MeetUpPostTypes';
import PostEditor from '../components/MeetUp/PostEditor';
import "../styles/MeetUpPostPage.css";

export default function MeetUpPostPage() {
  const meetUpId = Number(useParams().meetUpId);
  const [postView, setPostView] = useState<PostView | null>(null);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { profileInfo } = useProfileContext();
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPostById(meetUpId).then((response) => {
      setPostView(response ? response.post_view : null);
    });

  }, [meetUpId]);

  if (!postView)
    return <Loader size={32} strokeWidth={2} className="animate-spin" />;

  let MeetUpDetails: MeetUpPostType = {
    title: postView.post.name,
    url: defaultPostData.url,
    body: defaultPostData.body,
  };

  try {
    if (postView.post.body) {
      const parsedData = JSON.parse(postView.post.body);
      MeetUpDetails = {
        title: parsedData.title || postView.post.name,
        url: parsedData.url?.trim() || defaultPostData.url,
        body: {
          location: parsedData.location || defaultPostData.body.location,
          datetime: parsedData.datetime || defaultPostData.body.datetime,
          open_to: parsedData.open_to?.trim() || defaultPostData.body.open_to,
          additional_details: parsedData.additional_details?.trim() || defaultPostData.body.additional_details,
        },
      };
    }
  } catch (error) {
    console.error("Error parsing post body:", error);
  }

  let readableDateTime = MeetUpDetails.body.datetime;
  try {
    const parsedDate = new Date(MeetUpDetails.body.datetime);
    if (!isNaN(parsedDate.getTime())) {
      readableDateTime = parsedDate.toLocaleString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch (e) {
    console.error("Invalid datetime format:", e);
  }

  const toggleCommentsVisibility = () => {
    setCommentsVisible((prev) => !prev);
  };

  return (
    <div className="meetup-post-container">
      {postView.creator.id === profileInfo?.lemmyId && !isEditing && (
        <div className="meetup-post-delete">
          <PostDeletor postId={postView.post.id} />
        </div>
      )}

      {isEditing ? (
        <div ref={modalRef} className="modal">
          <PostEditor
            postView={postView}
            onPostUpdated={setPostView}
            onClose={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          <h4 className="meetup-post-title">{MeetUpDetails.title}</h4>

          <div className="meetup-post-section">
            <p><strong>Location:</strong> {MeetUpDetails.body.location}</p>
            <p><strong>Date & Time:</strong> {readableDateTime}</p>
            <p><strong>Open To:</strong> {MeetUpDetails.body.open_to}</p>
            {MeetUpDetails.url && (
              <p>
                <strong>URL:</strong>{" "}
                <a href={MeetUpDetails.url} target="_blank" rel="noopener noreferrer">
                  {MeetUpDetails.url}
                </a>
              </p>
            )}
          </div>

          {MeetUpDetails.body.additional_details && (
            <div className="meetup-post-section">
              <strong>Additional Details:</strong>
              <div className="meetup-post-details">
                <ReactMarkdown>{MeetUpDetails.body.additional_details}</ReactMarkdown>
              </div>
            </div>
          )}

          <p className="meetup-post-author">
            <strong>Posted by:</strong>{" "}
            <Link to={"/profile/" + postView.creator.name}>
              {postView.creator.display_name || postView.creator.name}
            </Link>
          </p>

          <div className="meetup-post-footer">
            <div className="meetup-post-footer-actions">
              {postView.creator.id === profileInfo?.lemmyId && (
                <b onClick={() => setIsEditing(true)}>Edit</b>
              )}
              <button
                className="meetup-post-comments-button"
                onClick={toggleCommentsVisibility}
              >
                {commentsVisible ? "Hide Comments" : "Comments"}
              </button>
            </div>
          </div>

          {commentsVisible && <CommentsSection postId={postView.post.id} />}
        </>
      )}
    </div>
  );
}
