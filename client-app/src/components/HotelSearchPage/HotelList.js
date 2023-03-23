import SearchHotelResult from "./SearchHotelResult";

function HotelList(props) {
    return (
        <>
            {props.data.map(hotel => {
                return <SearchHotelResult hotel={hotel} numOfPeople={props.numOfPeople} onViewAvailableClicked={props.onViewAvailableClicked} />
            })}
        </>
    );
}

export default HotelList