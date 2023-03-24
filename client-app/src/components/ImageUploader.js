import {useState} from "react"
import {FirebaseService} from "../services-common/firebase-service";

function ImageUploader() {
    const [file, setFile] = useState();
    const [onUploading, setOnUploading] = useState(false);
    const [deleteURL, setDeleteURL] = useState("");
    const [status, setStatus] = useState("");
    const [multipleDeleteURL, setMultipleDeleteUrl] = useState("");
    const [multipleURLs, setMultipleURLs] = useState([]);


    // Handles input change event and updates state
    function handleChange(event) {
        setFile(event.target.files);
    }

    const onClickUpload = () => {
        setStatus("Uploading");
        FirebaseService.uploadFiles("1", file).then((url) => {
            setStatus("Upload success");
        }).catch(err => {
            setStatus("Upload failed");
        })
    }

    const onClickDeleteImage = () => {
        FirebaseService.deleteFile(deleteURL).then((url) => {
            setStatus("Image Deleted")
        }).catch(err => {
            setStatus("Image Delete Error");
            console.log(err);
        })
    }

    function onChangeDeleteURL(event) {
        setDeleteURL(event.target.value);
    }

    function onChangeMultipleDeleteURL(event) {
        setMultipleDeleteUrl(event.target.value);
    }

    const onClickAddURL = () => {
        setMultipleURLs(prevState => {
            return [...prevState, multipleDeleteURL]
        })

        setStatus("File URL added.");

        setMultipleDeleteUrl("");
    }

    const deleteMultipleFiles = () => {
      FirebaseService.deleteFiles(multipleURLs).then(result => {
          setStatus("deleted multiple files.");
      }).catch(err => {
          setStatus("error deleting multiple files");
          console.log(err);
      })
    }


    return (
        <div>
            <br/>
            <br/>
            <input type="file" accept="image/*" multiple onChange={handleChange}/>
            <button onClick={onClickUpload}>Upload to Firebase</button>
            <br/>
            <br/>

            <p style={{color: "red"}}>{status}</p>

            <br/>
            <br/>
            <input type="text" value={deleteURL} onChange={onChangeDeleteURL}/>
            <button onClick={onClickDeleteImage}>Delete File</button>

            <br/>
            <br/>
            <input type="text" value={multipleDeleteURL} onChange={onChangeMultipleDeleteURL}/>
            <button onClick={onClickAddURL}>Add URL</button>

            <br/>

            {multipleURLs.map(url => {
                return <li>{url}</li>
            })}

            <br/>
            <br/>
            <button onClick={deleteMultipleFiles}>Delete All Files</button>




        </div>
    );
}

export default ImageUploader;