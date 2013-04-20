/* Author: YOUR NAME HERE
*/

$(document).ready(function() {   

    var socket = io.connect();

    $('#sender').bind('click', function() {
    });

    socket.on('query_result', function(data){
        for(var i = 0; i < data.length; i++) {
            $('#receiver').append('<li>' + data[i] + '</li>');
        }
    });

    $('#searchForm').submit(function() {
        var query = $('#searchBox').val();

        socket.emit('query_request', query);
        return false;
    });

});