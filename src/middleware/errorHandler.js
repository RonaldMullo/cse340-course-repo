// 404 - se ejecuta cuando ninguna ruta anterior respondió (debe ir DESPUÉS de todas las rutas)
function notFound(req, res, next) {
  res.status(404).render('errors/404', { title: 'Page Not Found' });
}

// 500 - manejador de errores de Express (firma con 4 parámetros: err, req, res, next)
// Debe ir al FINAL de todo, después de notFound y de todas las demás rutas/middleware.
function serverError(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('errors/500', { title: 'Server Error' });
}

export { notFound, serverError };