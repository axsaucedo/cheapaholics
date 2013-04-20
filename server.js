//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 8081)
    , async = require('async')
    , mysql = require('mysql')
    , ebay = require('ebay-api')
    , util = require('util');

//Initiate the Amazon apac operation helper
var amazon = new (require('apac').OperationHelper)({
      awsId: 'AKIAJIOLE4OXTQDEAHSQ'
    , awsSecret: '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'
    , assocId: '9877-6481-2323'
});

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen(port);

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
    console.log('Client Connected');

    socket.on('query_request', function(query){
        var params = {};
        params.keywords = query.split();

        //Calling ebay and amazon request asyncronously - execute function once both are done
        async.series({
                ebay: function(callback) {
                    params = {};
                    params.keywords = query.split(' ');

                    requestEbayQuery(query, params, null, callback);
                },
                amazon: function(callback) {
                    requestAmazonQuery(query, callback);
                }
            }, // Now the results are passed to the following function as { ebay: x, amazon: y }
            function(err, results) {
                socket.emit('query_result', results.ebay);
                socket.emit('query_result', results.amazon)
            }
        );
    });

    socket.on('disconnect', function(){
        console.log('Client Disconnected.');
    });
});

//EBAY query
function requestEbayQuery(query, params, filters, callback) {
    ebay.ebayApiGetRequest({
          serviceName: 'FindingService'
        , opType: 'findItemsByKeywords'
        , appId: 'HackaSot-b5e3-4d5e-b9dd-f5f631f9c60f'
        , params: params
        , filters: filters
        , parser: ebay.parseItemsFromResponse
    }
    , callback);//(error, result)
}

//AMAZON query
function requestAmazonQuery(query, callback) {
    amazon.execute('ItemSearch', {
            'Keywords': query
        }
        , callback//(error, result)
    );
}




///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
  res.render('index.jade', {
    locals : { 
              title : 'Your Page Title'
             ,description: 'Your Page Description'
             ,author: 'Your Name'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
