
/**
 * during interval check if new hour has occured => if so run setTimeBlockColors;
 * 
 * setTimeBlock pseudo:
 * pass moment format hour to verify color of time blocks
 * check moment response to get index latest times
 * use index to color/validate blocks 
 */

const setTimeBlockColors = (hourMoment) => {
    let currHour = hourMoment;
    let hourBlocks = $('#timeblock-insert').children().children('input');
    $.each(hourBlocks, (index, hour) => {
        let blockTimeVal = parseInt(hour.dataset.time);
        if (blockTimeVal < currHour) {
            console.log('function ran')

            $(hour).css("background-color", "orangered");
        }
    })
}

const getCurrentTime = () => {

    let hourMoment = moment();
    let currentHour = hourMoment.format('HH');
    let currDay = $('#currentDay');
    setTimeBlockColors(currentHour);
    let timeTracker = setInterval(() => {
        let secondsMoment = moment();
        currDay.text(secondsMoment.format('MMM Do YY hh:mm:ss'));
        let hourCheck = secondsMoment.format('HH');
        
        if (currentHour ===  - 1) {
            setTimeBlockColors(hourCheck);
            currentHour = hourCheck;
        }

    }, 1000)
}
getCurrentTime();

