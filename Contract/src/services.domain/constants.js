const RequestTypes = {
    HOTEL: "Hotel",
    ROOM: "Room",
    CUSTOMER: "Customer"
}

const RequestSubTypes = {
    REQUEST_TOKEN_OFFER: "RequestTokenOffer",
    REGISTRATION_CONFIRMATION: "RegistrationConfirmation",
    GET_HOTELS: "GetHotels",
    DEREG_HOTEL: "DeregHotel",

    GET_ROOMS: "GetRooms",
    CREATE_ROOM: "CreateRoom",
    EDIT_ROOM: "EditRoom",
    DELETE_ROOM: "DeleteRoom",

    CREATE_CUSTOMER: "CreateCustomer",
    EDIT_CUSTOMER: "EditCustomer",
    DELETE_CUSTOMER: "DeleteCustomer",
    GET_CUSTOMERS: "GetCustomers"

}

const FacilityStatuses = {
    AVAILABLE: "Available",
    UNAVAILABLE: "UnAvaialble",
}

module.exports = {
    RequestTypes,
    RequestSubTypes,
    FacilityStatuses
}