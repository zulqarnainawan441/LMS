/**
 * ui.js
 * Handles global UX enhancements like Toast Notifications, Page Loading, and CSS structural animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Page Loader
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.prepend(loader);

    // Fade out load screen
    setTimeout(() => {
        loader.classList.add('loaded');
        // Add fade-in-up class to main elements if they exist
        const animatables = document.querySelectorAll('.card, .stat-card, .card.feature, .card.course');
        animatables.forEach((el, index) => {
            el.classList.add('animate-fade-in-up');
            el.style.animationDelay = `${(index % 5) * 0.1}s`;
            // Add global hover lift to cards
            if(!el.classList.contains('p-0')) {
                el.classList.add('hover-lift');
            }
        });
    }, 300); // slight delay to ensure visual impact

    // 2. Toast Notification System Setup
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.id = 'toastContainer';
    document.body.appendChild(toastContainer);

    window.showToast = (title, message, type = 'info') => {
        const container = document.getElementById('toastContainer');
        
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        toast.innerHTML = `
            <div class="toast-icon"><i class="${icons[type] || icons['info']}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;

        container.appendChild(toast);

        // Animate In
        setTimeout(() => toast.classList.add('toast-show'), 10);

        // Close button event
        toast.querySelector('.toast-close').addEventListener('click', () => {
            closeToast(toast);
        });

        // Auto remove
        setTimeout(() => {
            closeToast(toast);
        }, 4000);
    };

    function closeToast(toast) {
        toast.classList.remove('toast-show');
        setTimeout(() => {
            if(toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 400); // match transition duration
    }

    // 3. Demo trigger (For demonstration on any page click not on an A tag or Input)
    /*
    document.body.addEventListener('dblclick', (e) => {
        const types = ['success', 'info', 'warning', 'error'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        window.showToast('System Notification', 'This is a demo interactive toast notification.', randomType);
    });
    */

    // 4. AI Assistant System
    const aiAssistantHTML = `
        <div class="ai-assistant">
            <div class="ai-chat" id="aiChat">
                <div class="ai-chat-header">
                    <h4><i class="fas fa-robot"></i> AI Assistant</h4>
                    <button id="aiCloseBtn"><i class="fas fa-times"></i></button>
                </div>
                <div class="ai-chat-messages" id="aiChatMessages">
                    <div class="ai-message ai-reply">Hi! How can I help you today?</div>
                </div>
                <div class="ai-chat-input">
                    <input type="text" class="ai-input" id="aiInput" placeholder="Ask me something...">
                    <button id="aiSendBtn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <button class="ai-btn" id="aiToggleBtn">
                <i class="fas fa-robot"></i>
            </button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', aiAssistantHTML);

    const aiToggleBtn = document.getElementById('aiToggleBtn');
    const aiChat = document.getElementById('aiChat');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const aiInput = document.getElementById('aiInput');
    const aiSendBtn = document.getElementById('aiSendBtn');
    const aiChatMessages = document.getElementById('aiChatMessages');

    aiToggleBtn.addEventListener('click', () => {
        aiChat.classList.toggle('active');
    });

    aiCloseBtn.addEventListener('click', () => {
        aiChat.classList.remove('active');
    });

    const addMessage = (text, type) => {
        const msg = document.createElement('div');
        msg.className = `ai-message ${type === 'user' ? 'ai-user' : 'ai-reply'}`;
        msg.textContent = text;
        aiChatMessages.appendChild(msg);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    };

    const handleSend = () => {
        const text = aiInput.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        aiInput.value = '';
        
        // Simulate AI thinking delay
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let reply = "I'm a simple AI assistant. I don't know much, but I'm here to help!";
            if (lowerText.includes('course')) {
                reply = "You can explore courses in the Courses section.";
            } else if (lowerText.includes('assignment')) {
                reply = "Check your assignments in the dashboard.";
            } else if (lowerText.includes('quiz')) {
                reply = "Go to quiz section to test your knowledge.";
            }
            addMessage(reply, 'ai');
        }, 600);
    };

    aiSendBtn.addEventListener('click', handleSend);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // 5. Search Functionality
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const searchableItems = document.querySelectorAll('.card.course, .task-item, .progress-item');
            
            if (searchableItems.length === 0) return;

            let matchCount = 0;
            searchableItems.forEach(item => {
                const titleEl = item.querySelector('.card-title, h4');
                if (titleEl) {
                    const title = titleEl.textContent.toLowerCase();
                    if (title.includes(query)) {
                        item.style.display = '';
                        matchCount++;
                    } else {
                        item.style.display = 'none';
                    }
                }
            });

            // Handle "No results found" message
            let noResultsMsg = document.getElementById('noResultsMsg');
            if (matchCount === 0 && query !== '') {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.id = 'noResultsMsg';
                    noResultsMsg.className = 'text-center text-muted mt-4 w-100 animate-fade-in-up';
                    noResultsMsg.style.padding = '2rem';
                    noResultsMsg.innerHTML = '<i class="fas fa-search fa-2x mb-2 text-light"></i><br>No results found matching your search.';
                    
                    const container = searchableItems[0].parentElement;
                    container.appendChild(noResultsMsg);
                }
                noResultsMsg.style.display = 'block';
            } else {
                if (noResultsMsg) {
                    noResultsMsg.style.display = 'none';
                }
            }
        });
    });

    // -------------------------------------------------------
    // 6. PAGE UP / PAGE DOWN FLOATING BUTTONS
    // -------------------------------------------------------

    // Inject the button group into the DOM (above AI assistant)
    const scrollGroupHTML = `
        <div class="scroll-btn-group" id="scrollBtnGroup" role="navigation" aria-label="Page navigation">
            <button class="scroll-btn scroll-up" id="scrollUpBtn" title="Scroll to top" aria-label="Scroll to top">
                <i class="fas fa-chevron-up"></i>
            </button>
            <button class="scroll-btn scroll-down" id="scrollDownBtn" title="Scroll to bottom" aria-label="Scroll to bottom">
                <i class="fas fa-chevron-down"></i>
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', scrollGroupHTML);

    // Use both ID and class selector as belt-and-suspenders
    const scrollUpBtn   = document.getElementById('scrollUpBtn')   || document.querySelector('.scroll-up');
    const scrollDownBtn = document.getElementById('scrollDownBtn') || document.querySelector('.scroll-down');
    const scrollGroup   = document.getElementById('scrollBtnGroup');

    if (!scrollUpBtn || !scrollDownBtn) return; // safety guard

    // --- Initial state: hide both buttons ---
    scrollUpBtn.style.display   = 'none';
    scrollDownBtn.style.display = 'none';

    // --- Click: Scroll to top (Page Up) ---
    scrollUpBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Click: Scroll to bottom (Page Down) ---
    scrollDownBtn.addEventListener('click', function () {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    // --- Visibility logic: show after 100px scroll ---
    const handleScrollVisibility = function () {
        if (window.scrollY > 100) {
            scrollUpBtn.style.display   = 'flex';
            scrollDownBtn.style.display = 'flex';
            if (scrollGroup) scrollGroup.classList.add('scroll-visible');
        } else {
            scrollUpBtn.style.display   = 'none';
            scrollDownBtn.style.display = 'none';
            if (scrollGroup) scrollGroup.classList.remove('scroll-visible');
        }
    };

    // Throttled scroll listener for performance
    let scrollTicking = false;
    window.addEventListener('scroll', function () {
        if (!scrollTicking) {
            window.requestAnimationFrame(function () {
                handleScrollVisibility();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // Run once on load
    handleScrollVisibility();

});
