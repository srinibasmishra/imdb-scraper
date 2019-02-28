const express = require('express');
const scraper = require('./scraper');

const app = express();

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



app.get( '/search/:imdbID', (req, res) => {

    scraper
    .getMovie(req.params.imdbID)
    .then(movie => {
 
     res.json(movie);
    });
 });



app.listen(port, () =>{

    console.log(`Listening on ${port}`);

});
