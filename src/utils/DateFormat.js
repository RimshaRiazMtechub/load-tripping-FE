  // Time Format 
  import moment from "moment/moment";
  export default function DateFormat(date) {

    // Parse the input string into a Moment.js object
    const dateObject = moment(date);
  
    // Format the time as "h:mm A"
    const formatteddate = dateObject.format('D MMM YYYY');
    return formatteddate;
  }