const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./resources/js');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Regex to match "rounded-" or "rounded-t-" immediately followed by space, quote, or backtick
    let newContent = content.replace(/rounded-((?:t-|b-|l-|r-|tl-|tr-|bl-|br-)?)(?=[\s"'`])/g, 'rounded-$1lg');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log('Fixed: ' + file);
    }
});
