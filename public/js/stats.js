const API_BASE = window.location.origin;

const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const statsSection = document.getElementById('statsSection');
const statCode = document.getElementById('statCode');
const statClicks = document.getElementById('statClicks');
const statTargetUrl = document.getElementById('statTargetUrl');
const statTargetUrlLink = document.getElementById('statTargetUrlLink');
const statShortUrl = document.getElementById('statShortUrl');
const statCreated = document.getElementById('statCreated');
const statLastClicked = document.getElementById('statLastClicked');
const copyBtn = document.getElementById('copyBtn');
const deleteBtn = document.getElementById('deleteBtn');

let currentCode = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    currentCode = urlParams.get('code');

    if (!currentCode) {
        showError();
        return;
    }

    loadStats();
    setupEventListeners();
});

function setupEventListeners() {
    copyBtn.addEventListener('click', handleCopyLink);
    deleteBtn.addEventListener('click', handleDeleteLink);
}

async function loadStats() {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    statsSection.classList.add('hidden');

    try {
        const response = await fetch(`${API_BASE}/api/links/${currentCode}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch link stats');
        }

        const link = await response.json();
        displayStats(link);

    } catch (error) {
        showError();
        console.error('Error loading stats:', error);
    }
}

function displayStats(link) {
    loadingState.classList.add('hidden');
    statsSection.classList.remove('hidden');

    const shortUrl = `${API_BASE}/${link.code}`;

    statCode.textContent = link.code;
    statClicks.textContent = link.clicks;
    statTargetUrl.textContent = link.targetUrl;
    statTargetUrlLink.href = link.targetUrl;
    statShortUrl.href = shortUrl;
    statShortUrl.textContent = shortUrl;
    statCreated.textContent = formatDate(link.createdAt);
    statLastClicked.textContent = formatDate(link.lastClickedAt);
}

function showError() {
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
}

function handleCopyLink() {
    const url = statShortUrl.textContent;
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

async function handleDeleteLink() {
    if (!confirm(`Are you sure you want to delete the link "${currentCode}"?`)) {
        return;
    }

    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Deleting...';

    try {
        const response = await fetch(`${API_BASE}/api/links/${currentCode}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete link');
        }

        alert('Link deleted successfully');
        window.location.href = '/';

    } catch (error) {
        alert('Failed to delete link. Please try again.');
        console.error('Error deleting link:', error);
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Delete Link';
    }
}

function formatDate(dateString) {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
