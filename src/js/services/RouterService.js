let _router = null;

export function register(router) {
  _router = router;
}

export default {
  get: () => _router,
};
