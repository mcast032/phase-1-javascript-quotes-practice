document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');

    // Fetch and display quotes
    fetchQuotes();

    // Handle form submission to add a new quote
    newQuoteForm.addEventListener('submit', event => {
        event.preventDefault();
        addNewQuote();
    });

    // Fetch and display quotes
    function fetchQuotes() {
        fetch('http://localhost:3000/quotes?_embed=likes')
            .then(response => response.json())
            .then(quotes => {
                quotes.forEach(quote => {
                    displayQuote(quote);
                });
            })
            .catch(error => console.error('Error fetching quotes:', error));
    }

    // Add a new quote
    function addNewQuote() {
        const newQuote = document.getElementById('new-quote').value;
        const author = document.getElementById('author').value;

        const quoteData = {
            quote: newQuote,
            author: author
        };

        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quoteData)
        })
        .then(response => response.json())
        .then(quote => {
            displayQuote(quote);
            newQuoteForm.reset();
        })
        .catch(error => console.error('Error adding new quote:', error));
    }

    // Display a quote
    function displayQuote(quote) {
        const li = document.createElement('li');
        li.className = 'quote-card';
        li.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
        `;

        const deleteButton = li.querySelector('.btn-danger');
        const likeButton = li.querySelector('.btn-success');

        // Handle delete button click
        deleteButton.addEventListener('click', () => {
            deleteQuote(quote.id, li);
        });

        // Handle like button click
        likeButton.addEventListener('click', () => {
            likeQuote(quote.id, likeButton);
        });

        quoteList.appendChild(li);
    }

    // Delete a quote
    function deleteQuote(quoteId, quoteElement) {
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: 'DELETE'
        })
        .then(() => {
            quoteElement.remove();
        })
        .catch(error => console.error('Error deleting quote:', error));
    }

    // Like a quote
    function likeQuote(quoteId, likeButton) {
        const likeData = {
            quoteId: quoteId,
            createdAt: Math.floor(Date.now() / 1000) // UNIX timestamp
        };

        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(likeData)
        })
        .then(response => response.json())
        .then(() => {
            const likeCountSpan = likeButton.querySelector('span');
            likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
        })
        .catch(error => console.error('Error liking quote:', error));
    }
});
