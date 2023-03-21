import CardWithCheckBox from "./CardWithCheckBox";

function CheckBoxRow(props) {
    return (
        <div className={"row"}>
            {props.facilities.map(facility => {
                return (
                    <div className={"col-4 mt-2 mb-2"} key={facility.Id}>
                        <CardWithCheckBox facility={facility} onChange={props.onChange ? props.onChange : null}
                                          readOnly={props.readOnly ? props.readOnly : false}/>
                    </div>
                )
            })}
        </div>


    );
}

export default CheckBoxRow;