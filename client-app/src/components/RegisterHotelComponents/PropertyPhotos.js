import Card1 from "../../layout/Card";
import FileUploader from "./FileUploader";

function PropertyPhotos(props) {
  return (
    <section>
      <div className="title_2">Property Photos</div>
      <div className="subtext" style={{ lineHeight: "18px" }}>
        Great photos invite guests to get the full experience of your property,
        so upload some high-resolution photos that represent all your property
        has to offer.
      </div>
      <Card1>
        <div className={"title_3"}>Upload Photos</div>
        <FileUploader onChangeUploadImages={props.onChangeUploadImages} />

        <div className={"title_3 pt-2 pb-2"}>Files</div>
      </Card1>
      <br />
      {props.uploadedImagesInvaid ? (
        <span style={{ color: "red" }}>
          At least 3 photos should be uploaded!
        </span>
      ) : null}
    </section>
  );
}

export default PropertyPhotos;
