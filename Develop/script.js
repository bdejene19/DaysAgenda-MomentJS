


/**
 * during interval check if new hour has occured => if so run setTimeBlockColors;
 * 
 * setTimeBlock pseudo:
 * pass moment format hour to verify color of time blocks
 * check moment response to get index latest times
 * use index to color/validate blocks 
 */
let plannerStoreName = 'saved-events'
let hourBlocks = $('#timeblock-insert').children().children('input');

const setTimeBlockColors = (hourMoment) => {
    let currHour = hourMoment;
    $.each(hourBlocks, (index, hour) => {
        let blockTimeVal = parseInt(hour.dataset.time);
        if (blockTimeVal < currHour) {
            $(hour).css("background-color", "orangered");
        } else if (blockTimeVal === currHour) {
            $(hour).css("background-color", "orange");

        } else {
            $(hour).css("background-color", "lime");

        }
    })
}

/**
 * saving event from user input to local storage => 
 * Need to getItems from input to load any saved data
 * Data will be a time object with hours of the days as it's key 
 * When user changes input and clicks save button, want to targeted event value and update value time block in local storage
 * 
 * 
 * 
 * first create savedEventTimes object
 * create function to get values from local storage
 */

 let savedEventTimes = {};

const generateLocalStore = (storeName) => {
    let counter = 9;
    while (counter < 24) {
        savedEventTimes[counter] = '';
        counter++;
    }

    setLocalStorage(storeName, savedEventTimes);
}
const setLocalStorage = (storeName, dataSaved) => {
    if (typeof(dataSaved) === "string") {
        localStorage.setItem(storeName, dataSaved);
    } else {
        localStorage.setItem(storeName, JSON.stringify(dataSaved));
    }
}
const getFromLocalStorage = (storeName) => {
    let storeValue = localStorage.getItem(storeName);
    return storeValue
}
// savedEventTimes['9'] = 'this is a test run';

const getEventValues = () => {
    let savedEvents = getFromLocalStorage(plannerStoreName);
    savedEvents = JSON.parse(savedEvents);
    Object.keys(savedEventTimes).map((key, index) => {
        let currBlockHour = hourBlocks[index];
        if (currBlockHour !== undefined) {
            if (currBlockHour.dataset.time === key) {
                let contentLoaded = savedEvents[key];
                hourBlocks[index].value = contentLoaded
            }
        }
    })
}

/**
 * add event listener to row => delegate to save button in row
 * have button save input val from row selected and 
 * @param {*} event 
 */

// targeting all rows in planner 
const saveEventToLocal = (event) => {
    let eventChildren = $(event.target).parent().parent();
    let inputEl = eventChildren.children('input');
    let newEventSaved = $(inputEl).val();
    let time = inputEl.attr('data-time');

    
    let myStore = getFromLocalStorage(plannerStoreName);
    myStore = JSON.parse(myStore);
    myStore[`${time}`] = newEventSaved;

    setLocalStorage(plannerStoreName, myStore);
    console.log(getFromLocalStorage(plannerStoreName));
    // myStore[timeEl] = 'helllo'


}

let allRows = $('#timeblock-insert').children();

allRows.on('click', '.save-event', saveEventToLocal)


const getCurrentTime = () => {
    setLocalStorage(plannerStoreName, savedEventTimes);
    let hourMoment = moment();
    let currentHour = hourMoment.format('HH');
    currentHour = parseInt(currentHour);
    let currDay = $('#currentDay');

    setTimeBlockColors(currentHour);


    let timeTracker = setInterval(() => {
        let newHour = moment();
        currDay.text(newHour.format('MMM Do YY hh:mm:ss'));
        let hourCheck = newHour.format('HH');
        if (currentHour === parseInt(hourCheck) - 1) {
            currentHour = hourCheck;
            setTimeBlockColors(currentHour);
        }
    }, 1000)

    if (getFromLocalStorage(plannerStoreName) !== generateLocalStore(plannerStoreName)) {
        console.log(getFromLocalStorage(plannerStoreName))

        // console.log(getFromLocalStorage(plannerStoreName))
    } else {
        generateLocalStore(plannerStoreName);
    }

    
}


getCurrentTime();

