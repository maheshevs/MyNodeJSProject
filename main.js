var http = require('http');
http.createServer(function handler(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(1339, '127.0.0.1');

https = require('https');
var querystring = require('querystring');
var buffers = [];
var reviewData = [];

var post_data = querystring.stringify({
  'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
  'output_format': 'json',
  'output_info': 'compiled_code',
    'warning_level' : 'QUIET'
});

// options
var options = {
   host: 'api.yelp.com',
   path: '/v3/businesses/search?term=restorent&location=60007&limit=5',
   methode:'GET',
   headers:{
     'Authorization':'Bearer U_V_lSl8pcGuQ03WtqS0953YaeqOHnOgqUE2bfcOm1pIhJNB7q58_WoD8kWsIUO44l0r4TQGfyrP7w2oHdQFxEU4caijfHtPdSpkjo6VVxShFaP6p8DgupR-jo92XXYx',
     'Content-Length': Buffer.byteLength(post_data)
    }
}
// https://api.yelp.com/v3/businesses/{id}/reviews

// get
https.get(options, (res)=>{
   //console.log(res);
    res.on('data', (d) => {
      buffers.push(d)
     // console.log(d.toString());
    });
     res.on('end', (d) => {
    // console.log(JSON.parse(Buffer.concat(buffers).toString()));

       var dataStr = JSON.parse(Buffer.concat(buffers).toString());
       var business = dataStr.businesses;

       business = business.sort(function(a, b){return b.review_count - a.review_count});// sorting with review count
      // console.log(business);
      //console.log(business);
       for (let index = 0; index < business.length; index++) {
         const element = business[index];
        // console.log("element",element)
         var reviewOption = {
            host: 'api.yelp.com',
            path: '/v3/businesses/'+ element.id + '/reviews',
            methode:'GET',
            headers:{
              'Authorization':'Bearer U_V_lSl8pcGuQ03WtqS0953YaeqOHnOgqUE2bfcOm1pIhJNB7q58_WoD8kWsIUO44l0r4TQGfyrP7w2oHdQFxEU4caijfHtPdSpkjo6VVxShFaP6p8DgupR-jo92XXYx',
              'Content-Length': Buffer.byteLength(post_data)
            }
         }
         
          https.get(reviewOption,(respRev) =>{
            var reviewBufferData = [];
            var reviewArr = [];
             respRev.on('data', (d) => {reviewBufferData.push(d);});

             respRev.on('end', (d) =>{
              var reviews = JSON.parse(Buffer.concat(reviewBufferData).toString());
              reviewData = reviews['reviews'];
              reviewArr = [];
            //  console.log('Reviews',reviewData)
              reviewData.forEach(userDt => {
               // console.log('userData:',userDt);
                var review = {
                  'Name Of Person:': userDt.user.name,
                  'Review :' : userDt.text
                }
                reviewArr.push(review);
              });
             // console.log("ReviewArr",JSON.stringify(reviewArr));
              console.log({'Business':element.name,'Address': element.location.address1 + ','+ element.location.city,'Review': JSON.stringify(reviewArr)});
             }
          )
          respRev.on('error', (e) => {console.error(e);});
            }
          );
       }
      });
          res.on('error', (e) => {console.error(e);});
    });