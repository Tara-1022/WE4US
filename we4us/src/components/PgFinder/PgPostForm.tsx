import { PgPostData } from "./Types";
import "../../styles/PgFinderPage.css";

export default function PgPostForm({ handleSubmit, onClose, task, initialData,mode = "edit",}:
    { handleSubmit: (data: PgPostData) => void, onClose: () => void, task: string, initialData?: PgPostData,  mode?: "edit" | "create";}) {

    function handleClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const entries = Object.fromEntries(formData);

        handleSubmit({
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
        <form onSubmit={handleClick} className="pg-modal-form">
            <label htmlFor="name"> Name of the PG: </label>
            <input name="name" required defaultValue={initialData?.name || undefined} />
            <br />
            <label htmlFor="location">Location: </label>
            <input name="location" required defaultValue={initialData?.body.location || undefined} />
            <br />
            <label htmlFor="mapUrl"> Map URL : </label>
            <input name="mapUrl" type="url" required defaultValue={initialData?.url || undefined} />
            <br />
            <label htmlFor="acAvailable">
                <input
                    type="checkbox"
                    name="acAvailable"
                    id="acAvailable"
                    defaultValue={initialData?.body.acAvailable ? 'on' : undefined}
                /> AC Available
            </label>
            <br />
            <label htmlFor="foodType">Food Type Available: </label>
            <select name="foodType" required
                defaultValue={initialData?.body.foodType || undefined}
            >
                <option value={undefined}>Select Food Type</option>
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
                <option value="both">Both</option>
            </select>
            <br />
            <label htmlFor="description"> Additional Information: </label>
            <textarea name="description" rows={4} cols={50} defaultValue={initialData?.body.description || undefined} />
            <br />
            <div className="pg-modal-form-buttons">
                <button type="submit">{task}</button>
                {mode === "edit" && <button type="reset">Reset</button>}
                <button className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
        </form>
    )
}