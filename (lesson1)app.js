(function () {

    // set variables
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    // when user enters a word and clicks submit,
    form.addEventListener('submit', function (e) {
        e.preventDefault();                         // default behavior of html submit is to send html form, which will execute before AJAX form request completes. We want to prevent two form submissions
        responseContainer.innerHTML = '';           // clear the response container
        searchedForText = searchField.value;        // grab user's typed input

        const imgRequest = new XMLHttpRequest();    // create a new request for an image on Unsplash
        imgRequest.onload = addImage;               // if request succesful, run addImage function below
        imgRequest.onerror = function (err) {       // if not succesful, run requestError function ?
            requestError(err, 'image');
        };

        // set the method for the request as GET with user input on the unsplash API
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`)

        // submit my unsplash API developer ID
        imgRequest.setRequestHeader('Authorization', 'Client-ID 466a47c56d7203dc52a852c61abb4160f7ca7220c454173565786f9d78f9cfb2')

        // finally, send
        imgRequest.send();

        // do the same with for New York Times request(no header required)
        const articleRequest = new XMLHttpRequest();    // create a new request for news articles from NYT
        articleRequest.onload = addArticles;            // if request successful, run addArticles function below
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=26565239b3d64eb79e73ab4a283a08f7`);
        articleRequest.send();

        function addImage() {
            // set variable for content to be added to page
            let htmlContent = '';

            // convert the JSON response into a JavaScript object
            const data = JSON.parse(this.responseText);

            // check if there are images returned
            if (data && data.results && data.results[0]) {

                // grab the first image returned
                const firstImage = data.results[0];

                // add a figure element to the content variable that has the image and author caption
                htmlContent = `<figure>
                <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`

                // note for above: gets url from first image, regular size, and alt assigns text to image

                // if no images returned, display:
            } else {
                htmlContent = '<div class="error-no-image">No images available</div>';
            }

            // add inside response container as first element
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }

        // same as above, now this time with NYT article
        function addArticles() {
            let htmlContent = '';
            const data = JSON.parse(this.responseText);
            if (data.response && data.response.docs && data.response.docs.length > 1) {
                const articles = data.response.docs;
                htmlContent = '<ul>' + articles.map(article =>
                    `<li>
                        <a target="_blank" href="${article.web_url}">${article.headline.main}</a>
                        <p>${article.snippet}</p>
                    </li>`
                ).join('') + '</ul>';
            } else {
                htmlContent = '<div class="error-no-article">No articles available</div>';
            }
            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }
    });
})();