import React from "react";

const HotelImages = ({ images }) => {
    const styles = {
        container: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
        },
        image: {
            width: "32%",
            height: "280px",
            objectFit: "cover",
            borderRadius: "5px",
        },
    };

    return (
        <div style={styles.container}>
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Hotel image ${index}`}
                    style={styles.image}
                />
            ))}
        </div>
    );
};

export default HotelImages;