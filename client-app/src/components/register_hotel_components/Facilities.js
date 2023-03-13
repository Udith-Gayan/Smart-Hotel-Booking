import Card1 from "../../layout/Card";
import facilitiesData from "../../data/facilities"
import CheckBoxRow from "../CheckBoxRow";

function Facilities(props) {
    const rowsData = [];
    // console.log(facilitiesData.length);


    for (let i = 0; i < facilitiesData.length; i += 3) {
        const rowItems = facilitiesData.slice(i, i + 3);
        rowsData.push(rowItems);
    }

    return (
        <section>
            <div className="title_2">Facilities That Are Popular With Guests</div>
            <div className="subtext">Guests look for these facilities the most when they’re searching for properties.
            </div>
            <Card1>
                <div className="title_3">Conveniences</div>

                {rowsData.map(row => {
                    return <CheckBoxRow facilities={row} key={row[0].id}/>
                })}
            </Card1>


        </section>

    );
}

export default Facilities;