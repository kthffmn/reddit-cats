var RedditService = {
  fetchCatHeadlines: function() {
    return fetch('https://www.reddit.com/r/cats.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(metadata) {
        return metadata.data.children;
      });
  }
};

var addHeadlinesToPage = function(redditService) {
  redditService.fetchCatHeadlines()
    .then(function(headlines) {
      var app = document.getElementById('app')
      app.appendChild(createOrderedList(headlines));
    });
}

var createOrderedList = function(headlines) {
  var orderedList = document.createElement('ol');
  orderedList.setAttribute('id', 'headlines');
  headlines.slice(0, 10).map(function(headline) {
    orderedList.appendChild(createListItem(headline));
  });
  return orderedList;
}

var createListItem = function(headline) {
  var listItem = document.createElement('li');
  var link = document.createElement('a');
  link.setAttribute('href', headline.data.url);
  link.setAttribute('target', '_blank');
  link.text = headline.data.title;
  listItem.appendChild(link);
  return listItem;
}