import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
const routerPath = path.join(__dirname, 'router');
const routerFile = fs.readdirSync(routerPath).filter(file=>!['index.js', 'example.js'].includes(file));
const routers = {};

for (const [_, file] of Object.entries(routerFile)) {
    const routerName = file.replace('.js', '');
    const router = await import(`${routerPath}/${file}`);
    routers[`${routerName}`] = router.default;
}

const run = (routes)=>{
    for (let key in routers) {
        // 해당 속성이 함수인지 확인
        if (typeof routers[key] === 'function') {
            routers[key](routes); // 함수 실행
        }
    }
}
export default { run };