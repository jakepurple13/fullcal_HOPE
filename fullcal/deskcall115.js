/*
    Jacob Rein
*/

$(document).ready(function() {
    
    
    var TAG_TITLE_DESCRIPTION = '<:>'; //Used to split the title and the description
    
    
    var eventStore = new Array(0);
    try {
        eventStore = JSON.parse(localStorage.eventsList);
        //eventStore = JSON.parse(localStorage.getItem('eventsOfHOPE'));
        console.log(eventStore);
    } catch(err) {
        eventStore =  $.get("getData/get-events.php");
        console.log($.get("getData/get-events.php"));
        console.log(err.message);
    }
    
    
    

/*    
    if (localStorage.getItem("eventsList") === null) {
        events = JSON.parse(localStorage.eventsList);
    } else {
        events = "";
    }*/
//starts the editing to FullCalendar    
    var calendar = $('#calendar').fullCalendar({
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
        select: function(start, end) {
            
            console.log(start);
            
            
                if(end!=-1) {
                    var title = prompt('Event Title:');
                    if(title) {
                        var description = prompt('Description:');

                        var titleAndDes = title+TAG_TITLE_DESCRIPTION+description;
                        
                        var eventData;
                        if (title) {
                                eventData = {
                                    title: titleAndDes,
                                    start: start,
                                    descript: description,
                                    end: end
                                };
                        $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
                            
                            eventData.start.add(1, 'days');
                            
                            var titlea=eventData.title;
                            var daya=eventData.start._i;
                            var caya=eventData.start._d; //this is the date
                            var cayaf= moment(caya).format("YYYY-MM-DD");
                            
                            var addEvents= $.fullCalendar.moment({ title: titlea, start: cayaf});
                                                        
                            {
                                eventStore.push(addEvents._i);
                            };

                            //localStorage.setItem('eventsOfHOPE', JSON.stringify(eventStore));
                            localStorage.eventsList = JSON.stringify(eventStore);
                            console.log(addEvents._i);
                            console.log(eventStore);
                        }
                    }
                }
        },
        eventClick: function(calEvent, jsEvent, view) {
            var dated = new Date(calEvent.start);

            var titled = 'Event: ' + calEvent.title + '\n' + dated + '\n' + 'Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY + '\n' + 'View: ' + view.name;
            var des = 'Date: ' + dated;

            console.log(titled);
            
            $('#myModal').modal();                     // initialized with defaults
            $('#myModal').modal({ keyboard: false });   // initialized with no keyboard
            $('#myModal').modal('show');             // initializes and invokes show immediately
            
            var eventText = calEvent.title;
            var count = eventText.toString.length;
            if(eventText.includes(TAG_TITLE_DESCRIPTION)) {
                count = eventText.indexOf(TAG_TITLE_DESCRIPTION);
            }

            var titles = eventText.substring(0, count);
            var descript = "Description: " + eventText.substring(eventText.indexOf(TAG_TITLE_DESCRIPTION)+3);



            if (calEvent.url) {
                //return false so if the event has an url, it doesn't open on its own.
                return false;
            }
            
            $("#eventTitle").text(titles);
            $("#Description").html(des + '<br />' + urlify(descript));
            
            $('#calendar').fullCalendar( 'refetchEvents' );
            
        },

    eventRender: function (event, element, view) {
        var dateString = event.start.format("YYYY-MM-DD");
        $(view.el[0]).find('.fc-day[data-date=' + dateString + ']').css('background-color', '#bce8f1');
     },
    dayClick: function(date, jsEvent, view) {
                var mx=moment(date);
                    var j=$('#calendar').fullCalendar('getDate');
                                var ja=j._d
                                var k= moment(ja).format("YYYY-MM-DD");
                                var a = moment(mx);
                                var b = moment(k);
                                var c = (a.diff(b,'days'));



                    $('#calendar').fullCalendar('incrementDate', moment.duration(c, 'days'));
                                var j=$('#calendar').fullCalendar('getDate');
                                var ja=j._d
                                var k= moment(ja).format("YYYY-MM-DD");

                    //$(this).css('background-color', 'white');
    }, 
    eventMouseover : function( event, jsEvent, view ) { 
        $(this).css('background-color', 'red');
    },

    eventMouseout : function( event, jsEvent, view ) { 
        $(this).css('background-color', '#4987AB');
    },
    loading: function(bool) {
        $('#loading').toggle(bool);
    }
});
$('#my-prev-button').click(function() {
    $('#calendar').fullCalendar('prev');
});
   $('#my-next-button').click(function() {
    $('#calendar').fullCalendar('next');
});
// Hover states on the static widgets
$( "#dialog-link, #icons li" ).hover(
	function() {
		$( this ).addClass( "ui-state-hover" );
	},
	function() {
		$( this ).removeClass( "ui-state-hover" );
	}
);


function changeDate(dur) {
    $('#calendar').fullCalendar('incrementDate', moment.duration(dur, 'days'));
    var j=$('#calendar').fullCalendar('getDate');
    // Date {Thu Feb 12 2015 19:00:00 GMT-0500 (Eastern Standard Time)}
    //..as effected by duration change
    var ja=j._d
    var k= moment(ja).format("YYYY-MM-DD");
    $('#calendar').fullCalendar('select',k,-1);
    $('this').css('background-color', '#bce8f1');
    $('this').addClass( "fc-highlight" );
}

$(document).keydown(function(e) {
    switch(e.keyCode) {
				case 33: // page up
        $('#calendar').fullCalendar('prev');
				break;
        
				case 34: // page down
        $('#calendar').fullCalendar('next');
				break;
				
				case 37: // left
					changeDate(-1);
				    break;
                    
                case 39:  //right
                    changeDate(1);
                    break;

                case 38:      
                    changeDate(-7);
                    break;
				
				case 40: //down				
                    changeDate(7);
                    break;
            
				case 13: //enter
      		  
			var j=$('#calendar').fullCalendar('getDate');
								var ja=j._d
								var k= moment(ja).format("YYYY-MM-DD");
								$('#calendar').fullCalendar('select',k, 0);
						$('this').css('background-color', '#bce8f1');
				 $('this').addClass( "fc-highlight" );
			     var start=moment().startOf('k');
			     var end=moment().endOf('k');
				var eventData;
				$('#calendar').fullCalendar('unselect');
				break;  
        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
		});
    
    
    $(window).bind('beforeunload', function(){
        
        var evented = $('#calendar').fullCalendar( 'getResources' );
        //console.log(evented.size);
        for(var i=0;i<evented.size;i++) {
            console.log(evented.children);
        }
        
        localStorage.setItem('eventsOfHOPE', JSON.stringify(evented));
        
        return 'Are you sure you want to leave?';
    });
    
 console.log($('#calendar').fullCalendar('clientEvents'));
    
});

function onLoad() {
    var vEvents = [
    { title: "new appointment", start: "2016-05-02T16:00:00-05:00"  },
    { title: "another meeting", start: "2016-04-07" }
];
    
    
    var size = JSON.parse(localStorage.eventsList).length;
    
    if(!(size===0)) {
        
        for(i=vEvents.length;i>=0;i--) {
            vEvents.pop();
        }
        
        var hold = JSON.parse(localStorage.eventsList);
        
        for(i=0;i<size;i++) {
            vEvents.push(hold[i]);
        }
    }
    
    //vEvents.push();

// Stringify it before storing
localStorage.eventsList = JSON.stringify(vEvents);

// Retrieve and parse the list when you want
eventStore = JSON.parse(localStorage.eventsList);

// You can now access the list as an array
    for(i=0;i<size;i++) {
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
    return text.replace(urlRegex, function(url) {
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

