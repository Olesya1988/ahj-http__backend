const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const Ticket = require('./Ticket').default;

const app = new Koa();
const tickets = [];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use((ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    next();
    return;
  }

  ctx.response.set('Access-Control-Allow-Origin', '*');

  ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');

  ctx.response.status = 204;
});

app.use((ctx, next) => {
  const { name, description, id } = ctx.request.body;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (ctx.request.body.id) {
    
    let search = tickets.find(el => el.id === ctx.request.body.id);
    search.name = ctx.request.body.name;
    search.description = ctx.request.body.description;
  } else {
    const ticket = new Ticket(name, description, id);
    
    if (ticket.name !== undefined) {
      tickets.push(ticket);
    }
  }

  ctx.response.body = tickets;

  next();
});

app.use((ctx, next) => {
  if(ctx.request.method !== 'GET') {
    next();
    return;
  }  
  
  ctx.response.status = 200;
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.body = JSON.stringify(tickets);

  next();
});

app.use((ctx, next) => {
  if(ctx.request.method !== 'PUT') {
      next();
      return;
  }

  if(ctx.request.method === 'PUT') { 
    const deletedTicketId = ctx.request.body.id;
    
    const deletedTicketIndex = tickets.findIndex(el => el.id === deletedTicketId);    

  if (deletedTicketIndex >= 0) {
    tickets.splice(deletedTicketIndex, 1);
  }

  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.body = 'OK';
} 

  next();
});

const server = http.createServer(app.callback());

const port = 7070;

server.listen(port, (err) => {
  if(err) {
    console.log(err);
    return;
  }

  console.log('Server is listening to ' + port);
});