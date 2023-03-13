import CardWithCheckBox from "./CardWithCheckBox";

function CheckBoxRow(props) {
    return (

        <div className={"row"}>
            {props.facilities.map(facility => {
                return (
                    <div className={"col-4 mt-2 mb-2"}  key={facility.id}>
                        <CardWithCheckBox facility={facility}/>
                    </div>
                )
            })}
        </div>


    );
}

export default CheckBoxRow;