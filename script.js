const apiKey = '8f77338e23d849d1bdabf2c253a59b7f'; // Replace with your actual News API key
const newsList = document.getElementById('news-list');
const categorySelect = document.getElementById('category-select');
const searchBar = document.getElementById('search-bar');
const refreshButton = document.getElementById('refresh-button');

async function fetchNews() {
  const category = categorySelect.value;
  const query = searchBar.value.trim();
  let url;

  // Construct the URL based on whether a search query is provided
  if (query) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`;
  }

  newsList.innerHTML = '<li style="text-align:center; padding: 20px; color: #ddd;">Loading news...</li>';

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Check for errors in the response
    if (data.status === 'error') {
      throw new Error(data.message);
    }

    displayNews(data.articles || []);
  } catch (error) {
    newsList.innerHTML = `<li style="text-align:center; padding: 20px; color: red;">${error.message}</li>`;
  }
}

function displayNews(articles) {
  newsList.innerHTML = '';
  if (!articles.length) {
    newsList.innerHTML = '<li style="text-align:center; padding: 20px; color: #ddd;">No news found.</li>';
    return;
  }

  for (const item of articles) {
    const li = document.createElement('li');
    li.className = 'news-item';

    li.innerHTML = `
      <h3 class="news-title">${item.title}</h3>
      <p class="news-snippet">${item.description ? item.description.slice(0, 100) : ''}...</p>
      <a class="read-more" href="${item.url}" target="_blank">Read More</a>
    `;

    newsList.appendChild(li);
  }
}

refreshButton.addEventListener('click', fetchNews);
categorySelect.addEventListener('change', fetchNews);
searchBar.addEventListener('keypress', e => {
  if (e.key === 'Enter') fetchNews();
});

// Initial fetch
fetchNews();
