/*
    dashboard.js
    Client-side interaction for the LMS Admin Dashboard
    Handles: sidebar toggle, SPA section navigation
*/

document.addEventListener('DOMContentLoaded', function () {

    /* -------------------------------------------------------
       1. SIDEBAR TOGGLE (mobile)
    ------------------------------------------------------- */
    var sidebar        = document.getElementById('sidebar');
    var toggleBtn      = document.getElementById('toggleSidebar');
    var closeBtn       = document.getElementById('closeSidebar');
    var overlay        = document.getElementById('sidebarOverlay');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    function toggleSidebar() {
        if (sidebar && sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (closeBtn)  closeBtn.addEventListener('click',  closeSidebar);
    if (overlay)   overlay.addEventListener('click',   closeSidebar);

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 992) closeSidebar();
    });

    /* -------------------------------------------------------
       2. SPA SECTION NAVIGATION
    ------------------------------------------------------- */

    // All clickable sidebar nav links (those pointing to on-page sections)
    var navLinks = document.querySelectorAll('.admin-nav-link');

    // All content panels (must have class "admin-content-section")
    var sections = document.querySelectorAll('.admin-content-section');

    if (navLinks.length === 0 || sections.length === 0) return; // nothing to do

    /* ----- helpers ----- */

    // Hide every panel
    function hideAllSections() {
        sections.forEach(function (sec) {
            sec.style.display = 'none';
        });
    }

    // Remove active highlight from every sidebar link
    function clearActiveLinks() {
        document.querySelectorAll('.sidebar-menu .sidebar-link').forEach(function (a) {
            a.classList.remove('active');
        });
    }

    // Show one panel and highlight its sidebar link
    function activateSection(targetId, clickedLink) {
        hideAllSections();
        clearActiveLinks();

        var target = document.getElementById(targetId);
        if (!target) {
            console.warn('[dashboard.js] Section not found: #' + targetId);
            return;
        }

        // Use empty string to let the element's own CSS display rule apply,
        // fall back to 'block' so it is always visible
        target.style.display = target.style.display === '' ? 'block' : 'block';
        target.style.removeProperty('display');  // clear inline override first
        // Then force visible in case CSS hides it
        target.style.display = 'block';

        if (clickedLink) clickedLink.classList.add('active');

        // Update browser URL without a page reload
        window.history.pushState(null, '', '#' + targetId);

        // Auto-close sidebar on mobile after navigation
        if (window.innerWidth < 992) closeSidebar();
    }

    /* ----- initial state: hide every section, then show the default ----- */
    hideAllSections();

    // Determine which section should be active on load
    var hash          = window.location.hash.replace('#', '');
    var defaultId     = 'dashboard-overview';
    var startId       = hash || defaultId;

    // Find matching link for the start section
    var startLink = document.querySelector('.admin-nav-link[href="#' + startId + '"]');

    // If hash doesn't match any link, fall back to dashboard
    if (!startLink) {
        startId   = defaultId;
        startLink = document.querySelector('.admin-nav-link[href="#' + defaultId + '"]');
    }

    activateSection(startId, startLink);

    /* ----- click listeners ----- */
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Extract target ID from href="#section-id"
            var href = this.getAttribute('href') || '';
            var targetId = href.startsWith('#') ? href.slice(1) : href;

            if (!targetId) return;

            activateSection(targetId, this);
        });
    });

    /* ----- also support data-target attributes if used elsewhere ----- */
    document.querySelectorAll('[data-target]').forEach(function (el) {
        el.addEventListener('click', function () {
            var targetId = this.getAttribute('data-target');
            if (targetId) activateSection(targetId, null);
        });
    });

});
