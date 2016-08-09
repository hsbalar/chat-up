import request, { Request } from "superagent";

const PROMISE = Symbol("promise");

/**
 * Promise support.
 *
 * @return {Promise}
 */
Request.prototype.promise = function () {

  if (this[PROMISE]) {
    return this[PROMISE];
  }

  return this[PROMISE] = new Promise((resolve, reject) => {
    this.end((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

/**
 * Use Promise/A+ complient then callbacks.
 *
 * @param  {Function} resolve - the resolve callback
 * @param  {Function=} reject - the reject callback
 * @return {Promise}
 */
Request.prototype.then = function (resolve, reject) {
  let promise = this.promise();
  return promise.then.apply(promise, arguments);
};

/**
 * Catch errors.
 *
 * @param  {Function} handler error handler
 * @return {Request}
 */
Request.prototype.catch = function (handler) {
  return this.on("error", handler);
};

/**
 * Reuqest middleware to set default headers
 *
 */
function defaults(request) {
  request.set("Accept", "application/json, text/plain, */*");
  request.set("X-Requested-With", "XMLHttpRequest");
}

/**
 * GET "url"
 *
 * @param  {String} url - the url
 * @return {Request}
 */
request.get = function (url) {
  return new Request("GET", url).use(defaults);
};

/**
 * PUT "url"
 *
 * @param  {String} url - the url
 * @return {Request}
 */
request.put = function (url) {
  return new Request("PUT", url).use(defaults);
};

/**
 * POST "url"
 *
 * @param  {String} url - the url
 * @return {Request}
 */
request.post = function (url) {
  return new Request("POST", url).use(defaults);
};

/**
 * DELETE "url"
 *
 * @param  {String} url - the url
 * @return {Request}
 */
request.del = function (url) {
  return new Request("DELETE", url).use(defaults);
};

/**
 * PATCH "url"
 *
 * @param  {String} url - the url
 * @return {Request}
 */
request.patch = function (url) {
  return new Request("PATCH", url).use(defaults);
};

/**
 * HEAD "url"
 *
 * @param  {String} url - the url
 * @return {Request}
 */
request.head = function (url) {
  return new Request("HEAD", url).use(defaults);
};

export default request;
