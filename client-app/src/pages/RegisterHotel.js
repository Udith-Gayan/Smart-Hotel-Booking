import MainContainer from "../layout/MainContainer";
import Card1 from "../layout/Card";
import "../styles/text_styles.scss";
import "../styles/layout_styles.scss";
import React, {useState, useCallback} from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Button,
  Col,
  Row,
  FormFeedback,
} from "reactstrap";
import Facilities from "../components/RegisterHotelComponents/Facilities";
import ContactDetails from "../components/RegisterHotelComponents/ContactDetails";
import PropertyPhotos from "../components/RegisterHotelComponents/PropertyPhotos";
import HotelService from "./../services-domain/hotel-service copy";
import { FirebaseService } from "../services-common/firebase-service";
import { useNavigate } from "react-router-dom";
import ImagePreviewSection from "../components/RegisterHotelComponents/ImagePreviewSection";
import { toast } from "react-hot-toast";
import ToastInnerElement from "../components/ToastInnerElement/ToastInnerElement";
import ToastViewHotelWallet from "../components/ToastViewHotelWallet/ToastViewHotelWallet";

function RegisterHotel() {
  const hotelService = HotelService.instance;
  let emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  let phoneNoRegex = new RegExp("^[0-9 ]*$");
  const navigate = useNavigate();

  let user = "User";
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [registerButtonDisable, setRegisterButtonDisable] = useState(false);

  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [StarRate, setStarRate] = useState("");
  const [OwnerName, setOwnerName] = useState("");
  const [Email, setEmail] = useState("");
  const [AddressLine1, setaddressLine1] = useState("");
  const [AddressLine2, setaddressLine2] = useState("");
  const [City, setCity] = useState("");
  const [ContactNumber1, setContactNumber1] = useState("");
  const [ContactNumber2, setContactNumber2] = useState("");
  const [DistanceFromCenter, setDistanceFromCenter] = useState(0);

  const [HotelFacilities, setHotelFacilities] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  const [isCondition1Checked, setIsCondition1Checked] = useState(false);
  const [isCondition2Checked, setIsCondition2Checked] = useState(false);

  const [propertyNameInvaid, setPropertyNameInvaid] = useState(false);
  const [propertyDescriptionInvaid, setPropertyDescriptionInvaid] =
    useState(false);
  const [ownerNameInvaid, setOwnerNameInvaid] = useState(false);
  const [emailInvaid, setEmailInvaid] = useState(false);
  const [contactNumber1Invaid, setContactNumber1Invaid] = useState(false);
  const [addressLine1Invaid, setAddressLine1Invaid] = useState(false);
  const [cityInvaid, setCityInvaid] = useState(false);
  const [distanceFromCenterInvaid, setDistanceFromCenterInvaid] =
    useState(false);
  const [hotelFacilitiesInvaid, setHotelFacilitiesInvaid] = useState(false);
  const [uploadedImagesInvaid, setUploadedImagesInvaid] = useState(false);

  const toggleDropDown = () => {
    setDropDownOpen((prevState) => !prevState);
  };

  const onChangeUploadImages = (images) => {
    setUploadedImages((prevState) => [...prevState, ...images]);
  };

  const validationForm = () => {
    setPropertyNameInvaid(false);
    setPropertyDescriptionInvaid(false);
    setOwnerNameInvaid(false);
    setEmailInvaid(false);
    setContactNumber1Invaid(false);
    setAddressLine1Invaid(false);
    setCityInvaid(false);
    setDistanceFromCenterInvaid(false);
    setHotelFacilitiesInvaid(false);
    setUploadedImagesInvaid(false);

    if (!Name) {
      setPropertyNameInvaid(true);
    }
    if (!Description) {
      setPropertyDescriptionInvaid(true);
    }
    if (!OwnerName) {
      setOwnerNameInvaid(true);
    }
    if (!emailRegex.test(Email)) {
      setEmailInvaid(true);
    }

    if (!phoneNoRegex.test(ContactNumber1)) {
      setContactNumber1Invaid(true);
    }

    if (!(ContactNumber1.length === 10 || ContactNumber1.length === 11)) {
      setContactNumber1Invaid(true);
    }
    if (!AddressLine1) {
      setAddressLine1Invaid(true);
    }
    if (!City) {
      setCityInvaid(true);
    }
    if (!DistanceFromCenter) {
      setDistanceFromCenterInvaid(true);
    }

    if (HotelFacilities.length <= 0) {
      setHotelFacilitiesInvaid(true);
    }
    if (uploadedImages.length < 3) {
      setUploadedImagesInvaid(true);
    }
  };

  // Form submit
  const submitForm = useCallback(async () => {
    setRegisterButtonDisable(true);

    validationForm();

    if (!propertyNameInvaid) {
      console.log("submit");
    }

    try {
      // 1 - Upload Images
      let imageUrls = [];
      let res;

      if (uploadedImages.length > 0)
        imageUrls = await FirebaseService.uploadFiles(Name, uploadedImages);

      // 2 - Generate a wallet Address
      const newWallet = await hotelService.createNewHotelWallet();
      localStorage.setItem("isCustomer", "false");
      localStorage.setItem("seed", newWallet.seed);

      console.log(newWallet);

      // 3 - Create request object
      const submissionData = {
        HotelWalletAddress: newWallet.address,
        Name: Name,
        Description: Description,
        OwnerName: OwnerName,
        Email: Email,
        AddressLine1: AddressLine1,
        AddressLine2: AddressLine2,
        City: City,
        ContactNumber1: ContactNumber1,
        ContactNumber2: ContactNumber2,
        DistanceFromCenter: DistanceFromCenter,
      };

      if (imageUrls.length > 0) submissionData.ImageUrls = imageUrls;

      if (HotelFacilities.length > 0)
        submissionData.Facilities = HotelFacilities;

      // only if the required validations are met, form will submit
      if (
        Name &&
        Description &&
        OwnerName &&
        emailRegex.test(Email) &&
        AddressLine1 &&
        City &&
        (ContactNumber1.length === 10 || ContactNumber1.length === 11) &&
        phoneNoRegex.test(ContactNumber1) &&
        DistanceFromCenter &&
        HotelFacilities.length > 0 &&
        uploadedImages.length > 2
      ) {
        // 4 - Submit for registration
        res = await hotelService.registerHotel(submissionData);
        console.log("res", res);
        if (res.hotelId > 0) {
          //alert("Successful");
          toast.success("Registered successfully!", {
            duration: 10000,
          });
          toast(
              (element) => (
                  <ToastViewHotelWallet
                      warningMessage={"You can close this, if you have copied and saved these secrets somewhere safely. You  cannot get these once closed."}
                      walletSecret={newWallet.seed}
                      walletAddress={newWallet.address}
                      id={element.id}  />
              ),
              {
                duration: Infinity,
              }
          );

          navigate(`/hotel/${res.hotelId}`);
        } else {
          toast(
              (element) => (
                  <ToastInnerElement message={"Registration failed!"} id={element.id}/>
              ),
              {
                  duration: Infinity,
              }
          );
          //alert("Registration failed!");
        }
      } else {
        setRegisterButtonDisable(false);
        toast(
            (element) => (
                <ToastInnerElement message={"Check the details again!"} id={element.id}/>
            ),
            {
                duration: Infinity,
            }
        );
      }
    } catch (err) {
      setRegisterButtonDisable(false);
      console.log(err);
      toast(
          (element) => (
              <ToastInnerElement message={"Error occurred in Registration.!"} id={element.id}/>
          ),
          {
              duration: Infinity,
          }
      );
      //alert("Error occurred in Registration.!");
    }
  }, [
    Name,
    StarRate,
    Description,
    OwnerName,
    Email,
    AddressLine1,
    AddressLine2,
    City,
    ContactNumber1,
    ContactNumber2,
    DistanceFromCenter,
    HotelFacilities,
    uploadedImages,
  ]);

  return (
    <>
      <MainContainer>
        {/* {!newWallet ? <div className="spinnerWrapper">
          <Spinner
            color="primary"
            style={{
              height: "3rem",
              width: "3rem",
            }}
            type="grow"
          >
            Loading...
          </Spinner>
        </div>: null} */}

        <section>
          <div className="title_1">Welcome {user}!</div>
          <Card1>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="property_name" className="noMargin">
                    Name of Your Property
                  </Label>
                  <div className="subtext">
                    Guests will see this name when they search for a place to
                    stay.
                  </div>
                  <Input
                    type="text"
                    id="property_name"
                    onChange={(e) => setName(e.target.value)}
                    invalid={propertyNameInvaid}
                  />
                  <FormFeedback>
                    Name of your property is required!
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <Label className="noMargin"> Star Rating</Label>
                <div className="subtext">Current rating of the hotel.</div>
                <div>
                  <Dropdown isOpen={dropDownOpen} toggle={toggleDropDown} group>
                    <button style={{ width: "100px", border: "none" }}>
                      {StarRate || "Select"}
                    </button>
                    <DropdownToggle caret color={"black"}></DropdownToggle>
                    <DropdownMenu style={{ width: "50%" }}>
                      <DropdownItem
                        className="dropdown_items"
                        onClick={(e) => setStarRate("1 Star")}
                      >
                        1 Star
                      </DropdownItem>
                      <DropdownItem
                        className="dropdown_items"
                        onClick={(e) => setStarRate("2 Star")}
                      >
                        2 Star
                      </DropdownItem>
                      <DropdownItem
                        className="dropdown_items"
                        onClick={(e) => setStarRate("3 Star")}
                      >
                        3 Star
                      </DropdownItem>
                      <DropdownItem
                        className="dropdown_items"
                        onClick={(e) => setStarRate("4 Star")}
                      >
                        4 Star
                      </DropdownItem>
                      <DropdownItem
                        className="dropdown_items"
                        onClick={(e) => setStarRate("5 Star")}
                      >
                        5 Star
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </Col>
            </Row>
            <FormGroup>
              <Label style={{ marginTop: "10px" }}>Description</Label>
              <Input
                type="textarea"
                className={"text_area"}
                name="postContent"
                rows={5}
                invalid={propertyDescriptionInvaid}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormFeedback>Hotel description is required!</FormFeedback>
            </FormGroup>
          </Card1>
        </section>

        <ContactDetails
          setOwnerName={setOwnerName}
          setEmail={setEmail}
          setContactNumber1={setContactNumber1}
          setContactNumber2={setContactNumber2}
          setaddressLine1={setaddressLine1}
          setaddressLine2={setaddressLine2}
          setCity={setCity}
          setDistanceFromCenter={setDistanceFromCenter}
          ownerNameInvaid={ownerNameInvaid}
          emailInvaid={emailInvaid}
          contactNumber1Invaid={contactNumber1Invaid}
          addressLine1Invaid={addressLine1Invaid}
          cityInvaid={cityInvaid}
          distanceFromCenterInvaid={distanceFromCenterInvaid}
        />

        <Facilities
          setHotelFacilities={setHotelFacilities}
          hotelFacilitiesInvaid={hotelFacilitiesInvaid}
        />

        {/* <PropertyPhotos setImages={setImages} /> */}
        <PropertyPhotos
          onChangeUploadImages={onChangeUploadImages}
          uploadedImagesInvaid={uploadedImagesInvaid}
        />
        {uploadedImages.length !== 0 && (
          <ImagePreviewSection images={uploadedImages} />
        )}

        <section>
          <h5 style={{ lineHeight: "25px" }}>
            You’re almost done.
            <br />
            To complete your registration, check the boxes below:
          </h5>

          <div className={"pt-3"} style={{ marginLeft: "20px" }}>
            <FormGroup check inline>
              <Input
                type="checkbox"
                style={{ width: 25, height: 25 }}
                onChange={(e) => setIsCondition1Checked(e.target.checked)}
              />
              &nbsp;&nbsp;&nbsp;
              <Label check style={{ lineHeight: "20px" }}>
                <p>
                  I certify that this is a legitimate accommodation business
                  with all necessary licenses and permits, which can be shown
                  upon first request.
                  <br /> VoyageLanka reserves the right to verify and
                  investigate any details provided in this registration.
                </p>
              </Label>
            </FormGroup>
          </div>

          <div className={"pt-3"} style={{ marginLeft: "20px" }}>
            <FormGroup check inline>
              <Input
                type="checkbox"
                style={{ width: 25, height: 25 }}
                onChange={(e) => setIsCondition2Checked(e.target.checked)}
              />
              &nbsp;&nbsp;&nbsp;
              <Label check>
                <p style={{ lineHeight: "35px" }}>
                  I have read, accepted, and agreed to the Terms & Policies.
                </p>
              </Label>
            </FormGroup>
          </div>
        </section>

        <div className={"row center_div pt-3"}>
          <Button
            className="secondaryButton"
            style={{ width: "650px" }}
            disabled={
              registerButtonDisable ||
              !(isCondition1Checked && isCondition2Checked)
            }
            onClick={submitForm}
          >
            Complete Hotel Registration
          </Button>
        </div>
      </MainContainer>
    </>
  );
}

export default RegisterHotel;
