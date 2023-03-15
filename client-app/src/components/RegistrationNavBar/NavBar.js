import { Button, Navbar, NavbarBrand, NavbarText} from "reactstrap";

import "./styles.scss"

function NavBar(props) {
    return (
        <Navbar className="reg_navbar" dark>
            <NavbarBrand href="/">
                <img
                    alt="logo"
                    src="/Assets/Images/logo.png"
                    style={{
                        height: 70,
                        width: 260
                    }}
                />
            </NavbarBrand>
            <Button outline  className="help_button">Help</Button>
            <NavbarText className="faq-text">FAQ</NavbarText>

        </Navbar>
    );

}

export default NavBar;