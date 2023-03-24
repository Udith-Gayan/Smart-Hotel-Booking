import Card1 from "../../layout/Card";
import facilitiesData from "../../data/facilities"
import CheckBoxRow from "../CheckBoxRow";
import { useState } from "react";

function Facilities(props) {
    const rowsData = [];
    // const [checkedFacilities, setCheckedFacilities] = useState([]);

    for (let i = 0; i < facilitiesData.length; i += 3) {
        const rowItems = facilitiesData.slice(i, i + 3);
        rowsData.push(rowItems);
    }

    const onChangeFacility = (checked, facility) => {
        if (checked) {
            props.setHotelFacilities(prevState => {
                return [...prevState, facility];
            })
        } else {
            props.setHotelFacilities(prevState => {
                return prevState.filter(cur_facility => {
                    return cur_facility.Id !== facility.Id;
                })
            })
        }
    }

    return (
        <section>
            <div className="title_2">Facilities That Are Popular With Guests</div>
            <div className="subtext">Guests look for these facilities the most when they’re searching for properties.
            </div>
            <Card1>
                <div className="title_3">Conveniences</div>

                {rowsData.map(row => {
                    return <CheckBoxRow facilities={row} key={row[0].Id} onChange={onChangeFacility} />
                })}
            </Card1>
            <br />
            {props.hotelFacilitiesInvaid ? <span style={{ color: "red" }}>At least one facility should be selected!</span> : null}



        </section>

    );
}

export default Facilities;