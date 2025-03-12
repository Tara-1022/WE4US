import { useState } from "react";
import CreateCommunityModal from "../components/CreateCommunityModal";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD

=======
>>>>>>> bcb0140 (Switched to navigate from react-router-dom for consistency)


const CreateCommunityButton = () => {
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const handleCommunityCreate = async (data: any) => {
        console.log("Community created:", data);
        window.alert(`Community "${data.community.title}" created successfully!`);
        navigate(`/community/${data.community.id}`);
    };

    return (
        <div>
            <button
                onClick={() => setShowForm(true)}
                style={{
                    margin: "10px",
                    padding: "10px",
                    background: "#1A1A1A",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                }}
            >
                Create Community
            </button>
            {showForm && <CreateCommunityModal onCreate={handleCommunityCreate}
                isOpen={showForm}
                onClose={() => setShowForm(false)} />
            }
        </div>
    );
};

export default CreateCommunityButton;


