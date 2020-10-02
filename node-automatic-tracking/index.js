const port = process.env.PORT || 3001

const express = require('express');
const bodyParser = require('body-parser');
const application = express();
const activeWin = require('active-win');

// middleware
application.use(bodyParser.json());

application.listen(port), ()=>{
  console.log("Server started");
}; 


application.get('/activeWindow', (req, res) => {
   
    (async () => {
        const win = await activeWin()
        console.log(win)
        return res.status(200).json({ id : win.id, title : win.title });

    })();

});
