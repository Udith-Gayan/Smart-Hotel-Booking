import Card1 from "../../layout/Card";
import facilitiesData from "../../data/facilities"
import CheckBoxRow from "../CheckBoxRow";

function FacilitiesReadOnly(props) {
    const rowsData = [];

    for (let i = 0; i < facilitiesData.length; i += 3) {
        const rowItems = facilitiesData.slice(i, i + 3);
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