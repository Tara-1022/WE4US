import { PgPostData } from "./Types";

let styles = {
    form: {
        color: "black"
    }
}

export default function PgPostForm({ handleSubmit, onClose, task, initialData }:
    { handleSubmit: (data: PgPostData) => void, onClose: () => void, task: string, initialData?: PgPostData }) {

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
        <form onSubmit={handleClick} style={styles.form}>
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
            <button type="submit">{task}</button>
            <button type="reset">Reset</button>
            <button onClick={onClose}>Cancel</button>
        </form>
    )
}