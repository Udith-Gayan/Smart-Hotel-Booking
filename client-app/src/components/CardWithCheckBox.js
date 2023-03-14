import '../styles/layout_styles.scss';
import {FormGroup, Input, Label} from "reactstrap";
import {useState} from "react";

function CardWithCheckBox(props) {
    const [checked, setChecked] = useState(props.facility.status ? props.facility.status : false);
    const onChange = (event) => {
        if(props.readOnly)
            return;
        setChecked(event.target.checked);
        if (props.onChange === null)
            return;
        props.onChange(event.target.checked, props.facility);
    }
    return (
        <div className={"card_with_checkbox"} style={{width: props.width ? props.width : "100%"}}>
            <FormGroup check inline>
                <Input type="checkbox" style={{width: 25, height: 25}} checked={checked}
                       disabled={props.readOnly}
                       onChange={onChange}/>
                &nbsp;&nbsp;&nbsp;
                <Label check>
                    {props.facility.Name}
                </Label>
            </FormGroup>
        </div>
    );
}

export default CardWithCheckBox;