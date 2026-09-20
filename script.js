// ==========================================
// 🔒 全站密码门禁系统
// ==========================================
const SITE_PASSWORD = "改成你想要的神秘暗号"; // 👈 这里改全站密码！
const FANFIC_PASSWORD = "fanfic2026";          // 👈 这里改同人专属密码！

function checkSitePassword() {
    const input = document.getElementById('site-password-input');
    if (!input) return;
    if (input.value === SITE_PASSWORD) {
        sessionStorage.setItem('site_authenticated', 'true');
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        initHome();
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
}

// ==========================================
// 📖 博客文章数据（按分类存放）
// ==========================================
const postsData = [
    // 日志
    { title: "第一篇日志", link: "works/log1.html", category: "日志", date: "2026-09-20", tags: ["日常"], summary: "今天搭建了博客，感觉非常有成就感..." },
    // 随笔
    { title: "深夜的杂念", link: "works/essay1.html", category: "随笔", date: "2026-09-18", tags: ["思考"], summary: "晚上总是很容易产生一些奇怪的想法..." },
    // 同人
    { title: "命运的交错", link: "works/work1.html", category: "同人", cp: "A x B", type: "原著向", status: "已完结", date: "2026-09-19", tags: ["同人", "A x B"], summary: "这是一篇基于原作的同人小说..." }
];

let currentCategory = '日志'; // 默认显示日志
const worksContainer = document.getElementById('works-list');
const searchInput = document.getElementById('search-input');
let currentFilter = '全部';

// ==========================================
// 📝 渲染文章列表
// ==========================================
function renderWorks(data) {
    if (!worksContainer) return;
    if (data.length === 0) {
        worksContainer.innerHTML = '<li style="text-align:center; color:#8b8b8b; padding: 20px;">这个版块还没有文章哦~</li>';
        return;
    }
    worksContainer.innerHTML = data.map(post => `
        <li class="work-item">
            <a href="${post.link}" class="post-title">${post.title}</a>
            <div class="post-date">${post.date}</div>
            <p class="post-summary">${post.summary}</p>
            <div class="meta">
                ${post.tags ? post.tags.map(t => `<span class="badge">${t}</span>`).join('') : ''}
                ${post.cp ? `<span class="badge">${post.cp}</span>` : ''}
                ${post.status ? `<span class="badge status-${post.status === '已完结' ? 'done' : 'ongoing'}">${post.status}</span>` : ''}
            </div>
        </li>
    `).join('');
}

// ==========================================
// 🔍 搜索与过滤
// ==========================================
function filterAndSearch() {
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filtered = postsData.filter(post => {
        // 1. 先过滤版块
        if (post.category !== currentCategory) return false;
        // 2. 再过滤搜索词
        const matchSearch = keyword === '' || 
                            post.title.toLowerCase().includes(keyword) || 
                            (post.tags && post.tags.join('').toLowerCase().includes(keyword)) ||
                            (post.cp && post.cp.toLowerCase().includes(keyword));
        return matchSearch;
    });
    renderWorks(filtered);
}

if (searchInput) {
    searchInput.addEventListener('input', filterAndSearch);
}

// ==========================================
// 📂 博客版块切换逻辑
// ==========================================
function switchCategory(category) {
    currentCategory = category;
    
    // 更新导航栏高亮
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const activeNav = document.querySelector(`.nav-item[onclick*="${category}"]`);
    if (activeNav) activeNav.classList.add('active');

    const searchAndFilter = document.getElementById('search-and-filter');
    const fanficLock = document.getElementById('fanfic-lock');
    const worksList = document.getElementById('works-list');

    if (category === '同人') {
        // 检查是否已经通过同人密码验证
        const isFanficAuth = sessionStorage.getItem('fanfic_authenticated') === 'true';
        if (isFanficAuth) {
            if (fanficLock) fanficLock.style.display = 'none';
            if (searchAndFilter) searchAndFilter.style.display = 'block';
            if (worksList) worksList.style.display = 'block';
            filterAndSearch();
        } else {
            // 没解锁，显示密码锁
            if (searchAndFilter) searchAndFilter.style.display = 'none';
            if (worksList) worksList.style.display = 'none';
            if (fanficLock) fanficLock.style.display = 'block';
        }
    } else {
        // 日志和随笔直接显示
        if (fanficLock) fanficLock.style.display = 'none';
        if (searchAndFilter) searchAndFilter.style.display = 'block';
        if (worksList) worksList.style.display = 'block';
        filterAndSearch();
    }
}

// 验证同人密码
function checkFanficPassword() {
    const input = document.getElementById('fanfic-password-input');
    if (!input) return;
    if (input.value === FANFIC_PASSWORD) {
        sessionStorage.setItem('fanfic_authenticated', 'true');
        switchCategory('同人'); // 刷新同人版块
    } else {
        const err = document.getElementById('fanfic-error-msg');
        if (err) err.style.display = 'block';
    }
}

// ==========================================
// 🔤 字号调节功能
// ==========================================
function changeFontSize(size) {
    const content = document.querySelector('.story-content');
    if (!content) return;

    if (size === 'small') content.style.fontSize = '0.9em';
    else if (size === 'medium') content.style.fontSize = '1.05em';
    else if (size === 'large') content.style.fontSize = '1.25em';

    localStorage.setItem('reader-font-size', size);
    document.querySelectorAll('.font-panel button').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.getElementById('btn-' + size);
    if (targetBtn) targetBtn.classList.add('active');
}

function toggleFontPanel() {
    const panel = document.getElementById('font-panel');
    if (!panel) return;
    panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
}

// ==========================================
// 🚀 页面初始化
// ==========================================
function initHome() {
    // 恢复字号偏好
    const savedSize = localStorage.getItem('reader-font-size');
    if (savedSize) changeFontSize(savedSize);
    
    // 渲染默认版块（日志）
    switchCategory('日志');
}

document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = sessionStorage.getItem('site_authenticated') === 'true';
    const lockScreen = document.getElementById('lock-screen');
    const mainContent = document.getElementById('main-content');
    
    if (lockScreen && mainContent) {
        if (isAuthenticated) {
            lockScreen.style.display = 'none';
            mainContent.style.display = 'block';
            initHome();
        } else {
            lockScreen.style.display = 'block';
            mainContent.style.display = 'none';
        }
    }
});
