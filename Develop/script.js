


/**
 * during interval check if new hour has occured => if so run setTimeBlockColors;
 * 
 * setTimeBlock pseudo:
 * pass moment format hour to verify color of time blocks
 * check moment response to get index latest times
 * use index to color/validate blocks 
 */

// name of local storage item 
let plannerStoreName = 'saved-events';

// array of input text fields
let hourBlocks = $('#timeblock-insert').children().children('input');

/**
 * 
 * @param {number} hourMoment represents current time of the day
 * Function validates past, present and future hours of the day, setting input background color based on their data-time attribute 
 */
const setTimeBlockColors = (hourMoment) => {
    // current hour
    let currHour = hourMoment;
    // loop through blocks and compare to input block's data attribute => style accordingly 
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

/**
 * 
 * @param {string} storeName represents name of local store to be generated
 * Local store generates initial local store when user does not have it saved on their computer
 * 
 */
const generateLocalStore = (storeName) => {
    let savedEventTimes = {};

    // start from 9 to keep keys of object similar to data-time attribute of input
    let counter = 9;
    while (counter < 24) {
        // inputs empty at beginning => waiting for user to save something
        savedEventTimes[`${counter}`] = '';
        counter++;
    }

    // save object to local storage 
    setLocalStorage(storeName, savedEventTimes);
}

/**
 * 
 * @param {string} storeName 
 * @param {object} dataSaved 
 * 
 * Pass in name of localstorage item and data to be saved
 * If data type is not already string, will stringify it
 * 
 */
const setLocalStorage = (storeName, dataSaved) => {
    if (typeof(dataSaved) === "string") {
        console.log('my data saved: ', dataSaved);
        localStorage.setItem(storeName, dataSaved);
    } else {
        console.log('set my local storage');
        localStorage.setItem(storeName, JSON.stringify(dataSaved));
    }
}

/**
 * 
 * @param {string} storeName 
 * @returns String of local storage value for storeName key
 */
const getFromLocalStorage = (storeName) => {
    let storeValue = localStorage.getItem(storeName);
    return storeValue
}

/**
 * Gets data from local storage and parses it
 * Iterates through data and changes hourblock input values based on localStorage keys
 */
const getEventValues = () => {
    let savedEvents = getFromLocalStorage(plannerStoreName);
    savedEvents = JSON.parse(savedEvents);

    // iterate through local storage keys 
    Object.keys(savedEvents).map((key, index) => {
        let currBlockHour = hourBlocks[index];
        if (currBlockHour !== undefined) {
            // validates it is correct time block, and changes text on UI;
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
 * @param {*} event On click, traverses up and down the dom to get the targets siblings
 * Using the event target (button), it selects its sibling input text value and overrides local storage
 */

// targeting all rows in planner 
const saveEventToLocal = (event) => {
    // get parents of all 3 targets 
    let eventChildren = $(event.target).parent().parent();

    // break down parent into desired elements => input element, it's value, and it's data-time attribute
    let inputEl = eventChildren.children('input');
    let newEventSaved = $(inputEl).val();
    let time = inputEl.attr('data-time');
    time = parseInt(time)
    
    // get local storage to compare and override
    let myStore = getFromLocalStorage(plannerStoreName);
    myStore = JSON.parse(myStore);
    Object.keys(myStore).map(key => {
        if (key == time) {
            // override past myStore key with newEventSaved as it's value
            myStore[key] = newEventSaved;

            // override local storage with updated object
            setLocalStorage(plannerStoreName, myStore);
        }
    })
}

// target all rows on calendar page and delegate click event to 'Floppy Disk' icon => handled by saveEventToLocal
let allRows = $('#timeblock-insert').children();
allRows.on('click', '.save-event', saveEventToLocal)

// main function => handles everything
const getCurrentTime = () => {
    // stores local storage
    let localStoreEvents = localStorage.getItem(plannerStoreName);

    // validating localStorage existence => if it does NOT exist, generateLocalStore()
    if (localStoreEvents === 'undefined' || localStoreEvents === undefined || localStoreEvents === null) {
        generateLocalStore(plannerStoreName);
    }
    
    // create moment to determine color of time blocks
    let hourMoment = moment();

    // formatted moment into 24h format and parsed into number for comparison
    let currentHour = hourMoment.format('HH');
    currentHour = parseInt(currentHour);

    // set color of time input time blocks
    setTimeBlockColors(currentHour);

    // html element that displays current date and time
    let currDay = $('#currentDay');

    // interval fires every 1s to act as real time clock
    let timeTracker = setInterval(() => {
        // create new moment that handles current date and time every second => format: Jan 28th 22 08:00:00
        // updates every second to handle seconds ticking
        let newHour = moment();
        currDay.text(newHour.format('MMM Do YY hh:mm:ss'));

        // create another moment => handles whether or not to fire setTimeBlockColors
        // only reaches conditional if a new hour has occured
        let hourCheck = newHour.format('HH');
        if (currentHour === parseInt(hourCheck) - 1) {
            // update current hour so that conditional is only met again in 1 hour.
            currentHour = hourCheck;
            setTimeBlockColors(currentHour);
        }
    }, 1000);

    // update UI with any previously saved events from local storage
    getEventValues();
}


getCurrentTime();

