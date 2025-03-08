import { JobPostData } from "./PostCreationHandler";
import Modal from "react-modal";

export default function CreatePostModal({ isOpen, setIsOpen, handleCreation }:
    { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, handleCreation: (data: JobPostData) => void }) {

    function handleClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { url, body, extra, name } = Object.fromEntries(formData);
        handleCreation({
            url: url.toString(),
            name: name.toString(),
            body: {
                body: body.toString(),
                extra_field: extra.toString()
            }
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            contentLabel="Login">
            <form onSubmit={handleClick}>
                <label htmlFor="name"> Title </label>
                <input name="name" required/>
                <label htmlFor="url"> URL </label>
                <input name="url" />
                <br />
                <label htmlFor="extra"> Extra field </label>
                <input name="extra" required />
                <br />
                <label htmlFor="body">body</label>
                <input name="body" required />
                <button type="submit">Create Job Post</button>
                <button onClick={() => setIsOpen(false)}>Cancel</button>
            </form>
        </Modal>
    )
}