/*
 Service Worker implementation
 inspired from https://github.com/GoogleChromeLabs/airhorn/blob/master/app/sw.js
 */

let version = '1.0.0';


self.addEventListener('install', e => {
  // build cache URLs
  // build helper array
  let numArr = new Array(10);
  for (let i = 0; i < 10; i++) {
    numArr[i] = i+1;
  }
  // build paths
  let images = numArr.map(x => '/img/' + x + '.jpg');
  let restaurants = numArr.map(x => '/restaurant.html?id=' + x);
  console.log(images);
  console.log(restaurants);
  // main array
  let cacheURLs = [
    `/`,
    `/index.html`,
    `/css/styles.css`,
    `/data/restaurants.json`,
    `/js/dbhelper.js`,
    `/js/main.js`,
    `/js/restaurant_info.js`,
    `/js/load_sw.js`
  ];
  Array.prototype.push.apply(cacheURLs, images);
  Array.prototype.push.apply(cacheURLs, restaurants);

  console.log(cacheURLs);

  // set
  e.waitUntil(
    caches.open('mws-rrs1-' + version).then(cache => {
      return cache.addAll(cacheURLs).then(() => self.skipWaiting());
    })
  )
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});
