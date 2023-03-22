import SearchHotelResult from "./SearchHotelResult";

function HotelList(props) {
    return (
        <>
            {props.data.map(hotel => {
                return <SearchHotelResult hotel={hotel} numOfPeople={props.numOfPeople}/>
            })}
        </>
    );
}

export default HotelList