import { JobPostData } from "./PostCreationHandler";
import Modal from "react-modal";
import { Dispatch, SetStateAction } from "react";

let styles = {
    form: {
        color: "black"
    }
};

export default function CreatePostModal({ isOpen, setIsOpen, handleCreation }:
    { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, handleCreation: (data: JobPostData) => void }) {

    function handleClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { url, company, role, location, experience, description, open, referral, deadline, job_link, internship_duration, name } = Object.fromEntries(formData);

        handleCreation({
            url: url.toString(),
            name: name.toString(),
            body: {
                company: company.toString(),
                role: role.toString(),
                location: location.toString(),
                experience: experience?.toString(),
                open: open === "on",
                referral: referral === "on",
                deadline: deadline?.toString(),
                job_link: job_link?.toString(),
                internship_duration: internship_duration?.toString(),
                description: description.toString()
            }
        });
    }

    return (
        <Modal isOpen={isOpen} contentLabel="Create Job Post">
            <form onSubmit={handleClick} style={styles.form}>
                <label htmlFor="name">Title</label>
                <input name="name" required />
                <br />
                <label htmlFor="url">URL</label>
                <input name="url" />
                <br />
                <label htmlFor="company">Company</label>
                <input name="company" required />
                <br />
                <label htmlFor="role">Role</label>
                <input name="role" required />
                <br />
                <label htmlFor="location">Location</label>
                <input name="location" required />
                <br />
                <label htmlFor="experience">Experience Required</label>
                <input name="experience" />
                <br />
                <label htmlFor="open">Job Open?</label>
                <input name="open" type="checkbox" />
                <br />
                <label htmlFor="referral">Referral Available?</label>
                <input name="referral" type="checkbox" />
                <br />
                <label htmlFor="deadline">Deadline</label>
                <input name="deadline" type="date" />
                <br />
                <label htmlFor="job_link">Job Link</label>
                <input name="job_link" type="url" />
                <br />
                <label htmlFor="internship_duration">Internship Duration(if applicable)</label>
                <input name="internship_duration" />
                <br />
                <label htmlFor="description">Description</label>
                <textarea name="description" required />
                <br />
                <button type="submit">Create Job Post</button>
                <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
            </form>
        </Modal>
    );
}
