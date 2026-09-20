// ==========================================
const FANFIC_PASSWORD = "3528";          // 同人密码

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
    // Blog
    { title: "20260920", link: "works/log1.html", category: "Blog", date: "2026-09-20", tags: ["网站"], summary: "搭建了博客框架" },
    // 随笔
    { title: "测试用", link: "works/essay1.html", category: "随笔", date: "2026-09-18", tags: ["测试"], summary: "此篇用来测试网站" },
    // 同人
    { title: "命运的交错", link: "works/work1.html", category: "同人", cp: "A x B", type: "原著向", status: "已完结", date: "2026-09-19", tags: ["同人", "A x B"], summary: "这是一篇基于原作的同人小说..." }
];

let currentCategory = 'Blog'; // 默认显示Blog
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
    const pages = document.getElementById('book-pages');
    if (!pages) return;

    // 1. 如果点击的是当前版块，直接返回
    if (currentCategory === category) return; 

    // 2. 触发翻书动画（页面卷起）
    pages.classList.add('flipping');

    // 3. 等待动画执行到一半（300ms）时，偷偷把内容换掉
    setTimeout(() => {
        currentCategory = category;
        
        // 更新导航栏高亮
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const navItem = document.querySelector(`.nav-item[onclick*="${category}"]`);
        if (navItem) navItem.classList.add('active');

        const searchAndFilter = document.getElementById('search-and-filter');
        const fanficLock = document.getElementById('fanfic-lock');
        const worksList = document.getElementById('works-list');

        // 根据分类调整显示状态
        if (category === '同人') {
            const isFanficAuth = sessionStorage.getItem('fanfic_authenticated') === 'true';
            if (isFanficAuth) {
                fanficLock.style.display = 'none';
                searchAndFilter.style.display = 'block'; 
                worksList.style.display = 'block';
                filterAndSearch();
            } else {
                searchAndFilter.style.display = 'none';
                worksList.style.display = 'none';
                fanficLock.style.display = 'block';
            }
        } else {
            fanficLock.style.display = 'none';
            searchAndFilter.style.display = 'block';
            worksList.style.display = 'block';
            filterAndSearch();
        }

        // 4. 内容换好之后，让页面“翻回来”（平铺）
        setTimeout(() => {
            pages.classList.remove('flipping');
        }, 50);

    }, 300); // 300ms 对应 CSS 动画的一半时间
}
    
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
