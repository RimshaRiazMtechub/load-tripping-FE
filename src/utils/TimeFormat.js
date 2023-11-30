  // Time Format 
  import moment from "moment/moment";
  export default function TimeFormat(date) {

    // Parse the input string into a Moment.js object
    const dateTime = moment(date);
  
    // Format the time as "h:mm A"
    const formattedTime = dateTime.format('h:mm A');
    return formattedTime;
  }