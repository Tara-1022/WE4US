import { PgPostData } from "./PostCreationHandler";
import Modal from "react-modal";

let styles = {
    form: {
        color: "black"
    }
}

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
                ratings: {
                    cost: Number(entries.costRating || null),
                    safety: Number(entries.safetyRating || null),
                    food: Number(entries.foodRating || null),
                    cleanliness: Number(entries.foodRating || null),
                },
                acAvailable: entries.acAvailable === 'on',
                foodType: (entries.foodType || '').toString(),
                description: (entries.description || '').toString()
            }
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            contentLabel="Login">
            <form onSubmit={handleClick} style={styles.form}>
                <label htmlFor="name"> Name of the PG: </label>
                <input name="name" required />
                <br />
                <label htmlFor="location">Location: </label>
                <input name="location" required />
                <br />
                <label htmlFor="mapUrl"> Map URL : </label>
                <input name="mapUrl" type="url" required />
                <br />
                <label>Ratings (1-5):</label>
                <br />
                <label htmlFor="costRating">Cost : </label>
                <input name="costRating" type="number" min="1" max="5" required />
                <br />
                <label htmlFor="safetyRating">Safety : </label>
                <input name="safetyRating" type="number" min="1" max="5" required />
                <br />
                <label htmlFor="foodRating">Food : </label>
                <input name="foodRating" type="number" min="1" max="5" required />
                <br />
                <label htmlFor="cleanlinessRating">Cleanliness : </label>
                <input name="cleanlinessRating" type="number" min="1" max="5" required />
                <br />
                <label htmlFor="acAvailable">
                    <input
                        type="checkbox"
                        name="acAvailable"
                        id="acAvailable"
                    /> AC Available
                </label>
                <br />
                <label htmlFor="foodType">Food Type Available: </label>
                <select name="foodType" required>
                    <option value="">Select Food Type</option>
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                    <option value="both">Both</option>
                </select>
                <br />
                <label htmlFor="description"> Additional Information: </label>
                <textarea name="description" rows={4} cols={50}></textarea>
                <br />
                <button type="submit">Add New PG</button>
                <button type="reset" onClick={() => setIsOpen(false)}>Cancel</button>
            </form>
        </Modal>
    )
}