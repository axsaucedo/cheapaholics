/* Author: YOUR NAME HERE
*/

$(document).ready(function() {   

    var socket = io.connect();

    $('#sender').bind('click', function() {
    });

    socket.on('query_result', function(data){
        for(var i = 0; i < data.length; i++) {
            $('#receiver').append('<h1>'+'NUMBER ' + i +'</h1>');
            for(key in data[i]) {
                $('#receiver').append('<li>' + key + " -> " + JSON.stringify(data[i][key]) + '</li>');
            }
        }
//        for(var i = 0; i < data.length; i++) {
//            for(key in data) {
//                $('#receiver').append('<li>' + key + "->" + JSON.stringify(data[key]) + '</li>');
//            }
//        }
    });

    $('#searchForm').submit(function() {
        var query = $('#searchBox').val();

        socket.emit('query_request', query);
        return false;
    });

    socket.emit('query_request', "iphone");
});