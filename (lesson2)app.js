/* eslint-env jquery */

(function () {

    // set variables
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    // when user enters a word and clicks submit,
    form.addEventListener('submit', function (e) {
        e.preventDefault();                             // default behavior of html submit is to send html form, which will execute before AJAX form request completes. We want to prevent two form submissions
        responseContainer.innerHTML = '';               // clear the response container
        searchedForText = searchField.value;            // grab user's typed input

        // send an ajax request from the unsplash api with the text that was entered by user
        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {                      // send in header with id
                Authorization: 'Client-ID 466a47c56d7203dc52a852c61abb4160f7ca7220c454173565786f9d78f9cfb2'
            }
        }).done(addImage)                   // upon response, run addImage function
        .fail(function (err) {              // use .fail method for error handling
            requestError(err, 'image');
        })

        function addImage(images) {                 // give it images parameter
            let htmlContent = ''                    // create a variable for content
            
            // ensure results are returned
            if (images && images.results && images.results.length > 1) {
                const firstImage = images.results[0];   // set a variable for first image returned

                // add a figure element to the content variable that has the image and author caption
                htmlContent = `<figure>
                    <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                    </figure>`
                    // note for above: gets url from first image, regular size, and alt assigns text to image

            } else {
                htmlContent = '<div class="error-no-image">No images available</div>';
            }

        // add inside response container as first element
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }


        // do the same for NY Times, no header needed
        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=26565239b3d64eb79e73ab4a283a08f7`,
        }).done(addArticles)
        .fail(function(err) {
            requestError(err, 'articles');
        })

    function addArticles(articles) {
        let htmlContent = '';

        if (articles.response && articles.response.docs && articles.response.docs.length > 1) {
            const allArticles = articles.response.docs;

            // make a list, mapping link to the article, headline, and snippet for each article in the returned array
            responseContainer.insertAdjacentHTML('beforeend', '<ul>' + allArticles.map(article =>
                `<li>
                        <a target="_blank" href="${article.web_url}">${article.headline.main}</a>
                        <p>${article.snippet}</p>
                    </li>`
            ).join('') + '</ul>');
        } else {
            htmlContent = '<div class="error-no-articles">No articles available</div>'
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);    
    }
    
});
}) ();
