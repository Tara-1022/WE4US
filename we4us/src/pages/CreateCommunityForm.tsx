import { useRef, useState } from "react";
import { createCommunity } from "../components/CreateCommunityRequest";

export default function CreateCommunityForm({ onCreate, apiUrl }) {
    const nameRef = useRef(null);
    const titleRef = useRef(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nameRef.current || !titleRef.current) return;

        const name = nameRef.current.value.trim();
        const title = titleRef.current.value.trim();

        if (!name || !title) {
            setError("Community name and title are required");
            return;
        }

        /*  if (!authToken) {
              setError("User is not authenticated.");
              return;
          } */

        setError("");
        setLoading(true);

        try {
            const data = await createCommunity(name, title);
            onCreate(data);
            nameRef.current.value = "";
            titleRef.current.value = "";
        } catch {
            setError("Failed to create community.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <h3>Create Community</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Community Name:
                    <input type="text" ref={nameRef} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
                </label>
                <label>
                    Title:
                    <input type="text" ref={titleRef} required style={{ width: "100%", padding: "8px", marginTop: "5px" }} />
                </label>
                <button type="submit" disabled={loading} style={{ marginTop: "10px", padding: "10px 15px", cursor: "pointer" }}>
                    {loading ? "Creating..." : "Create"}
                </button>
            </form>
        </div>
    );
}

