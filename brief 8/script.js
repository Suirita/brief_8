let fav_list = document.getElementById("fav_list");
fav_list.onclick = function () {
    window.location.href = "fav.html";
};

let Home = document.getElementById("Home");
Home.onclick = function () {
    window.location.href = "index.html";
};

fetch('https://api.themoviedb.org/3/movie/popular?page=2&api_key=354ac65aebc36d1585a2fe5d1a303b27')
    .then((response) => response.json())
    .then(async (json) => {

        if (window.location.pathname.includes("index.html")) {

            let slide_img = document.querySelectorAll(".slide_img");

            let currentSlide = 0;

            const showSlide = (index) => {
                const slides = document.querySelector('.slides');
                const slideWidth = document.querySelector('.slide').offsetWidth;
                if (slides) {
                    slides.style.transform = `translateX(${-index * slideWidth}px)`;
                    currentSlide = index;
                }
            };

            const nextSlide = () => {
                currentSlide = (currentSlide + 1) % 5;
                showSlide(currentSlide);
            };

            const prevSlide = () => {
                currentSlide = (currentSlide - 1 + 5) % 5;
                showSlide(currentSlide);
            };

            const nextButton = document.querySelector('.next');
            const prevButton = document.querySelector('.prev');

            if (nextButton && prevButton) {
                nextButton.addEventListener('click', nextSlide);
                prevButton.addEventListener('click', prevSlide);
            }

            let slideshowInterval;

            const startSlideshow = () => {
                slideshowInterval = setInterval(nextSlide, 5000);
            };

            const stopSlideshow = () => {
                clearInterval(slideshowInterval);
            };

            let slide = document.getElementsByClassName("slide");
            for (let j = 0; j < slide_img.length; j++) {
                slide_img[j].src = "https://image.tmdb.org/t/p/original/" + json.results[j].backdrop_path;
                let slide_name = document.getElementById("name_" + j);
                slide_name.innerHTML = json.results[j].title;
                let slide_overview = document.getElementById("overview_" + j);
                slide_overview.innerHTML = json.results[j].overview;
                let slide_Rating = document.getElementById("rating_" + j);
                let star = document.createElement("i");
                star.className = "fas fa-star";
                star.style.color = "#ffff00";
                slide_Rating.innerHTML = "Rating : ";
                slide_Rating.appendChild(star);
                slide_Rating.innerHTML += json.results[j].vote_average.toString().slice(0, 3);

                slide_img[j].onclick = function () {
                    window.location.href = "detail.html?id=" + encodeURIComponent(json.results[j].id);
                };

                let currentSlide = slide[j]

                currentSlide.onmouseover = function () {
                    stopSlideshow();
                    currentSlide.style.cursor= "pointer";
                    slide_name.style.visibility = 'visible';
                    slide_overview.style.visibility = 'visible';
                    slide_Rating.style.visibility = 'visible';
                    for (let h = 0; h < slide_img.length; h++) {
                        slide_img[h].style.opacity = 0.6;
                    }
                };

                currentSlide.onmouseout = function () {
                    startSlideshow();
                    slide_name.style.visibility = 'hidden';
                    slide_overview.style.visibility = 'hidden';
                    slide_Rating.style.visibility = 'hidden';
                    for (let h = 0; h < slide_img.length; h++) {
                        slide_img[h].style.opacity = 1;
                    }
                };
            }
            startSlideshow();

            let container = document.getElementById("container");

            function isMovieInFavorites(movieId, storedFavorites) {
                return storedFavorites.includes(movieId);
            }

            function updateFavorites(movieId, storedFavorites) {
                if (!isMovieInFavorites(movieId, storedFavorites)) {
                    storedFavorites.push(movieId);
                } else {
                    const index = storedFavorites.indexOf(movieId);
                    if (index !== -1) {
                        storedFavorites.splice(index, 1);
                    }
                }

                localStorage.setItem('favoriteIds', JSON.stringify(storedFavorites));
            }

            let storedFavorites = JSON.parse(localStorage.getItem('favoriteIds')) || [];

            for (let i = 0; i < json.results.length; i++) {
                let cart = document.createElement("div");
                container.appendChild(cart);
                const movieId = json.results[i].id;
                cart.id = movieId;
                cart.onclick = function () {
                    window.location.href = "detail.html?id=" + encodeURIComponent(movieId);
                };

                let img = document.createElement("img");
                cart.appendChild(img);
                img.src = "https://image.tmdb.org/t/p/original/" + json.results[i].poster_path;

                let fav = document.createElement("i");
                cart.appendChild(fav);
                fav.className = "fas fa-regular fa-heart";
                fav.classList.add("fav");

                if (isMovieInFavorites(movieId, storedFavorites)) {
                    fav.style.color = "red";
                }

                fav.onclick = function (event) {
                    event.stopPropagation();

                    if (fav.style.color !== "red") {
                        fav.style.color = "red";
                        updateFavorites(movieId, storedFavorites);
                    } else {
                        fav.style.color = "";
                        updateFavorites(movieId, storedFavorites);
                    }
                };

                let title = document.createElement("span");
                cart.appendChild(title);
                title.innerHTML = json.results[i].original_title;
                title.className = "title";

                let rating = document.createElement("span");
                let star = document.createElement("i");
                star.className = "fas fa-star";
                star.style.color = "#ffff00";
                cart.appendChild(rating);
                rating.innerHTML = "Rating: ";
                rating.appendChild(star);
                rating.innerHTML += json.results[i].vote_average.toString().slice(0, 3);
                rating.className = "rating";
            }

            let search = document.getElementById("searchTerm");

            search.addEventListener("keyup", function () {
                let searchTerm = search.value.toLowerCase();

                let container = document.getElementById("container");
                let carts = container.querySelectorAll("div");

                for (let i = 0; i < carts.length; i++) {
                    let cart = carts[i];
                    let title = cart.querySelector(".title");
                    let cartName = title.innerHTML.toLowerCase();

                    if (cartName.includes(searchTerm)) {
                        cart.style.display = "block";
                    } else {
                        cart.style.display = "none";
                    }
                }
            });

        }

        if (window.location.pathname.includes("fav.html")) {
            let output = document.getElementById("output");
            const storedIds = JSON.parse(localStorage.getItem('favoriteIds')) || [];

            for (let i = 0; i < storedIds.length; i++) {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${storedIds[i]}?api_key=354ac65aebc36d1585a2fe5d1a303b27`);
                const movieDetails = await response.json();

                let cart = document.createElement("div");
                output.appendChild(cart);
                const movieId = storedIds[i];
                cart.id = movieId;
                cart.onclick = function () {
                    window.location.href = "detail.html?id=" + encodeURIComponent(movieId);
                };

                let img = document.createElement("img");
                cart.appendChild(img);
                img.src = "https://image.tmdb.org/t/p/original/" + movieDetails.poster_path;

                let fav = document.createElement("i");
                cart.appendChild(fav);
                fav.className = "fas fa-regular fa-heart";
                fav.classList.add("fav");
                fav.style.color = "red";

                fav.onclick = function (event) {
                    event.stopPropagation();

                    const index = storedIds.indexOf(movieId);
                    if (index !== -1) {
                        storedIds.splice(index, 1);
                        localStorage.setItem('favoriteIds', JSON.stringify(storedIds));
                    }

                    cart.remove();
                };

                let title = document.createElement("span");
                cart.appendChild(title);
                title.innerHTML = movieDetails.original_title;
                title.className = "title";

                let rating = document.createElement("span");
                let star = document.createElement("i");
                star.className = "fas fa-star";
                star.style.color = "#ffff00";
                cart.appendChild(rating);
                rating.innerHTML = "Rating: ";
                rating.appendChild(star);
                rating.innerHTML += movieDetails.vote_average.toString().slice(0, 3);
                rating.className = "rating";
            }

            let search = document.getElementById("searchTerm");

            search.addEventListener("keyup", function () {
                let searchTerm = search.value.toLowerCase();

                let container = document.getElementById("output");
                let carts = container.querySelectorAll("div");

                for (let i = 0; i < carts.length; i++) {
                    let cart = carts[i];
                    let title = cart.querySelector(".title");
                    let cartName = title.innerHTML.toLowerCase();

                    if (cartName.includes(searchTerm)) {
                        cart.style.display = "block";
                    } else {
                        cart.style.display = "none";
                    }
                }
            });
        }

        if (window.location.pathname.includes("detail.html")) {
            let output = document.getElementById("output");

            const params = new URLSearchParams(window.location.search);
            const movieId = params.get('id');

            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=354ac65aebc36d1585a2fe5d1a303b27`);
            const detail = await response.json();

            let backdrop = document.createElement("img");
            output.appendChild(backdrop);
            backdrop.src = "https://image.tmdb.org/t/p/original/" + detail.backdrop_path;

            let adult = detail.adult;
            console.log(adult);
            if (adult == true) {
                let adult_text = document.createElement("h1");
                output.appendChild(adult_text);
                adult_text.innerHTML = "18+";
                adult_text.id = "adult_text";
            }

            let title = document.createElement("h1");
            output.appendChild(title);
            title.innerHTML = detail.title;
            title.id = "title";

            let release_date = document.createElement("h3")
            output.appendChild(release_date);
            release_date.innerHTML = "release date " + detail.release_date;
            release_date.id = "release_date";

            let vote_average = document.createElement("span");
            let star = document.createElement("i");
            star.className = "fas fa-star";
            star.style.color = "#ffff00";
            output.appendChild(vote_average);
            vote_average.innerHTML = "Rating: ";
            vote_average.appendChild(star);
            vote_average.innerHTML += detail.vote_average.toString().slice(0, 3);
            vote_average.id = "vote_average";

            let overview = document.createElement("p")
            output.appendChild(overview);
            overview.innerHTML = detail.overview;
            overview.id = "overview";

            let genres_container = document.createElement("div")
            output.appendChild(genres_container);
            genres_container.id = "genres_container"
            for (k = 0; k < detail.genres.length; k++) {
                let genres = document.createElement("span")
                genres_container.appendChild(genres);
                genres.innerHTML = detail.genres[k].name;
                genres.id = "genres_" + [k]
            }

        }
    });
