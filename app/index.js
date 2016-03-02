'use strict';

const Rx = require('rx');
const request = require('superagent');
const featuresJson = 'https://www.chromestatus.com/features.json';
let $versions;

document.addEventListener("DOMContentLoaded", domReady);

function domReady() {
  $versions = document.getElementById('versions');

  var requestStream = Rx.Observable.just(featuresJson);
  var responseStream = requestStream.flatMap(requestUrl =>
    Rx.Observable.fromPromise(get(requestUrl))
  ).flatMap(features => features);
  var featuresStream = responseStream.map((feature) => {
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
  var versionsStream = featuresStream.map((feature) => feature.milestone).distinct();

  versionsStream.subscribe(renderVersions);
}

function renderVersions(version) {
  var li = document.createElement('li');

  li.innerText = version;

  $versions.appendChild(li)
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