const Rx = require('rx');
const request = require('superagent');
const featuresJson = 'https://www.chromestatus.com/features.json';

document.addEventListener("DOMContentLoaded", domReady);

function domReady() {
  var requestStream = Rx.Observable.just(featuresJson);
  var responseStream = requestStream.flatMap(requestUrl => 
    Rx.Observable.fromPromise(get(requestUrl))
  );
  var fooStream = responseStream.map((feature) => {
    return {
      name: feature.name,
      summary: feature.summary,
      created: feature.created,
      updated: feature.updated,
      category: feature.category,
      status: feature.impl_status_chrome,
      milestone: feature.shipped_milestone
    }
  });
  // responseStream.subscribe(console.log.bind(console));
  // shipped_milestone, name, summary, created, updated, category, impl_status_chrome (No active development, Proposed, In development, Behind a flag, Enabled by default)
  fooStream.subscribe(next, err, completed);
  // responseStream.subscribe(next, err, completed);
}

function next() {
  console.log('next');
}

function err() {

}

function completed() {
  console.log('completed');
} 

function get(url) {
  return new Promise((resolve) => {
    request
      .get(url)
      .end(function(err, res) {
        if (err) return reject(err);

        resolve(res.body);
      });
  });
}