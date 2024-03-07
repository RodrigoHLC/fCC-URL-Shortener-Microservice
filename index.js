require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// --- MY CODE ---
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ 

let dns = require('dns');
let URL = require('url-parse');

let bodyParser = require('body-parser');

app.use("/", bodyParser.urlencoded({extended:false}))

// ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ 
// --- MY CODE ---

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// --- MY CODE STARTS HERE ---
// ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
// --- OBJECT FOR STORING LONG URLS AND SHORT URLS
let urlReferences={"exampleLongURL": "exampleShortURL"};

app.post("/api/shorturl",
 (req, res, next)=>{
    // --- FIRST, CHECK IF THE URL HAS ALREADY BEEN USED
      if(urlReferences.hasOwnProperty(req.body.url)){
        // --- IF YES, RETURN PREVIOUSLY STORED SHORT URL
        return res.json({
          "original_url": req.body.url,
          "short_url": urlReferences[req.body.url]
          // , "FIRSTCHECKTEST": urlReferences
        })
      }else{
        // --- IF URL IS NEW, MOVE TO NEXT FUNCTION
        next()
      }
    }
  , 
  (req, res)=>{
    // --- CREATE URL OBJECT
  let urlObject = new URL(req.body.url);
  // --- IF URL FORMAT IS VALID, CHECK IF HOSTNAME EXISTS
    dns.lookup(urlObject.hostname, function(err, data){
      // --- IF HOSTNAME DOES NOT EXIST:
      if(err){
        res.json({ "error": 'invalid url' })
      }else{
      // --- IF HOSTNAME EXISTS
      // --- CREATE RANDOM NUMBER FOR SHORT URL
      let shortURL = Math.floor(Math.random()*(99999))+1;
      // --- MAKE SURE IT DOESN'T ALREADY EXIST IN THE DATABASE
      while( Object.values(urlReferences).includes(shortURL) ){
        // IF IT ALREADY EXISTS, REASSING shortURL TO A NEW NUMBER
        shortURL = Math.floor(Math.random()*(99999))+1;
      }
      // --- STORE ORIGINAL URL DATABASE, ALONG WITH SHORT URL
      urlReferences[req.body.url] = shortURL;
      // --- RETURN URLS
      res.json({
        "original_url": req.body.url,
        "short_url": shortURL
        });
      }
    })
  // } 
}
)

// --- VISIT ORIGINAL URL USING SHORT URL
app.use("/api/shorturl/:short", (req,res)=>{
  let short = req.params.short;
  let destination = "";
  // urlReferences[destination]
  // --- ITERATE THROUGH STORED URLS
  for(let longURL in urlReferences){
    if(urlReferences[longURL] == short){
      destination = longURL;
    }
  }
  // --- SEND TO LONG URL
  res.redirect(destination)
})



// --- BUNCH OF CODE I DIDN'T USE
// app.post("/api/shorturl", (req, res, next)=>{
  // let link = new URL(req.body.url);
  // --- RegEx FOR https://www.example.com FORMAT
  // let reg = /^https?:\/\/www\.\w+\.[a-z]+/i ;
  // --- IF URL FORMAT IS INVALID
  // if(!reg.test(req.body.url)){
  //   res.json({"error": "invalid url FORMAT"})
  // }else{
  // --- IF URL FORMAT IS VALID, CHECK IF HOSTNAME EXISTS
    // dns.lookup(req.body.url.hostname, function(err, address, family){
      // --- IF HOSTNAME DOES NOT EXIST:
      // if(err){
      //   res.json({ "error": 'Invalid hostname' })
      // }else{
      // --- IF HOSTNAME EXISTS
      // res.json({
      //   "original_url": req.body.url,
      //   "ip address": address,
      //   "ip family": family
        // "short_url": ,
  //       });
  //       next();
  //     }
  //   })
  // } 
  // if(link.protocol == "http:" || link.protocol == "https:" && /^www\.\w+\.com$/.test(link.hostname) ){
  //   res.json({
  //     "URL original": req.body.url,
  //     "URL Protocol": link.protocol,
  //     "URL hostname": link.hostname
  //   })
  // }else{
  //   res.json({"nah": "that's not a valid url, bro"})
  // }
  // --- CHECK THAT URL DESTINATION EXISTS
  // dns.lookup(req.body.url, function(err, address, family){
  // --- IF NOT A VALID URL:
    // if(err){
    //   res.json({ error: 'invalid url' })
    // }
    // if(err){res.json({"message": err})}else{
    // res.json({
    //   "original_url": req.body.url,
    //   "ip address": address,
    //   "ip family": family
      // "short_url": ,
    // })
  // }
  // })

  // --- IF URL IS VALID:
  // res.json({
  //   "original_url": req.body.url
  //   // "short_url": ,
  // })
// })
