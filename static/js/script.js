/* Author: YOUR NAME HERE
*/

$(document).ready(function() {   

    var socket = io.connect();

    $('#sender').bind('click', function() {
    });

    //While this variable is true, the form will not be submitted
    var disabled = false;

    socket.on('query_result', function(data){
        $('#receiver div').remove();
//        $('#receiver').append(JSON.stringify(data));

        for(var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            var itemId = item['itemId'];
            var amazon = (item['emarket'] == 'amazon') ? true : false;
            var marketImage = amazon ? '/img/amazon-s.jpg' : '/img/ebay-s.jpg';
            var linkPrefix = amazon ? 'http://www.amazon.co.uk/gp/offer-listing/' :  'http://www.ebay.co.uk/sch/';
            var price = "";

            for(key in item['price']) {
                if (item['price'][key]){
                    price +=    '<a href="' + linkPrefix + itemId + '/' + (amazon ? ('&condition=' + key) : '') + '">'
                                + '<span class="price"><span class="key">&nbsp;'
                                + key.charAt(0).toUpperCase() + key.slice(1) + '</span><span class="value">&nbsp;£'
                                + item['price'][key] + '</span></span></a>';
                }
            }
//
            var formattedResult =       '<div class="result-entry">'
                                        +   '<div class="entry-content">'
                                        +           '<div class="entry-title">'
                                        +               '<a href="'+item['itemUrl']+'">'
                                        +                   item['itemTitle']
                                        +               '</a>'
                                        +           '</div>'
                                        +           '<div class="entry-emarket">'
                                        +               '<img src="'+marketImage+'"/>'
                                        +           '</div>'
                                        +           '<div class="entry-image" style="background-image: url(\''+item['imageUrl']+'\')">'
                                        +           '</div>'
                                        +           '<div class="entry-body">'
                                        +               '<div class="entry-id">'
                                        +                   'ID: ' + itemId
                                        +               '</div>'
                                        +               '<div class="entry-price">'
                                        +                   price
                                        +               '</div>'
//                                        +               '<div class="entry-right-top">'
//                                        +                   '<a href="#">Something Else</a>'
//                                        +               '</div>'
//                                        +               '<div class="entry-right-bottom">'
//                                        +                   '<a href="#">Query URL</a>'
//                                        +               '</div>'
                                        +           '</div>'
                                        +       '</div>'
                                        +   '</div>';

            $('#receiver').append(formattedResult);
        }

        //Re-enabling search button
        $('#submit').removeAttr('disabled');
        disabled = false;
    });

    $('#searchbox').submit(function() {
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