import express from 'express'
import { APP_PORT, DB_URL, COOKIE_SECRET } from './app/config/index.js';
import ejs from 'ejs';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path'
import mongoose from 'mongoose';
import session from 'express-session'
import flash from 'express-flash';
import { autoload } from 'laravel-mix';
const route = require('./routes/web');
import MongoStore from 'connect-mongo';
import passport from 'passport';
import passportInit from './app/config/passport'
import EventEmitter from 'events';

/*yarn watch 
  npm run dev
*/
const app = express();
//Data base connection
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('DB Connected...')
})

//Session store (Storeing cokies session in db)
const sessionStore = MongoStore.create({
    client: db.getClient(),
    collectionName: "sessions"
})

//Event emitter
const eventEmitter = new EventEmitter()
app.set('emitter',eventEmitter)


//Session config
app.use(session({
    secret: COOKIE_SECRET,
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //24 hour
}))
//Passport config
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session()) 

app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Global middleware

app.use((req,res,next)=>{
   res.locals.session =req.session
   res.locals.user=req.user
   next()
});
//set template engine
app.use(expressEjsLayouts)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');
route(app);
app.use((req,res)=>{
res.status(404).render('errors/404')
})

const server =app.listen(APP_PORT, () => {
    console.log("listning");
});

const io=require('socket.io')(server)
io.on('connection',(socket)=>{
    //Join 
    socket.on('join',(orderID)=>{
        socket.join(orderID)
    })
})
eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

eventEmitter.on('orderPlaced',(data)=>
{
    io.to('adminRoom').emit('orderPlaced',data)

})