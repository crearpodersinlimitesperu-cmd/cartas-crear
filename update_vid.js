const fs = require('fs');

['diego.html', 'fernando-aragon-c1.html'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace old video ID with the new embeddable one
    content = content.replace(/s5R-d5hT32c/g, 'FboYUBlvaL4');
    
    fs.writeFileSync(f, content, 'utf8');
});
