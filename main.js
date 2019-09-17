// use the HTTP server to process requests and send subsequent responses.
https = require('https');
var querystring = require('querystring');
var buffers = [];
var reviewData = [];

// create the header output json format
var post_data = querystring.stringify({
  'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
  'output_format': 'json',
  'output_info': 'compiled_code',
    'warning_level' : 'QUIET'
});

// create input request to call the yelp API to get 5 businesses
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

// process the response object 
https.get(options, (res)=>{
   //console.log(res);
    res.on('data', (d) => {
      // create a buffer array with the data
    	buffers.push(d)
     // console.log(d.toString());
    });
    // end of the response
     res.on('end', (d) => {
    // console.log(JSON.parse(Buffer.concat(buffers).toString()));

       // create a JSON object from buffer stream of data
       var dataStr = JSON.parse(Buffer.concat(buffers).toString());
       
       // get business object
       var business = dataStr.businesses;

       // sort the business object based on (current - previous) review count
       business = business.sort(function(a, b){return b.review_count - a.review_count});// sorting with review count
      // console.log(business);
      //console.log(business);
       
       // Iterate the business object and process each business element
       for (let index = 0; index < business.length; index++) {
         const element = business[index];
        // console.log("element",element)
         // create input request object and call yelp API to get the reviews response object
         var reviewOption = {
            host: 'api.yelp.com',
            path: '/v3/businesses/'+ element.id + '/reviews',
            methode:'GET',
            headers:{
              'Authorization':'Bearer U_V_lSl8pcGuQ03WtqS0953YaeqOHnOgqUE2bfcOm1pIhJNB7q58_WoD8kWsIUO44l0r4TQGfyrP7w2oHdQFxEU4caijfHtPdSpkjo6VVxShFaP6p8DgupR-jo92XXYx',
              'Content-Length': Buffer.byteLength(post_data)
            }
         }
         
         // process response object
          https.get(reviewOption,(respRev) =>{
            var reviewBufferData = [];
            var reviewArr = [];
            // create the array of response stream
             respRev.on('data', (d) => {reviewBufferData.push(d);});

             // end the response 
             respRev.on('end', (d) =>{
            	 
              // create the JSON review object
              var reviews = JSON.parse(Buffer.concat(reviewBufferData).toString());
              
              // create the review data array
              reviewData = reviews['reviews'];
              
              // create the review array for username & the review
              reviewArr = [];
            //  console.log('Reviews',reviewData)
              
              // process the reviewData array to fetch username and review
              reviewData.forEach(userDt => {
               // console.log('userData:',userDt);
            	  
            	// create review object with username and review
                var review = {
                  'Name Of Person:': userDt.user.name,
                  'Review :' : userDt.text
                }
                
                // add the review object to review array
                reviewArr.push(review);
              });
             // console.log("ReviewArr",JSON.stringify(reviewArr));
              //display the output params on the console
              console.log({'Business':element.name,'Address': element.location.address1 + ','+ element.location.city,'Review': JSON.stringify(reviewArr)});
             }
          )
          // handle the errors while process the review object to fetch the reviews
          respRev.on('error', (e) => {console.error(e);});
            }
          );
       }
      });
          // handle the error while calling the yelp API to fetch businesses
          res.on('error', (e) => {console.error(e);});
    });