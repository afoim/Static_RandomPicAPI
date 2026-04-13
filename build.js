const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'ri');
const DIST = path.join(__dirname, 'dist');

function count(type) {
    const dir = path.join(SRC, type);
    if (!fs.existsSync(dir)) return 0;
    return fs.readdirSync(dir).filter(f => /\.(webp|jpe?g|png|gif)$/i.test(f)).length;
}

fs.mkdirSync(DIST, { recursive: true });

const result = { h: count('h'), v: count('v') };

fs.writeFileSync(path.join(DIST, 'count.json'), JSON.stringify(result));
console.log('Generated count.json:', result);
