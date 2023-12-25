const fs = require('fs');

let data = "console.log('Hello, World!');";

fs.writeFileSync('dummy.js', data, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});


const { exec } = require('child_process');

exec('node dummy.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});

