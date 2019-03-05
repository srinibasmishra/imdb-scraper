const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = 'https://www.imdb.com/find?s=tt&ttype=ft&ref_=fn_ft&q=';
const movieUrl= 'https://www.imdb.com/title/';


const searchCache = {};
const movieCache ={};

function searchMovies(searchTerm){

    if(searchCache[searchTerm]){
        console.log("serving from cache", searchTerm);

        return Promise.resolve(searchCache[searchTerm]);
    }
  return fetch(`${url}${searchTerm}`)
    .then(response => response.text())
    .then(body => {

        const movies = [];
        const $ = cheerio.load(body);
        $('.findResult').each(function(i, element){
            const $element = $(element);
           const $image = $element.find('td a img');
            const $title = $element.find('td.result_text a')
           const imdbID = $title.attr('href').match(/title\/(.*)\//)[1];


          
            const movie = {
              image: $image.attr('src'),
              title: $title.text(),
               imdbID
    
           }; 
    
           movies.push(movie);
    
            
        });

        searchCache[searchTerm] = movies;
        return(movies);
    });

}

function getMovie(imdbID){

    if(movieCache[imdbID]){
        console.log("serving from cache", imdbID);
    return Promise.resolve(movieCache[imdbID]);

    }
    return fetch(`${url}${imdbID}`)
    .then(response => response.text())
    .then(body =>{
        const $ = cheerio.load(body);
        const $title = $('.title_wrapper h1');

        const title = $title.first().contents().filter(function(){

            return this.type === 'text';
        }).text().trim();
              const imdbRating = $('span[itemprop = "ratingValue"]').text() + "/10";
             const duration = $("time").eq(0).text().trim();
             const genres = [];
             const poster = $('div .poster a img').attr('src');
              const plot = $('div .summary_text ').text().trim();
             const director = $('div .credit_summary_item a').filter(function(){ return $('h4').html()== "Director:" ;}).eq(0).text().trim();
            const trailer = $('div.slate > a').attr('href');


             const storyline = $('div .canwrap > p > span').text().trim();
              const trivia = $('div #trivia').text().trim();            
            const releaseDate = $(' .subtext > a').filter(function(){
                return $(this).attr('title');
            }).text().trim();
             
             $(' .subtext > a').filter(function(){
                return !$(this).attr('title');
            }).each(function(i, element){
              const genre = $(element).text();
              genres.push(genre);


            })
        const movie = {

            imdbID,

            title,
            duration,
            genres,
            releaseDate,
            imdbRating,
            poster,
            plot,
            storyline,

            trivia,
            trailer: `https://www.imdb.com${trailer}`  
            
        };

        movieCache[imdbID]= movie;

        return movie;

        
    } );
    


}

module.exports = {
    searchMovies,
    getMovie
};



