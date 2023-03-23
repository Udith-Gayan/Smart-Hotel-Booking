class DateFunctions {
    static monthNames = [
        "Jan", "Feb", "March", "April", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    /*
     Convert 2023-03-17 => March 17
    */
    static convertDateMonthDate = (date_string) => {
        const date = new Date(date_string);


        const monthIndex = date.getMonth();
        const day = date.getDate();

        return `${this.monthNames[monthIndex]} ${day}`;
    }

    static getDaysCountInBetween(fromDate_string, toDate_string) {
        const fromDate = new Date(fromDate_string);
        const toDate = new Date(toDate_string);

        // Calculate the difference in milliseconds
        const diffInMs = Math.abs(toDate.getTime() - fromDate.getTime());

        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;

        return diffInDays;
    }

    static convertDateObjectToDateOnlyString = (dateObject) => {
        let year = dateObject.getFullYear();
        let month = dateObject.getMonth() + 1;
        let day = dateObject.getDate();

        return `${year}-${month}-${day}`
    }


}

export default DateFunctions


