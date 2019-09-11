/**
 * http://usejsdoc.org/
 */

https = require('https');
// options
var options = {
   host: 'api.yelp.com',
   path: '/v3/businesses/search?term=restorent&location=60007',
   methode:'GET',
   headers:{'Authorization':'Bearer U_V_lSl8pcGuQ03WtqS0953YaeqOHnOgqUE2bfcOm1pIhJNB7q58_WoD8kWsIUO44l0r4TQGfyrP7w2oHdQFxEU4caijfHtPdSpkjo6VVxShFaP6p8DgupR-jo92XXYx'}
}
// get
https.get(options, (res)=>{
   //console.log(res);
    res.on('data', (d) => {
      // process.stdout.write(d);
       //console.log(JSON.parse(process.stdout.write(d)))
      console.log(JSON.parse(process.stdout.write(d)));
    });
     res.on('end', (d) => {
      // process.stdout.write(d);
    //   console.log(d)
    });
   res.on('error', (e) => {
     console.error(e);
   });
});
