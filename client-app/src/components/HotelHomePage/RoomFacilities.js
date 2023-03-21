import roomFacilitiesData from "../../data/room_facilities"
import CheckBoxRow from "../CheckBoxRow";

function RoomFacilities(props) {
    const rowsData = [];

    for (let i = 0; i < roomFacilitiesData.length; i += 3) {
        const rowItems = roomFacilitiesData.slice(i, i + 3);
        rowsData.push(rowItems);
    }


    return (
        <section>
            <div className="title_3">Room Facilities</div>

            {rowsData.map(row => {
                return <CheckBoxRow facilities={row} key={row[0].Id} onChange={props.onChange}/>
            })}


        </section>

    );
}

export default RoomFacilities;