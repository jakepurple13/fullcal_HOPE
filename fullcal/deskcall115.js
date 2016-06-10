/*
    Jacob Rein
*/


var eventedArray = new Array(0);


$(document).ready(function () {




    var TAG_TITLE_DESCRIPTION = '<:>'; //Used to split the title and the description


    var eventStore = new Array(0);
    try {
        eventStore = JSON.parse(localStorage.eventsList);
        //eventStore = JSON.parse(localStorage.getItem('eventsOfHOPE'));
        console.log(eventStore);
    } catch (err) {
        eventStore = $.get("getData/get-events.php");
        console.log($.get("getData/get-events.php"));
        console.log(err.message);
    }

    removeDuplicates(eventStore);


    var viewCount = 0;
    //starts the editing to FullCalendar    
    var calendar = $('#calendar').fullCalendar({


        googleCalendarApiKey: 'AIzaSyCRh2gYScSME16oR-Kozby_FZU8BTxwhdA',

        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,

        selectable: true,
        selectHelper: true,

        eventLimit: true, // allow "more" link when too many events

        eventSources: [
            {

                url: 'getData/get-events.php', // use the `url` property
                cache: true
             },
            {
                events: eventStore
            }
        ],

        //start is the start day
        //end is just a check | if end is -1, then arrow keys are being pressed
        select: function (start, end) {

            console.log(start);


            if (end != -1) {
                //var title = prompt('Event Title:');

                $('#myModalNorm').modal(); // initialized with defaults
                $('#myModalNorm').modal({
                    keyboard: false
                }); // initialized with no keyboard
                $('#myModalNorm').modal('show'); // initializes and invokes show immediately



                $('#saveButton').click(function () {
                    console.log("wakldjhfs");

                    var x = document.getElementById("eventMaker");

                    var title = x[0].value;
                    var descriptions = x[1].value;
                    var tel = "";
                    if (x[2].value) {
                        tel = '<br>Telephone: <a href="tel:' + x[2].value + '">' + x[2].value + '</a>';
                    }
                    if (title && descriptions) {


                        var titleAndDes = title + "" + TAG_TITLE_DESCRIPTION + descriptions + tel;


                        var eventData;
                        if (title) {
                            eventData = {
                                title: title,
                                start: start,
                                descript: descriptions + tel,
                                end: end
                            };
                            $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true

                            eventData.start.add(1, 'days');

                            var titlea = eventData.title;
                            var daya = eventData.start._i;
                            var caya = eventData.start._d; //this is the date
                            var cayaf = moment(caya).format("YYYY-MM-DD");
                            var endaf = moment(eventData.end._d).format("YYYY-MM-DD");

                            var addEvents = $.fullCalendar.moment({
                                title: titlea,
                                start: cayaf,
                                end: endaf,
                                description: eventData.descript
                            });

                            {
                                eventStore.push(addEvents._i);
                            };
                            localStorage.eventsList = JSON.stringify(eventStore);


                            //Google Calendar stuff starting here
                            var resource = {
                                "summary": title,
                                "description": descriptions,
                                "start": {
                                    "dateTime": start._d
                                },
                                "end": {
                                    "dateTime": end._d
                                }
                            };
                            var request = gapi.client.calendar.events.insert({
                                'calendarId': 'primary',
                                'resource': resource
                            });
                            request.execute(function (resp) {
                                console.log(resp);
                            });

                            //Ending here


                            console.log(eventStore);

                            $('#myModalNorm').modal('hide');

                        }
                    }

                });

                document.getElementById("eventMaker").reset();

            }
        },
        eventClick: function (calEvent, jsEvent, view) {
            var dated = new Date(calEvent.start);

            var titled = 'Event: ' + calEvent.title + '\nDescription: ' + calEvent.description + '\n' + dated + '\n' + 'Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY + '\n' + 'View: ' + view.name;
            var des = 'Date: ' + dated;

            console.log(titled);

            $('#myModal').modal(); // initialized with defaults
            $('#myModal').modal({
                keyboard: false
            }); // initialized with no keyboard
            $('#myModal').modal('show'); // initializes and invokes show immediately

            var eventText = calEvent.title;
            var count = eventText.toString.length;
            var titles = "";
            var descript = "";
            if (calEvent.description) {
                //console.error(calEvent.description);
                titles = calEvent.title;
                descript = "Description: " + calEvent.description;
            } else {
                titles = calEvent.title;
                descript = "Description: " + calEvent.title;
            }

            $("#eventTitle").text(titles);
            $("#Description").html(des + '<br />' + urlify(descript));





            //$('#calendar').fullCalendar('refetchEvents');

            if (calEvent.url) {
                //return false so if the event has an url, it doesn't open on its own.
                return false;
            }
        },

        eventRender: function (event, element, view) {
            var dateString = event.start.format("YYYY-MM-DD");
            $(view.el[0]).find('.fc-day[data-date=' + dateString + ']').css('background-color', '#bce8f1');
            element.attr("categories", event.description);
        },
        dayClick: function (date, jsEvent, view) {
            var mx = moment(date);
            var j = $('#calendar').fullCalendar('getDate');
            var ja = j._d
            var k = moment(ja).format("YYYY-MM-DD");
            var a = moment(mx);
            var b = moment(k);
            var c = (a.diff(b, 'days'));



            $('#calendar').fullCalendar('incrementDate', moment.duration(c, 'days'));
            var j = $('#calendar').fullCalendar('getDate');
            var ja = j._d
            var k = moment(ja).format("YYYY-MM-DD");

            //$(this).css('background-color', 'white');
        },
        eventMouseover: function (event, jsEvent, view) {
            $(this).css('background-color', 'red');
        },

        eventMouseout: function (event, jsEvent, view) {
            $(this).css('background-color', '#4987AB');
        },
        loading: function (bool) {
            $('#loading').toggle(bool);
        }
    });
    $('#my-prev-button').click(function () {
        $('#calendar').fullCalendar('prev');
    });
    $('#my-next-button').click(function () {
        $('#calendar').fullCalendar('next');
    });
    // Hover states on the static widgets
    $("#dialog-link, #icons li").hover(
        function () {
            $(this).addClass("ui-state-hover");
        },
        function () {
            $(this).removeClass("ui-state-hover");
        }
    );


    function changeDate(dur) {
        $('#calendar').fullCalendar('incrementDate', moment.duration(dur, 'days'));
        var j = $('#calendar').fullCalendar('getDate');
        // Date {Thu Feb 12 2015 19:00:00 GMT-0500 (Eastern Standard Time)}
        //..as effected by duration change
        var ja = j._d
        var k = moment(ja).format("YYYY-MM-DD");
        $('#calendar').fullCalendar('select', k, -1);
        $('this').css('background-color', '#bce8f1');
        $('this').addClass("fc-highlight");
    }

    $(document).keydown(function (e) {
        switch (e.keyCode) {
            case 33: // page up
                $('#calendar').fullCalendar('prev');
                break;

            case 34: // page down
                $('#calendar').fullCalendar('next');
                break;

                /*case 86:

                    switch (viewCount) {
                        case 0:
                            $('#calendar').fullCalendar('changeView', 'month');
                            viewCount++;
                            break;
                        case 1:
                            $('#calendar').fullCalendar('changeView', 'agendaWeek');
                            viewCount++
                            break;
                        case 2:
                            $('#calendar').fullCalendar('changeView', 'agendaDay');
                            viewCount = 0;
                            break;
                        default:
                            $('#calendar').fullCalendar('changeView', 'basicDay');
                            return;
                    }

                    break;*/

            case 37: // left
                changeDate(-1);
                break;

            case 39: //right
                changeDate(1);
                break;

            case 38:
                changeDate(-7);
                break;

            case 40: //down				
                changeDate(7);
                break;

            case 13: //enter

                var j = $('#calendar').fullCalendar('getDate');
                var ja = j._d
                var k = moment(ja).format("YYYY-MM-DD");
                $('#calendar').fullCalendar('select', k, 0);
                $('this').css('background-color', '#bce8f1');
                $('this').addClass("fc-highlight");
                var start = moment().startOf('k');
                var end = moment().endOf('k');
                var eventData;
                $('#calendar').fullCalendar('unselect');
                break;
            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });


    $(window).bind('beforeunload', function () {

        var evented = $('#calendar').fullCalendar('getResources');
        //console.log(evented.size);
        for (var i = 0; i < evented.size; i++) {
            console.log(evented.children);
        }

        localStorage.setItem('eventsOfHOPE', JSON.stringify(evented));

        return 'Are you sure you want to leave?';
    });

    console.log($('#calendar').fullCalendar('clientEvents'));

});

function onLoad() {
    var vEvents = [
        {
            title: "new appointment",
            start: "2016-05-02T16:00:00-05:00"
        },
        {
            title: "another meeting",
            start: "2016-04-07"
        }
];


    var size = JSON.parse(localStorage.eventsList).length;

    if (!(size === 0)) {

        for (i = vEvents.length; i >= 0; i--) {
            vEvents.pop();
        }

        var hold = JSON.parse(localStorage.eventsList);

        for (i = 0; i < size; i++) {
            vEvents.push(hold[i]);
        }
    }

    //vEvents.push();

    // Stringify it before storing
    localStorage.eventsList = JSON.stringify(vEvents);

    // Retrieve and parse the list when you want
    eventStore = JSON.parse(localStorage.eventsList);

    // You can now access the list as an array
    for (i = 0; i < size; i++) {
        console.log(eventStore[i]);
    }


}

/*
    urlify
    Is used to go through text and change any url into clickable urls
    text - String
*/
function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
            return '<a target="_blank" href="' + url + '">' + url + '</a>';
        })
        //Example of how urlify works

    /*
    var text = "Find me at http://www.example.com and also at http://stackoverflow.com";
    var html = urlify(text);
    html now looks like:
    "Find me at <a href="http://www.example.com">http://www.example.com</a> and also at <a href="http://stackoverflow.com">http://stackoverflow.com</a>"
    */
}


// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '691567585402-kodhvcd79tmm07dfj9o9e836tb5eh5bb.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/calendar"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        //authorizeDiv.style.display = 'none';
        loadCalendarApi();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    gapi.auth.authorize({
            client_id: CLIENT_ID,
            scope: SCOPES,
            immediate: false
        },
        handleAuthResult);
    return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    var request = gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'timeMax': (new Date(new Date().getFullYear(), 11, 31)).toISOString(),
        'maxResults': 100,
        'orderBy': 'startTime'
    });

    request.execute(function (resp) {
        var events = resp.items;
        //appendPre('Upcoming events:');
        //eventedArray = events;
        console.log(events);
        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                addToCalendar(event.summary, event.start, event.end);
            }
        }

    });
    //$('#calendar').fullCalendar('addEventSource', request);
    //$('#calendar').fullCalendar('refetchEvents');
}


function addToCalendar(titlest, startDate, endDate) {



    if (startDate.date) {
        var title = titlest;
        var dateStart = moment(startDate.date + "");
        var dateEnd = moment(endDate.date + "");

        console.log(dateStart);
        var eventData;
        eventData = {
            title: titlest,
            start: dateStart,
            end: dateEnd
        };
        $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
    }
}



function removeDuplicates(arrayToChange) {

    for (i = arrayToChange.length - 1; i > 0; i--) {

        if (arrayToChange[i] === arrayToChange[i - 1]) {
            arrayToChange.pop();
        }

    }




}
