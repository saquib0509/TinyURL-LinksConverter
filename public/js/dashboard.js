const API_BASE = window.location.origin;

let allLinks = [];
let filteredLinks = [];

const createForm = document.getElementById('createForm');
const targetUrlInput = document.getElementById('targetUrl');
const customCodeInput = document.getElementById('customCode');
const urlError = document.getElementById('urlError');
const codeError = document.getElementById('codeError');
const successMessage = document.getElementById('successMessage');
const shortUrlLink = document.getElementById('shortUrlLink');
const copyBtn = document.getElementById('copyBtn');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const errorState = document.getElementById('errorState');
const linksTableContainer = document.getElementById('linksTableContainer');
const linksTableBody = document.getElementById('linksTableBody');

document.addEventListener('DOMContentLoaded', () => {
    loadLinks();
    setupEventListeners();
});

function setupEventListeners() {
    createForm.addEventListener('submit', handleCreateLink);
    copyBtn.addEventListener('click', handleCopyLink);
    refreshBtn.addEventListener('click', loadLinks);
    searchInput.addEventListener('input', handleSearch);
    sortSelect.addEventListener('change', handleSort);
}

async function handleCreateLink(e) {
    e.preventDefault();
    
    urlError.textContent = '';
    codeError.textContent = '';
    successMessage.classList.add('hidden');
    targetUrlInput.classList.remove('error');
    customCodeInput.classList.remove('error');

    const targetUrl = targetUrlInput.value.trim();
    const code = customCodeInput.value.trim();

    if (!isValidUrl(targetUrl)) {
        urlError.textContent = 'Please enter a valid URL starting with http:// or https://';
        targetUrlInput.classList.add('error');
        return;
    }

    if (code && !isValidCode(code)) {
        codeError.textContent = 'Code must be 6-8 alphanumeric characters';
        customCodeInput.classList.add('error');
        return;
    }

    const submitBtn = createForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating...';

    try {
        const body = { targetUrl };
        if (code) body.code = code;

        const response = await fetch(`${API_BASE}/api/links`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 409) {
                codeError.textContent = data.error || 'Code already exists';
                customCodeInput.classList.add('error');
            } else {
                urlError.textContent = data.error || 'Failed to create link';
                targetUrlInput.classList.add('error');
            }
            return;
        }

        const shortUrl = `${API_BASE}/${data.code}`;
        shortUrlLink.href = shortUrl;
        shortUrlLink.textContent = shortUrl;
        successMessage.classList.remove('hidden');

        createForm.reset();
        loadLinks();
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        urlError.textContent = 'Network error. Please try again.';
        console.error('Error creating link:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Shorten URL';
    }
}

async function loadLinks() {
    loadingState.classList.remove('hidden');
    emptyState.classList.add('hidden');
    errorState.classList.add('hidden');
    linksTableContainer.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE}/api/links`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch links');
        }

        allLinks = await response.json();
        filteredLinks = [...allLinks];

        loadingState.classList.add('hidden');

        if (allLinks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            linksTableContainer.classList.remove('hidden');
            renderLinks(filteredLinks);
        }

    } catch (error) {
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        console.error('Error loading links:', error);
    }
}

function renderLinks(links) {
    if (links.length === 0) {
        linksTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">
                    No links found matching your search.
                </td>
            </tr>
        `;
        return;
    }

    linksTableBody.innerHTML = links.map(link => `
        <tr>
            <td class="code-cell">${escapeHtml(link.code)}</td>
            <td class="url-cell" title="${escapeHtml(link.targetUrl)}">
                ${escapeHtml(link.targetUrl)}
            </td>
            <td class="clicks-cell">${link.clicks}</td>
            <td>${formatDate(link.lastClickedAt)}</td>
            <td>${formatDate(link.createdAt)}</td>
            <td class="actions-cell">
                <button class="btn btn-small btn-view" onclick="viewStats('${escapeHtml(link.code)}')">
                    View Stats
                </button>
                <button class="btn btn-small btn-delete" onclick="deleteLink('${escapeHtml(link.code)}')">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
}

function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        filteredLinks = [...allLinks];
    } else {
        filteredLinks = allLinks.filter(link => 
            link.code.toLowerCase().includes(query) ||
            link.targetUrl.toLowerCase().includes(query)
        );
    }
    
    handleSort();
}

function handleSort() {
    const sortBy = sortSelect.value;
    
    switch(sortBy) {
        case 'newest':
            filteredLinks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            filteredLinks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'mostClicks':
            filteredLinks.sort((a, b) => b.clicks - a.clicks);
            break;
    }
    
    renderLinks(filteredLinks);
}

function viewStats(code) {
    window.location.href = `/stats.html?code=${encodeURIComponent(code)}`;
}

async function deleteLink(code) {
    if (!confirm(`Are you sure you want to delete the link "${code}"?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/links/${code}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete link');
        }

        alert('Link deleted successfully');
        loadLinks();

    } catch (error) {
        alert('Failed to delete link. Please try again.');
        console.error('Error deleting link:', error);
    }
}

function handleCopyLink() {
    const url = shortUrlLink.textContent;
    navigator.clipboard.writeText(url).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

function isValidCode(code) {
    return /^[A-Za-z0-9]{6,8}$/.test(code);
}

function formatDate(dateString) {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
