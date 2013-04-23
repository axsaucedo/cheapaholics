/* Author: YOUR NAME HERE
*/

$(document).ready(function() {   

    var socket = io.connect();
    var loaderObj, container;

    $('#sender').bind('click', function() {
    });

    //While this variable is true, the form will not be submitted
    var disabled = false;

    socket.on('query_result', function(data){
        $('#receiver div').remove();
//        $('#receiver').append(JSON.stringify(data));

        if(data.items.length < 1) {
            $('#receiver div').append('<h1>No Results</h1>');
        }

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
        container.style.display = "none";
        loaderObj.stop();
        disabled = false;
    });

    $('#searchbox').submit(function() {
        //Disabling submitting form
        if(!disabled) {
            $('#submit').attr('disabled', 'disabled');
            disabled = true;

            var query = $('#search').val();

            socket.emit('query_request', query);
            loaderObj.play();
            container.style.display = "block";
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


    //Adding loader to page
    var loader = {

        width: 60,
        height: 60,

        stepsPerFrame: 1,
        trailLength: 1,
        pointDistance: .02,
        fps: 30,

        fillColor: '#05E2FF',

        step: function(point, index) {

            this._.beginPath();
            this._.moveTo(point.x, point.y);
            this._.arc(point.x, point.y, index * 7, 0, Math.PI*2, false);
            this._.closePath();
            this._.fill();

        },

        path: [
            ['arc', 30, 20, 15, 0, 360]
        ]

    }

    container = document.getElementById('loader');
    loaderObj = new Sonic(loader);

    container.className = 'l';

    container.style.display = "none";

    container.appendChild(loaderObj.canvas);
});