import React from 'react';

import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button } from 'reactstrap'

const FileUploader = props => {

    const hiddenFileInput = React.useRef(null);

    const handleClickUploadImagesArea = event => {
        hiddenFileInput.current.click();
    };

    const handleUploadImages = event => {
        props.onChangeUploadImages(event.target.files);
    };

    return (
        <React.Fragment>
            <div className={"image_uploader_container"} onClick={handleClickUploadImagesArea}>
                <div className={"row"}>
                    <FaCloudUploadAlt size={60} color={"#B7B7C8"} />
                </div>

                <div className={"row center_div title_3 pt-4 pb-4"} style={{ lineHeight: "20px", fontSize: "16px" }}>
                    <b>Drag and drop your photos here<br />
                        or</b>
                </div>

                <div className={"row center_div"}>
                    <Button className='secondaryButton' style={{ width: "180px" }}>Add Photos</Button>
                </div>

                <div className={"row center_div pt-3"}>
                    <div className={"subtext"} style={{ color: "#333333" }}>+ Add at least 3 photos</div>
                </div>
            </div>
            <input
                type="file"
                multiple
                ref={hiddenFileInput}
                onChange={handleUploadImages}
                style={{ display: 'none' }}
            />
        </React.Fragment>
    );
}
export default FileUploader;
