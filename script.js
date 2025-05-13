const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';
const RSS_FEED_URL = 'http://feeds.bbci.co.uk/news/rss.xml';

const newsList = document.getElementById('news-list');

async function fetchNews() {
  try {
    newsList.innerHTML = '<li style="color:#ddd; text-align:center; padding: 20px;">Loading news...</li>';
    const response = await fetch(RSS_TO_JSON_API + encodeURIComponent(RSS_FEED_URL));
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    if (data.status !== 'ok') {
      throw new Error('Failed to load RSS feed');
    }

    renderNews(data.items);
  } catch (error) {
    newsList.innerHTML = `<li style="color:#f88; text-align:center; padding: 20px;">Failed to load news: ${error.message}</li>`;
    console.error('Error fetching news:', error);
  }
}

function renderNews(items) {
  if (items.length === 0) {
    newsList.innerHTML = `<li style="color:#ddd; text-align:center; padding: 20px;">No news articles found.</li>`;
    return;
  }
  newsList.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'news-item';

    const title = document.createElement('h3');
    title.className = 'news-title';
    title.textContent = item.title;
    li.appendChild(title);

    const snippet = document.createElement('p');
    snippet.className = 'news-snippet';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = item.description;
    let text = tempDiv.textContent || tempDiv.innerText || '';
    if (text.length > 120) text = text.slice(0, 117) + '...';
    snippet.textContent = text;
    li.appendChild(snippet);

    const readMore = document.createElement('a');
    readMore.className = 'read-more';
    readMore.href = item.link;
    readMore.target = '_blank';
    readMore.rel = 'noopener noreferrer';
    readMore.textContent = 'Read More';
    readMore.setAttribute('aria-label', 'Read full article: ' + item.title);
    li.appendChild(readMore);

    newsList.appendChild(li);
  });
}

fetchNews();
