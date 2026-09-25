const fs = require('fs');
const path = require('path');

const projectDir = 'f:/LMS-PROJECT';

const classMap = {
    // 1. Navigation
    'nav': 'nav',
    'nav-actions': 'nav-actions',
    'nav-actions-mobile': 'nav-actions-mobile',
    // Let's keep nav-container as navbar-inner or skip as it might clash.
    'nav-toggle': 'nav-toggle',

    // 2. Headings & Hero
    // 'hero-container' -> 'row' ? No, 'hero-row' or 'container'. It's already in .container.
    'hero-text': 'hero-text',
    'hero-actions': 'hero-actions',

    // 3. Grids (combining with base grid)
    'features-grid': 'grid.features|grid features',
    'courses-grid': 'grid.courses|grid courses',
    'testimonials-grid': 'grid.testimonials|grid testimonials',
    'dashboard-grid': 'grid.dashboard|grid dashboard',
    'dashboard-sub-grid': 'grid.dashboard-sub|grid dashboard-sub',
    'stats': 'stats',

    // 4. Forms
    'row': 'row',
    'col': 'col',
    'form-error': 'form-error',
    // form-group, form-label, form-input exist

    // 5. Dashboard
    'dashboard': 'dashboard',
    'main': 'main',

    // 6. Cards
    'course-card': 'card.course|card course',
    'card-body': 'card-body',
    'card-title': 'card-title',
    'card-footer': 'card-footer',
    
    'feature-card': 'card.feature|card feature',
    'card-title': 'card-title',
    
    'testimonial-card': 'card.testimonial|card testimonial',
    
    // Auth Cards
    'auth-card': 'card.auth|card auth',
    'card-header': 'card-header',
    'card-title': 'card-title',
    
    // 7. Modals
    'modal': 'modal',

    // Sidebar
    'sidebar-menu': 'sidebar-menu',
    // In dashboard the links are `<a class="sidebar-link">`, we want 'sidebar-link'
    // but what if they are 'sidebar-link' somewhere else?
};

function getAllFiles(dir, exts, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'assets') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, exts, fileList);
        } else if (exts.includes(path.extname(filePath))) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = getAllFiles(projectDir, ['.html']);
const cssFiles = getAllFiles(projectDir, ['.css']);
const jsFiles = getAllFiles(projectDir, ['.js']);

let changesCount = 0;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// 1. Process CSS files
for (const file of cssFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    for (const [oldClass, newMapping] of Object.entries(classMap)) {
        const replacement = newMapping.includes('|') ? newMapping.split('|')[0] : newMapping;
        
        // Match .oldClass\b or .oldClass: or .oldClass.
        // We have to be careful not to match .oldClass-something
        // Regex: \.oldClass(?![a-zA-Z0-9_-])
        const regex = new RegExp(`\\.${escapeRegExp(oldClass)}(?![a-zA-Z0-9_-])`, 'g');
        content = content.replace(regex, `.${replacement}`);
    }
    
    // Replaced specially for 'sidebar-link' in dashboard.css
    if (file.includes('dashboard.css')) {
        content = content.replace(/\.sidebar-link(?![a-zA-Z0-9_-])/g, '.sidebar-link');
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        changesCount++;
    }
}

// 2. Process HTML files
for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    for (const [oldClass, newMapping] of Object.entries(classMap)) {
        const replacement = newMapping.includes('|') ? newMapping.split('|')[1] : newMapping;
        
        // We match class="(anything)oldClass(anything)"
        const regex = new RegExp(`(class\\s*=\\s*["'][^"']*(?:\\s+))${escapeRegExp(oldClass)}((?:\\s+)[^"']*["'])|(class\\s*=\\s*["'])${escapeRegExp(oldClass)}((?:\\s+)[^"']*["'])|(class\\s*=\\s*["'][^"']*(?:\\s+))${escapeRegExp(oldClass)}(["'])|(class\\s*=\\s*["'])${escapeRegExp(oldClass)}(["'])`, 'g');
        
        // We can do it simpler: replace exact words inside class="..."
        // But JS regex doesn't have lookbehind easily for arbitrary length, so let's parse class="..." values
        content = content.replace(/class\s*=\s*(["'])(.*?)\1/g, (match, quote, classNames) => {
            let classes = classNames.split(/\s+/);
            if (classes.includes(oldClass)) {
                classes = classes.map(c => c === oldClass ? replacement : c);
                // remove duplicates natively by putting in Set, but 'card course' should be split!
                let flattened = [];
                for(let c of classes) {
                    if(c.includes(' ')) {
                        flattened.push(...c.split(' '));
                    } else {
                        flattened.push(c);
                    }
                }
                let unique = [...new Set(flattened)].filter(Boolean);
                return `class=${quote}${unique.join(' ')}${quote}`;
            }
            return match;
        });
    }

    // Specially replace nav-item -> sidebar-link in dashboard pages
    if (content.includes('sidebar')) {
        content = content.replace(/class\s*=\s*(["'])(.*?)\1/g, (match, quote, classNames) => {
            let classes = classNames.split(/\s+/);
            if (classes.includes('sidebar-link')) { // it's dashboard
                classes = classes.map(c => c === 'sidebar-link' ? 'sidebar-link' : c);
                return `class=${quote}${classes.join(' ')}${quote}`;
            }
            return match;
        });
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        changesCount++;
    }
}

// 3. Process JS files
for (const file of jsFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    for (const [oldClass, newMapping] of Object.entries(classMap)) {
        const classReplacement = newMapping.includes('|') ? newMapping.split('|')[1].split(' ') : [newMapping];
        const cssReplacement = newMapping.includes('|') ? newMapping.split('|')[0] : newMapping;
        
        // querySelector('.oldClass')
        content = content.replace(new RegExp(`\\.${escapeRegExp(oldClass)}(?![a-zA-Z0-9_-])`, 'g'), `.${cssReplacement}`);
        
        // classList.add('oldClass')
        // We will just replace the exact word inside quotes.
        // E.g 'oldClass' -> 'newClass'
        // If there are multiple classes, classList.add('card', 'course') 
        if (classReplacement.length === 1) {
            content = content.replace(new RegExp(`(['"\`])${escapeRegExp(oldClass)}\\1`, 'g'), `$1${classReplacement[0]}$1`);
        } else {
            // For classList.remove/add with multiple, it needs to be `'card', 'course'`
            const multiString = classReplacement.map(c => `'${c}'`).join(', ');
            content = content.replace(new RegExp(`classList\\.add\\(\\s*['"\`]${escapeRegExp(oldClass)}['"\`]\\s*\\)`, 'g'), `classList.add(${multiString})`);
            content = content.replace(new RegExp(`classList\\.remove\\(\\s*['"\`]${escapeRegExp(oldClass)}['"\`]\\s*\\)`, 'g'), `classList.remove(${multiString})`);
            content = content.replace(new RegExp(`classList\\.contains\\(\\s*['"\`]${escapeRegExp(oldClass)}['"\`]\\s*\\)`, 'g'), `classList.contains('${classReplacement[classReplacement.length - 1]}')`);
        }
    }
    
    // nav-item -> sidebar-link in JS
    content = content.replace(/\.sidebar-link(?![a-zA-Z0-9_-])/g, '.sidebar-link');
    content = content.replace(/(['"`])nav-item\1/g, `$1sidebar-link$1`);

    if (content !== original) {
        fs.writeFileSync(file, content);
        changesCount++;
    }
}

console.log(`Refactored classes across ${changesCount} files.`);
