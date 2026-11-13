module.exports = (req, res) => {
    res.status(404).render('notFound', { title: 'Page Not Found' });
}