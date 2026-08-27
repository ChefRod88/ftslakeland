/* Dependency-free HTML partial includes.
 *
 * Usage:
 *   <div data-include="assets/partials/header.html"></div>
 *   <script src="assets/include.js"></script>
 *   <script>includePartials().then(function () { ...code that needs the partials... });</script>
 *
 * Each placeholder is replaced in-place by the fetched markup. Paths are
 * resolved relative to the including document. Returns a Promise that
 * resolves once every partial has been injected (or failed quietly).
 */
(function (global) {
  function includePartials() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-include]'));
    return Promise.all(nodes.map(function (el) {
      return fetch(el.getAttribute('data-include'), { cache: 'no-cache' })
        .then(function (res) { return res.ok ? res.text() : ''; })
        .then(function (html) { if (html) { el.insertAdjacentHTML('afterend', html); } })
        .catch(function () { /* leave the page usable if a partial 404s */ })
        .then(function () { el.parentNode && el.parentNode.removeChild(el); });
    }));
  }
  global.includePartials = includePartials;
}(window));
