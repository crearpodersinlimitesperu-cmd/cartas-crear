const fs = require('fs');

['diego.html', 'fernando-aragon-c1.html'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace old link
    content = content.replace(/https:\/\/chat\.google\.com\/"/g, 'https://chat.google.com/room/AAQAj8M5Q-8?cls=7"');
    
    // Clean up duplicate script if it exists from previous run
    const scriptSplit = content.split('var tag = document.createElement(\'script\');');
    if(scriptSplit.length > 2) {
        // It was duplicated, let's fix it manually or just use git restore.
    }

    fs.writeFileSync(f, content, 'utf8');
});
