const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'ri');
const DIST = path.join(__dirname, 'dist');

function processType(type) {
    const srcDir = path.join(SRC, type);
    const distDir = path.join(DIST, 'ri', type);

    if (!fs.existsSync(srcDir)) return 0;

    fs.mkdirSync(distDir, { recursive: true });

    const files = fs.readdirSync(srcDir).filter(f => /\.(webp|jpe?g|png|gif)$/i.test(f));

    files.forEach((file, i) => {
        fs.copyFileSync(path.join(srcDir, file), path.join(distDir, `${i + 1}.webp`));
    });

    return files.length;
}

fs.mkdirSync(DIST, { recursive: true });

const result = { h: processType('h'), v: processType('v') };

fs.writeFileSync(path.join(DIST, 'count.json'), JSON.stringify(result));
console.log('Done:', result);
