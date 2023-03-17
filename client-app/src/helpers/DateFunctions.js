class DateFunctions {
    static monthNames = [
        "Jan", "Feb", "March", "April", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    /*
     Convert 2023/03/17 => March 17
    */
    static convertDateMonthDate = (date_string) => {
        const date = new Date(date_string);


        const monthIndex = date.getMonth();
        const day = date.getDate();

        return `${this.monthNames[monthIndex]} ${day}`;
    }
}

export default DateFunctions


