import Card1 from "../../layout/Card";
import facilitiesData from "../../data/facilities"
import CheckBoxRow from "../CheckBoxRow";

function FacilitiesReadOnly(props) {
    const rowsData = [];

    const facilityData = facilitiesData.filter(fc => props.selectedFacilityIds.includes(fc.Id))

    for (let i = 0; i < facilityData.length; i += 3) {
        const rowItems = facilityData.slice(i, i + 3);
        rowsData.push(rowItems);
    }

    return (
        <section ref={props.facilitiesSection} id="facilities_section">
            <div className="title_2 pt-2 pb-2">Facilities</div>
            <Card1>
                {rowsData.map(row => {
                    return <CheckBoxRow facilities={row} key={row[0].Id} readOnly={true}/>
                })}
            </Card1>


        </section>

    );
}

export default FacilitiesReadOnly;