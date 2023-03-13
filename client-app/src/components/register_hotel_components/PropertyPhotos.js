import Card1 from "../../layout/Card";
import FileUploader from "./FileUploader";
import ImagePreview from "./ImagePreview";
import {useState} from "react";
import ImagePreviewSection from "./ImagePreviewSection";

function PropertyPhotos(props) {
    const [uploadedImages, setUploadedImages] = useState([]);
    const onChangeUploadImages = (images) => {
        setUploadedImages((prevState) => [...prevState, ...images]);
    }
    return (
        <section>
            <div className="title_2">Property Photos</div>
            <div className="subtext" style={{lineHeight: "18px"}}>Great photos invite guests to get the full experience
                of your property, so upload
                some high-resolution photos that represent all your property has to offer.
            </div>
            <Card1>
                <div className={"title_3"}>Upload Photos</div>
                <FileUploader onChangeUploadImages={onChangeUploadImages}/>

                <div className={"title_3 pt-2 pb-2"}>Files</div>

                {uploadedImages.length !== 0 && <ImagePreviewSection images={uploadedImages}/>}

            </Card1>


        </section>

    );
}

export default PropertyPhotos;