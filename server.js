const Koa = require("koa");
const server = new Koa();
const PORT = process.env.PORT || 80

server.use(function* () {
    this.body = '<div style="text-align:center"><br/><br/><h2>Welcome to Kristagram Admin<h2/>';
});

server.listen(PORT, function () {
    console.log('Server running on PORT', PORT)
});
