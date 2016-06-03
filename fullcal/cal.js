$(document).ready(function() {

    
    
    
    // page is now ready, initialize the calendar...
    var event = "";
//$.getJSON('events.json', function(json) {
  // 		console.log(json); // this will show the info it in firebug console
   //		events = json;
	//});
	
	
	
	
	
	
    $('#calendar').fullCalendar({
        // put your options and callbacks here
        
        
	   eventSources: [

        // your event source
        
        {
            events: [ // put the array in the `events` property
                {
                    title  : 'event1',
                    start  : '2016-05-26'
                },
                {
                    title  : 'event2',
                    start  : '2016-05-20',
                    end    : '2016-05-30'
                },
                {
                    title  : 'event3',
                    start  : '2016-05-10T12:30:00',
                }
            ],
            color: 'black',     // an option!
            textColor: 'yellow' // an option!
        }

        // any other sources...

    ],
        

	//$(this).fullCalendar( 'addEventSource', event);

	//weekends: false // will hide Saturdays and Sundays

	 dayClick: function(date, jsEvent, view) {
		var text = 'Clicked on: ' + date.format() + '\n' + 'Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY + '\n' + 'Current view: ' + view.name;
		 alert(text);
        
    	},
    	eventClick: function(calEvent, jsEvent, view) {
	var dated = new Date(calEvent.start);
	
	var titled = 'Event: ' + calEvent.title + '\n' + dated + '\n' + 'Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY + '\n' + 'View: ' + view.name;
	
        alert(titled);

        // change the border color just for fun
        $(this).css('border-color', 'red');
        
        
        
        

    },

	eventMouseover : function( event, jsEvent, view ) { 
		$(this).css('background-color', 'red');
	},
	
	eventMouseout : function( event, jsEvent, view ) { 
		$(this).css('background-color', 'black');
	}

    });

});

function load() {
	event = JSON.parse(evented);
	console.log(event);
}
