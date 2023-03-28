import {useState} from "react";
import {
    Button, Navbar, NavbarBrand, NavbarText, Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import {useNavigate} from "react-router-dom";
import "./styles.scss";
import {RiFileSettingsFill} from 'react-icons/ri'
import {FaCopy} from 'react-icons/fa'
import {CopyToClipboard} from 'react-copy-to-clipboard';

function NavBar(props) {
    const navigate = useNavigate();
    const walletAddress = process.env.REACT_APP_CONTRACT_WALLET_ADDRESS;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const isCustomer = localStorage.getItem("customer");
    const [isCopiedAddress, setIsCopiedAddress] = useState(false);
    return (
        <>
            <Navbar className="cus_navbar" dark>
                <NavbarBrand href="/" style={{marginLeft: "40px"}}>
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
                >
                    My Reservations
                </Button>
                <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={'down'}
                          className="primaryButton setting-button">
                    <DropdownToggle className="primaryButton setting-button" style={{height: '100%'}}>
                        <RiFileSettingsFill style={{fontSize: "1.5rem"}}/> </DropdownToggle>
                    <DropdownMenu style={{marginTop: " 15px"}}>
                        <DropdownItem text>
                            <span className="wallet_address_title">Wallet Address: </span>
                            <span className={"wallet_address"}>{walletAddress}</span>
                            <span className={"copy_button"}>
                                <CopyToClipboard text={walletAddress} onCopy={() => setIsCopiedAddress(true)}>
                                <FaCopy size={"20px"}/>
                            </CopyToClipboard>
                            </span>

                            {isCopiedAddress ? <span className={"subtext"}>Copied</span> : null}

                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Navbar>
        </>
    );
}

export default NavBar;
