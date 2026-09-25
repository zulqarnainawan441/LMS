const fs = require('fs');

const map = {
    'nav-container': 'nav-wrap',
    'hero-container': 'hero-wrap',
    'nav-actions-mobile': 'nav-mobile',
    'border-top-mobile': 'mobile-divider',
    'hero-img-rounded': 'hero-img',
    'shadow-xl': 'shadow',
    'feature-desc': 'feature-text',
    'course-instructor': 'course-author',
    'course-meta': 'course-info',
    'testimonial-author': 'author',
    'author-info': 'author-details',
    'footer-desc': 'footer-text',
};

const filesToProcess = [
    'f:/LMS-PROJECT/index.html',
    'f:/LMS-PROJECT/css/style.css',
    'f:/LMS-PROJECT/css/responsive.css',
    'f:/LMS-PROJECT/js/main.js',
    'f:/LMS-PROJECT/js/ui.js',
];

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (const file of filesToProcess) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    if (file.endsWith('.html')) {
        for (const [oldClass, newMapping] of Object.entries(map)) {
            content = content.replace(/class\s*=\s*(["'])(.*?)\1/g, (match, quote, classNames) => {
                let classes = classNames.split(/\s+/);
                if (classes.includes(oldClass)) {
                    classes = classes.map(c => c === oldClass ? newMapping : c);
                    return `class=${quote}${classes.join(' ')}${quote}`;
                }
                return match;
            });
        }
    } else if (file.endsWith('.css')) {
        for (const [oldClass, newMapping] of Object.entries(map)) {
            const regex = new RegExp(`\\.${escapeRegExp(oldClass)}(?![a-zA-Z0-9_-])`, 'g');
            content = content.replace(regex, `.${newMapping}`);
        }
    } else if (file.endsWith('.js')) {
        for (const [oldClass, newMapping] of Object.entries(map)) {
            const regex = new RegExp(`\\.${escapeRegExp(oldClass)}(?![a-zA-Z0-9_-])`, 'g');
            content = content.replace(regex, `.${newMapping}`);
            
            content = content.replace(new RegExp(`(['"\`}])${escapeRegExp(oldClass)}\\1`, 'g'), `$1${newMapping}$1`);
        }
    }
    
    fs.writeFileSync(file, content);
}
console.log('First pass map applied.');
