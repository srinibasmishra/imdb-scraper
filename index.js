const express = require('express');
const cors= require('cors');

const scraper = require('./scraper');

const app = express();

app.use(cors());

const port = process.env.PORT || 3000;

app.get( '/', (req, res) => {

    res.json({
        message: 'Scraping imdb'
    });
});


//   /search/star wars


app.get( '/search/:title', (req, res) => {

   scraper
   .searchMovies(req.params.title)
   .then(movies => {

    res.json(movies);
   });
});



app.get( '/movie/:imdbID', (req, res) => {

    scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
 
     res.json(movie);
    });
 });



app.listen(port, () =>{

    console.log(`Listening on ${port}`);

});
