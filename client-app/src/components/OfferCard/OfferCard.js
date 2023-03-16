import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { IoCalendarOutline, FaBed } from "react-icons/io5";
import { IoMdBed } from "react-icons/io";
import "./styles.scss";

function OfferCard(props) {

    return (
        <Card className="offer_card">
            <div style={{ padding: '10px' }}>
                <img src="Assets/Images/dashboard/Kandalama.png" alt="offer" width="300" height="200" ></img>
                <CardBody style={{ paddingLeft: "0px", paddingRight: "0px"}}>
                    <CardTitle tag="h5">
                        props.Name
                    </CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                        props.AddressLine1, props.City
                    </CardSubtitle>
                    <p  className="m-0 offer-details"> <span style={{fontSize: "20px"}}><IoCalendarOutline /></span> 01st Feb - 28th Feb </p>
                    <p className="m-0 offer-details"> <span style={{fontSize: "20px"}}><IoMdBed /></span> props.BedType </p>
                </CardBody>
            </div>
        </Card>
    )
}

export default OfferCard;