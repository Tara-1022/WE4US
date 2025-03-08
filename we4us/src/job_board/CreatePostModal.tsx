import { JobPostData } from "./PostCreationHandler";
import Modal from "react-modal";

let styles={
    form:{
        color:"black"
    }
}

export default function CreatePostModal({ isOpen, setIsOpen, handleCreation }:
    { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, handleCreation: (data: JobPostData) => void }) {

    function handleClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { url, body, extra, name, number, yes_no } = Object.fromEntries(formData);
        handleCreation({
            url: url.toString(),
            name: name.toString(),
            body: {
                body: body.toString(),
                extra_field: extra.toString(),
                yes_no: yes_no? true : false,
                ...(number && {number_field: Number(number)})
            }
        })
    }

    return (
        <Modal
            isOpen={isOpen}
            contentLabel="Login">
            <form onSubmit={handleClick} style={styles.form}>
                <label htmlFor="name"> Title </label>
                <input name="name" required/>
                <br />
                <label htmlFor="url"> URL </label>
                <input name="url" />
                <br />
                <label htmlFor="extra"> Extra field </label>
                <input name="extra" required />
                <br />
                <label htmlFor="body">body</label>
                <input name="body" required />
                <br />
                <label htmlFor="number">number field</label>
                <input name="number" type="number" />
                <br />
                <label htmlFor="yes_no">yes or no?</label>
                <input name="yes_no" type="checkbox" />
                <br />
                <button type="submit">Create Job Post</button>
                <button onClick={() => setIsOpen(false)}>Cancel</button>
            </form>
        </Modal>
    )
}