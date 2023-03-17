import Hotel from "./Hotel";

function HotelList(props) {
    return (
        <>
            {props.data.map(hotel => {
                return <Hotel hotel={hotel} numOfPeople={props.numOfPeople}/>
            })}
        </>
    );
}

export default HotelList