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

        // use fetch to request an image, include header option
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 466a47c56d7203dc52a852c61abb4160f7ca7220c454173565786f9d78f9cfb2'
            }

            // when the request returns a promise, call a function with then to handle the response
        }).then(function (response) {            // use an arrow function for these 2 lines: .then(response => response.json())

            // the response object does not have data yet, to get the data, get the body of the response by calling JSON (converts from JSON)
            return response.json();

            // the JSON object also returns a promise, so chain on another .then to get data with addImage function
        }).then(addImage)

            // handle errors with network or request
            .catch(function (e) {               // arrow function: .catch(e => requestError(e, 'image'));
                requestError(e, 'image')        // calls requestError function, passing error object e and 
            });

        function addImage(data) {
            let htmlContent = '';                   // create variable for content
            const firstImage = data.results[0];     // create variable for first image returned
            if (firstImage) {                       // ensure an image is returned

                // add a figure element to the content variable that has image and author captions
                htmlContent = `<figure>
                <img src="${firstImage.urls.small}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
                // note for above: gets url from first image, small size, and alt assigns text to image

                // if no image, display error message
            } else {
                htmlContent = 'Unfortunately, no image was returned for your search.'
            }
            // add inside response container as first element
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }

        function requestError(e, part) {
            console.log(e);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }

        // do the same for New York Times articles
        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=26565239b3d64eb79e73ab4a283a08f7`,
        ).then(response => response.json()).then(addArticles).catch(e => requestError(e));          // without first e, console logs event

        function addArticles(data){
            let htmlContent = '';
            if (data.response && data.response.docs && data.response.docs.length > 1) {
                const articles = data.response.docs;
    
                // make a list, mapping link to the article, headline, and snippet for each article in the returned array
                responseContainer.insertAdjacentHTML('beforeend', '<ul>' + articles.map(article =>
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

        function requestError(e) {
            console.log(e);
            responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the article.</p>`)
        }

    })
})();