function ImagePreview(props) {
    const convertToDateString = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    const getSize = (size) => {
        return (size / (1024 * 1024)).toFixed(2).toString() + "Mb";
    }
    return (
        <div className={"row"} style={{display: "flex", alignItems: "center"}}>
            <div className={"col-2"} style={{width: "200px"}}>
                <img
                    src={window.URL.createObjectURL(props.image)}
                    width={"168px"}
                    height={"112px"}
                />
            </div>

            <div className={"col-6 "}>
                <div className={"row image_name"}>

                    {props.image.name}
                </div>

                <div className={"row image_subtext"}>
                    {convertToDateString(props.image.lastModified) + " " + getSize(props.image.size)}
                </div>
            </div>

            <hr className={"mt-3 mb-3"}/>
        </div>

    );
}

export default ImagePreview;