describe("RedditService", function() {
  describe(".fetchCatHeadlines", function() {
    var headlinePromise;
    var promiseHelper;

    beforeEach(function() {
      var fetchPromise = new Promise(function(resolve, reject) {
        promiseHelper = {
          resolve: resolve,
          reject: reject
        };
      });
      spyOn(window, 'fetch').and.returnValue(fetchPromise);
      headlinePromise = RedditService.fetchCatHeadlines();
    });

    it('fetches from the reddit cat API', function() {
      expect(window.fetch).toHaveBeenCalledWith('https://www.reddit.com/r/cats.json');
    });

    it('returns a promise', function() {
      expect(headlinePromise).toEqual(jasmine.any(Promise));
    });

    describe('on successful fetch', function() {
      beforeEach(function() {
        var response = new Response(JSON.stringify({
          data: {
            children: [
              {headline: 'object1'},
              {headline: 'object2'}
            ]
          }
        }));
        promiseHelper.resolve(response);
      });

      it('resolves its promise with a list of headlines', function(done) {
        headlinePromise.then(function(headlines) {
          expect(headlines.length).toEqual(2);
          done();
        });
      });
    });
  });
});

describe('.addHeadlinesToPage', function() {
  beforeEach(function() {
    fakeRedditService = {};
    fakeRedditService.fetchCatHeadlines = function() {
      return {
        then: function(callback) {
          return callback([
            {data: {url: 'http://someurl1.com', title: 'some title 1'}},
            {data: {url: 'http://someurl2.com', title: 'some title 2'}},
            {data: {url: 'http://someurl3.com', title: 'some title 3'}},
            {data: {url: 'http://someurl4.com', title: 'some title 4'}},
            {data: {url: 'http://someurl5.com', title: 'some title 5'}},
            {data: {url: 'http://someurl6.com', title: 'some title 6'}},
            {data: {url: 'http://someurl7.com', title: 'some title 7'}},
            {data: {url: 'http://someurl8.com', title: 'some title 8'}},
            {data: {url: 'http://someurl9.com', title: 'some title 9'}},
            {data: {url: 'http://someurl10.com', title: 'some title 10'}},
            {data: {url: 'http://someurl11.com', title: 'some title 11'}}
          ]);
        }
      };
    };

    addHeadlinesToPage(fakeRedditService);
  });

  it('adds ten headlines to the page with links', function() {
    var headlines = document.getElementById('headlines').children;
    expect(headlines.length).toEqual(10);

    firstHeadline = headlines[0];
    lastHeadline = headlines[9];

    expect(firstHeadline.children[0].href).toEqual('http://someurl1.com/');
    expect(firstHeadline.textContent).toEqual('some title 1');

    expect(lastHeadline.children[0].href).toEqual('http://someurl10.com/');
    expect(lastHeadline.textContent).toEqual('some title 10');
  });
});
