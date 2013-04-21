/* Author: YOUR NAME HERE
*/

$(document).ready(function() {   

    var socket = io.connect();

    $('#sender').bind('click', function() {
    });

    //While this variable is true, the form will not be submitted
    var disabled = false;

    socket.on('query_result', function(data){
        $('#receiver li').remove();
        $('#receiver h1').remove();
//        $('#receiver').append(JSON.stringify(data));

        for(var i = 0; i < data.items.length; i++) {
            $('#receiver').append('<h1>'+'NUMBER ' + i +'</h1>');
            for(key in data.items[i]) {
                $('#receiver').append('<li>' + key + " -> " + JSON.stringify(data.items[i][key]) + '</li>');
            }
        }

        //Re-enabling search button
        $('#submit').removeAttr('disabled');
        disabled = false;
    });

    $('#searchbox').submit(function() {
        console.log("hello");
        //Disabling submitting form
        if(!disabled) {
            $('#submit').attr('disabled', 'disabled');
            disabled = true;

            var query = $('#search').val();

            socket.emit('query_request', query);
        }

        return false;
    });

    $('#search').keyup( function() {
        if($('#search').val() == '') {
            $('#submit').attr('disabled', 'disabled');
        } else {
            $('#submit').removeAttr('disabled');
        }
    })
//    socket.emit('query_request', "iphone");
});