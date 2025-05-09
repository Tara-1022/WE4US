import { PgPostData } from "./Types";
import Modal from "react-modal";
import "../../styles/PgFinderPage.css";

export default function CreatePostModal({ isOpen, setIsOpen, handleCreation }:
    { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, handleCreation: (data: PgPostData) => void }) {

    function handleClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const entries = Object.fromEntries(formData);

        handleCreation({
            name: (entries.name || '').toString(),
            url: entries.mapUrl.toString(),
            body: {
                location: (entries.location || '').toString(),
                acAvailable: entries.acAvailable === 'on',
                foodType: (entries.foodType || '').toString(),
                description: (entries.description || '').toString()
            }
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            className="pg-modal-form-wrapper"
            contentLabel="Create PG Entry"
            >
            <form onSubmit={handleClick} className="pg-modal-form">
                <label htmlFor="name"> Name of the PG: </label>
                <input name="name" required />
                <label htmlFor="location">Location: </label>
                <input name="location" required />
                <label htmlFor="mapUrl"> Map URL : </label>
                <input name="mapUrl" type="url" required />
                <label htmlFor="acAvailable">
                    <input
                        type="checkbox"
                        name="acAvailable"
                        id="acAvailable"
                    />{" "}AC Available
                </label>
                <label htmlFor="foodType">Food Type Available: </label>
                <select name="foodType" required>
                    <option value="">Select Food Type</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-vegetarian">Non-Vegetarian</option>
                    <option value="both">Both</option>
                </select>
                <label htmlFor="description"> Additional Information: </label>
                <textarea name="description" rows={4} cols={50}></textarea>
                <div className="pg-form-button-group">
                <button type="submit">Add New PG</button>
                <button type="reset" className="cancel-button" onClick={() => setIsOpen(false)}>Cancel</button>
                </div>
            </form>
        </Modal>
    )
}
