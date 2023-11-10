
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
const modelPath = path.join(__dirname, 'models');
const modelFile = fs.readdirSync(modelPath).filter(file=>!['index.js', 'example.js'].includes(file));
const models = {};

for (const [_, file] of Object.entries(modelFile)) {
    const modelName = file.replace('.js', '');
    const model = await import(`${modelPath}/${file}`);
    models[`${modelName}`] = model.default;
}

export default models;