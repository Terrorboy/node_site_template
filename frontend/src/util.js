// env를 사용하기 쉽게 처리
let env = process.env;
for (let key in env) {
    const newKey = key.replace('REACT_APP_', '');
    if (newKey !== key) {
        env[newKey] = env[key];
        delete env[key];
    }
}
export default env;

// body calss 제어
const addBodyClass = className => document.body.classList.add(className);
export { addBodyClass };
const removeBodyClass = className => document.body.classList.remove(className);
export { removeBodyClass };