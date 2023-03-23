import { useState } from "react";
import { Button, Navbar, NavbarBrand, NavbarText, Card } from "reactstrap";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import "./styles.scss";

function NavBar(props) {
  const navigate = useNavigate();
  const [registry, setRegistry] = useState(
    "r9T5bQscdYWkY9MFQUNfyoWbHo4ZrP9eqs"
  );
  const [xrp, setXrp] = useState(200);

  const isCustomer = localStorage.getItem("customer");
  return (
    <>
      <Navbar className="cus_navbar" dark>
        <NavbarBrand href="/" style={{ marginLeft: "40px" }}>
          <img
            alt="logo"
            src="/Assets/Images/logo.png"
            style={{
              height: 70,
              width: 260,
            }}
          />
        </NavbarBrand>

        {isCustomer === "true" ? (
          <>
            <NavbarText className="explore_txt white-text">Explore</NavbarText>
            <NavbarText className="vacation_txt white-text">
              Vacation Rental
            </NavbarText>
            <NavbarText className="community_txt white-text">
              Community
            </NavbarText>{" "}
          </>
        ) : (
          <>
            <NavbarText className="help_button">Help</NavbarText>
            <NavbarText className="faq-text">Faq</NavbarText>
          </>
        )}

        <Button
          outline
          className="primaryButton smallMarginLeftRight"
          onClick={() => navigate("/list-property")}
        >
          List Your Property
        </Button>
        <Button
          outline
          className="primaryButton smallMarginLeftRight"
          onClick={() => navigate("/reservations")}
          disabled={isCustomer === ""}
        >
          My Reservations
        </Button>
      </Navbar>
      <Card className={styles.navbox}>
        <small>
          <span className="fontBold">Registry: </span> {registry}
          <hr className={styles.seperator} />
          <span className="fontBold">XRP: </span> {xrp}
        </small>
      </Card>
    </>
  );
}

export default NavBar;
