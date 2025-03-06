import { useState } from "react";
<<<<<<< Updated upstream
import CreateCommunityModal from "../components/CreateCommunityModal";
=======
import CreateCommunityForm from "../pages/CreateCommunityForm";
>>>>>>> Stashed changes

const CreateCommunityButton = () => {
    const [showForm, setShowForm] = useState(false);

    const handleCommunityCreate = async (data: any) => {
        console.log("Community created:", data);
        window.alert(`Community "${data.community.title}" created successfully!`);
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


