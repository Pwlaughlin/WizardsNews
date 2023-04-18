const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");


const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));



// app.get("/", (req, res) => res.send("Hello World!"));
app.get('/', (req, res) =>{
  
  const posts = postBank.list();
  
  const html = `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        ${posts.map(post => `
          <div class='news-item'>
            <p>
              <span class="news-position">${post.id}. ▲</span>
              <a href="/posts/${post.id}">${post.title}</a>
              <small>(by ${post.name})</small>
              
            </p>
            <small class="news-info">
              ${post.upvotes} upvotes | ${post.date}
            </small>
          </div>`
        ).join('')}
      </div>
    </body>
  </html>`;
    
    
    res.send(html);
});
app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    // If the post wasn't found, set the HTTP status to 404 and send Not Found HTML
    res.status(404)
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>404: Page Not Found</p>
        <img src ="https://media.tenor.com/UUS_Z-t_R-QAAAAM/wizard-face-palm.gif"/>
      </div>
    </body>
    </html>`
    res.send(html)
  } else {
  res.send(`<!DOCTYPE html>
    <html>
    <head>
      <title>${post.title}</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="news-list">
        <h1> ${post.title}</h1>
        <small>(by ${post.name})</small>
        <small>${post.date}</small>
        <p>
        <p>${post.content}</p>
        <span class="news-position">ID:${post.id}. ▲</span>
        <span class="news-position">Votes ${post.upvotes}</span>
      </p>
      </div>
      </body>
    </html>`);
  };
  });


const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
