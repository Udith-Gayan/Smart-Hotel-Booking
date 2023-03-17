import ImagePreview from "./ImagePreview";

function ImagePreviewSection(props) {
    return (
        <>
            {props.images.map(image =>
                <ImagePreview image={image} key={image.lastModified}/>
            )}
        </>

    );
}

export default ImagePreviewSection;