// ==========================================
// 📖 基础数据
// ==========================================
const postsData = [
    { title: "第一篇日志", link: "works/log1.html", category: "Blog", date: "2026-09-20", tags: ["日常"], summary: "今天搭建了博客，感觉非常有成就感..." },
    { title: "深夜的杂念", link: "works/essay1.html", category: "随笔", date: "2026-09-18", tags: ["思考"], summary: "晚上总是很容易产生一些奇怪的想法..." },
    { title: "命运的交错", link: "works/work1.html", category: "同人", series: "某原作", cp: "A x B", type: "原著向", status: "已完结", date: "2026-09-19", popularity: 100, tags: ["同人"], summary: "这是一篇基于原作的同人小说..." }
];

let currentCategory = 'Blog';
let currentSort = 'date_desc';
const FANFIC_PASSWORD = "fanfic2026"; // 👈 只有这里可以改成你的专属密码！

// ==========================================
// 🎨 渲染与排序
// ==========================================
function renderWorks(data) {
    const container = document.getElementById('works-list');
    if (!container) return;
    if (data.length === 0) {
        container.innerHTML = '<li style="text-align:center; color:#8b8b8b; padding: 20px; list-style:none;">这个版块还没有文章哦~</li>';
        return;
    }
    container.innerHTML = sortPosts(data).map(post => `
        <li class="work-item" style="margin-bottom: 15px; list-style: none;">
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

function sortPosts(posts) {
    return [...posts].sort((a, b) => {
        if (currentSort === 'date_desc') return new Date(b.date) - new Date(a.date);
        if (currentSort === 'date_asc') return new Date(a.date) - new Date(b.date);
        if (currentSort === 'popularity') return (b.popularity || 0) - (a.popularity || 0);
        return 0;
    });
}

function filterAndSearch() {
    const keyword = document.getElementById('search-input') ? document.getElementById('search-input').value.toLowerCase().trim() : '';
    const filtered = postsData.filter(post => {
        if (post.category !== currentCategory) return false;
        return keyword === '' || post.title.toLowerCase().includes(keyword) || (post.tags && post.tags.join('').toLowerCase().includes(keyword));
    });
    renderWorks(filtered);
}

// ==========================================
// 🔒 密码与版块切换
// ==========================================
function checkFanficPassword() {
    const input = document.getElementById('fanfic-password-input');
    if (input && input.value === FANFIC_PASSWORD) {
        sessionStorage.setItem('fanfic_authenticated', 'true');
        switchCategory('同人');
    } else {
        const err = document.getElementById('fanfic-error-msg');
        if (err) err.style.display = 'block';
    }
}

function switchCategory(category) {
    const searchAndFilter = document.getElementById('search-and-filter');
    const fanficLock = document.getElementById('fanfic-lock');
    const worksList = document.getElementById('works-list');
    
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[onclick*="${category}"]`);
    if (navItem) navItem.classList.add('active');
    currentCategory = category;

    if (category === '同人') {
        const isAuth = sessionStorage.getItem('fanfic_authenticated') === 'true';
        if (isAuth) {
            searchAndFilter.style.display = 'block';
            fanficLock.style.display = 'none';
            worksList.style.display = 'block';
            filterAndSearch();
        } else {
            searchAndFilter.style.display = 'none';
            worksList.style.display = 'none';
            fanficLock.style.display = 'block';
        }
    } else {
        searchAndFilter.style.display = 'block';
        fanficLock.style.display = 'none';
        worksList.style.display = 'block';
        filterAndSearch();
    }
}

// ==========================================
// 🔤 字号与夜间模式
// ==========================================
function toggleFontPanel() {
    const panel = document.getElementById('font-panel');
    if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function changeFontSize(size) {
    const content = document.querySelector('.story-content');
    if (!content) return;
    if (size === 'small') content.style.fontSize = '0.9em';
    else if (size === 'medium') content.style.fontSize = '1.05em';
    else if (size === 'large') content.style.fontSize = '1.25em';
    localStorage.setItem('reader-font-size', size);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('reader-theme', newTheme);
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) themeBtn.textContent = newTheme === 'light' ? '🌙 暗色' : '☀️ 亮色';
}

// ==========================================
// 🚀 页面加载初始化
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 自动注入悬浮工具栏
    const toolbarHTML = `
        <div class="floating-font-tool">
            <button id="font-toggle-btn" onclick="toggleFontPanel()">A</button>
            <div id="font-panel" class="font-panel" style="display: none;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">
                    <span>字号：</span>
                    <button onclick="changeFontSize('small')" id="btn-small">小</button>
                    <button onclick="changeFontSize('medium')" id="btn-medium" class="active">中</button>
                    <button onclick="changeFontSize('large')" id="btn-large">大</button>
                </div>
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span>主题：</span>
                    <button onclick="toggleTheme()" id="theme-btn">🌙 暗色</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', toolbarHTML);

    // 恢复用户偏好
    const savedSize = localStorage.getItem('reader-font-size');
    if (savedSize) changeFontSize(savedSize);
    const savedTheme = localStorage.getItem('reader-theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) themeBtn.textContent = '☀️ 亮色';
    }

    // 首次渲染首页
    renderWorks(postsData.filter(p => p.category === 'Blog'));
});
