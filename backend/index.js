import express from 'express';
import session from 'express-session';
import sessionStore from 'session-file-store';
import cookieParser from 'cookie-parser';
import multipart from 'connect-multiparty';
import cors from 'cors';
import { v4 } from 'uuid';

const app = express();
const router = express.Router();
const store = sessionStore(session);
const FRONTEND = process.env.FRONTEND_URL;

// app use
app.use(cors({
    origin: FRONTEND, // 프론트엔드 주소
    credentials: true,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}));
app.use(
    session({
        name: 'node_site_template',
        secret: 'secret secret secret',
        resave: false,
        saveUninitialized: true,
        store: new store(),
        cookie: {
            path: '/',
            secure: false,
            maxAge: 3600000,
            httpOnly: false,
            sameSite: 'lax',
        },
        genid: () => v4().replaceAll('-', '_'),
    })
);
app.use(cookieParser());
app.use(express.urlencoded({extended:true})); // url encode 확장
app.use(express.json()); // request.body를 json타입으로 바꾼다.
app.use(multipart()); // formdata 파싱


// 자동 라우팅
import ar from './router/index.js';
ar.run(router)

// index
router.get('/', (_, res)=>{
    res.json({});
});

// 라우터 적용
app.use('/', router);
app.all('*', (_, res)=>{
    res.status(404).send('<h1>pages not found</h1>');
});

// server on
app.listen(9000, ()=>{
    console.log('server on!');
});