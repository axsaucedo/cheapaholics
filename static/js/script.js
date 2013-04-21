/* Author: YOUR NAME HERE
*/

$(document).ready(function() {   

    var socket = io.connect();

    $('#sender').bind('click', function() {
    });

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
    });

    $('#searchForm').submit(function() {
        var query = $('#searchBox').val();

        socket.emit('query_request', query);
        return false;
    });

    socket.emit('query_request', "iphone");
});