import '../styles/layout_styles.scss';
import {FormGroup, Input, Label} from "reactstrap";

function CardWithCheckBox(props) {
    return (
        <div className={"card_with_checkbox"} style={{width: props.width ? props.width : "100%"}}>
            <FormGroup check inline>
                <Input type="checkbox" style={{width:25, height:25}}/>
                &nbsp;&nbsp;&nbsp;
                <Label check>
                    {props.facility.text}
                </Label>
            </FormGroup>
        </div>
    );
}

export default CardWithCheckBox;