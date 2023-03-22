import {roomData} from "../../data/room_data";
import {useState} from "react";
import "./styles.scss"
import DataTable from 'react-data-table-component';

function AvailabilityRooms(props) {

    const columns = [
        {
            name: 'Room type',
            selector: row => row.roomType,
        },
        {
            name: 'Sleeps',
            selector: row => row.sleeps,
        },
        {
            name: 'Price for 1 night',
            selector: row => row.pricePerNight,
        },
        {
            name: 'Select Rooms',
            selector: row => row.selectRooms,
        },
    ];

    const data = [
        {
            id: 1,
            title: 'Beetlejuice',
            year: '1988',
        },
        {
            id: 2,
            title: 'Ghostbusters',
            year: '1984',
        },
    ]

    const [roomDetails, setRoomDetails] = useState(roomData)
    return (
        <div className={"availability_room_section"}>
            <table>
                <tr>
                    <th>Room type</th>
                    <th>Sleeps</th>
                    <th>Price for 1 night</th>
                    <th>Select rooms</th>
                </tr>

                {roomDetails.map(room => {
                    return (
                      <tr>
                          <td>{room.RoomName}</td>
                          <td>{room.Sleeps}</td>
                          <td>{room.PricePerNight}</td>
                          <td>{room.PricePerNight}</td>
                      </tr>
                    );
                })}
            </table>
        </div>
    );
}

export default AvailabilityRooms