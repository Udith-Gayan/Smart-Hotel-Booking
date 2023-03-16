import { Button, Navbar, NavbarBrand, NavbarText} from "reactstrap";

import "./styles.scss"

function NavBar(props) {
    return (
        <Navbar className="cus_navbar" dark>
            <NavbarBrand href="/" style={{marginLeft: "40px"}}>
                <img
                    alt="logo"
                    src="/Assets/Images/logo.png"
                    style={{
                        height: 70,
                        width: 260
                    }}
                />
            </NavbarBrand>


            <NavbarText className="explore_txt white-text" >Explore</NavbarText>
            <NavbarText className="vacation_txt white-text" >Vacation Rental</NavbarText>
            <NavbarText className="community_txt white-text" >Community</NavbarText>
            <Button outline  className="list_button">List Your Property</Button>
            <Button className="signin_button">Sign in</Button>

        </Navbar>
    );

}

export default NavBar;