function buildHome(req, res) {
  res.render('home', { title: 'Home' });
}

export default { buildHome };