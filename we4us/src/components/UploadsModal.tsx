import { useEffect, useState } from "react";
import { ImageDetailsType, constructImageUrl, deleteImage, listUserUploads } from "../library/ImageHandling";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader, X } from 'lucide-react';
import Modal from "react-modal";
import { DEFAULT_POSTS_PER_PAGE } from "../constants";
import "../styles/UploadsModal.css"

function ImageItem({ image, onDelete }: { image: ImageDetailsType, onDelete: (image: ImageDetailsType) => void }) {
    return (
        <div className="image-item">
            <div className="image-container">
                <a href={constructImageUrl(image)} target="_blank" rel="noopener noreferrer">
                    <img
                        src={constructImageUrl(image)}
                        alt="Uploaded Image"
                        className='image'
                        title='Click to view full image' />
                </a>
            </div>
            <button className="image-deletor" onClick={
                async () => {
                    if (window.confirm("Image will be deleted permanently."
                        + " This can affect your posts, reviews and profile.")) {
                        if (await deleteImage(image, false)) {
                            onDelete(image)
                            window.alert("Successful");
                        }
                        else window.alert("Could not delete");
                    }
                }}>
                Delete
            </button>
        </div >
    )
}

export function UploadsList() {
    const [images, setImages] = useState<ImageDetailsType[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(
        () => {
            listUserUploads({ page, limit: DEFAULT_POSTS_PER_PAGE })
                .then(
                    (newImages) => {
                        setImages([...images, ...newImages])
                        if (newImages.length <= DEFAULT_POSTS_PER_PAGE) setHasMore(false)
                    }
                )
        }, [page]
    )

    if (images.length == 0) return <h4>You haven't uploaded any images yet!</h4>

    const list = images.map(
        (image) => <li key={image.filename} className="list-item">
            <ImageItem image={image} onDelete={
                (deletedImage) => setImages(
                    images.filter(image => !(
                        image.filename == deletedImage.filename
                        && image.deleteToken == deletedImage.deleteToken
                    )
                    )
                )
            } />
        </li>
    )

    return <div className="uploads-container" >
        <InfiniteScroll
            dataLength={images.length}
            next={() => setPage(page + 1)}
            hasMore={hasMore}
            loader={<Loader />
            }
        >
            {list}
        </InfiniteScroll>
    </div>
}

export default function UploadsModal() {

    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <span
                onClick={() => setIsOpen(true)}
                className="see-uploads-text">See uploads</span>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
            >
                <div className="header" >
                    <h3>Uploads</h3>
                    <button
                        className="close-modal"
                        onClick={() => setIsOpen(false)}
                    >
                        <X />
                    </button>
                </div>
                <UploadsList />
            </Modal >
        </>
    )
}