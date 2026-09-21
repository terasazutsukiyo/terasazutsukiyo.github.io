// ==========================================
// 文章数据
// ==========================================
const postsData = [
    { 
        title: "命运的交错", 
        link: "works/work1.html", 
        category: "同人", 
        cp: "A x B", 
        type: "原著向", 
        status: "已完结", 
        date: "2026-09-19", 
        tags: ["同人"], 
        summary: "这是一篇基于原作的同人小说..." 
    }
];
let currentCategory = 'Blog';
const FANFIC_PASSWORD = "3528";

// ==========================================
// 渲染文章列表
// ==========================================
function renderWorks(data) {
    const container = document.getElementById('works-list');
    if (!container) return;
    
    if (data.length === 0) {
        container.innerHTML = '<li style="text-align:center; color:#8b8b8b; padding: 20px;">这个版块还没有文章哦~</li>';
        return;
    }
    container.innerHTML = data.map(post => `
        <li class="work-item">
            <a href="${post.link}" class="post-title">${post.title}</a>
            <div class="post-date">${post.date}</div>
            <p class="post-summary">${post.summary}</p>
            <div class="meta">
                ${post.tags ? post.tags.map(t => `<span class="badge">${t}</span>`).join('') : ''}
                ${post.cp ? `<span class="badge">${post.cp}</span>` : ''}
            </div>
        </li>
    `).join('');
}

// ==========================================
// 切换版块逻辑
// ==========================================
function switchCategory(category) {
    const searchAndFilter = document.getElementById('search-and-filter');
    const fanficLock = document.getElementById('fanfic-lock');
    const worksList = document.getElementById('works-list');
    
    // 更新导航高亮
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
            renderWorks(postsData.filter(p => p.category === '同人'));
        } else {
            searchAndFilter.style.display = 'none';
            worksList.style.display = 'none';
            fanficLock.style.display = 'block';
        }
    } else {
        searchAndFilter.style.display = 'block';
        fanficLock.style.display = 'none';
        worksList.style.display = 'block';
        renderWorks(postsData.filter(p => p.category === category));
    }
}

// ==========================================
// 密码验证
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

// ==========================================
// 页面加载初始化
// ==========================================
// ==========================================
// 🌙 黑夜模式切换
// ==========================================
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // 设置到 <html> 标签上，触发 CSS 变量切换
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('reader-theme', newTheme);
    
    // 更新按钮显示
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.textContent = newTheme === 'light' ? '🌙 暗色' : '☀️ 亮色';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    renderWorks(postsData.filter(p => p.category === 'Blog'));
});
// ==========================================
// 上下篇翻页功能
// ==========================================
function renderPagination() {
    const container = document.getElementById('pagination-container');
    if (!container) return; // 如果页面没有这个容器，直接跳过，防止报错

    // 1. 获取当前页面的路径 (兼容有无 .html 的情况)
    let currentPath = window.location.pathname;
    if (currentPath.endsWith('/')) currentPath += 'index.html';
    
    // 2. 找到当前文章的索引
    const currentIndex = postsData.findIndex(post => currentPath.includes(post.link.replace('../', '')));
    
    // 如果找不到这篇文章，或者数据里只有一篇文章，就不显示翻页
    if (currentIndex === -1 || postsData.length <= 1) {
        container.style.display = 'none';
        return;
    }

    // 3. 获取上一篇和下一篇（只匹配同一个版块）
    let prevPost = null;
    let nextPost = null;
    
    for (let i = currentIndex - 1; i >= 0; i--) {
        if (postsData[i].category === postsData[currentIndex].category) {
            prevPost = postsData[i];
            break;
        }
    }
    for (let i = currentIndex + 1; i < postsData.length; i++) {
        if (postsData[i].category === postsData[currentIndex].category) {
            nextPost = postsData[i];
            break;
        }
    }

    // 4. 生成 HTML
    let html = '';
    // 注意：文章页在 works 文件夹里，所以链接要加 ../ 回到上一级
    if (prevPost) {
        html += `<a href="../${prevPost.link}" class="page-link">← 上一篇：${prevPost.title}</a>`;
    } else {
        html += `<span class="page-link disabled">← 已经是第一篇了</span>`;
    }
    
    if (nextPost) {
        html += `<a href="../${nextPost.link}" class="page-link">下一篇：${nextPost.title} →</a>`;
    } else {
        html += `<span class="page-link disabled">已经是最后一篇了 →</span>`;
    }

    container.innerHTML = html;
}

// 页面加载时自动执行翻页渲染
document.addEventListener('DOMContentLoaded', () => {
    renderPagination();
});
// ==========================================
// 🔤 字号调节功能
// ==========================================
function toggleFontPanel() {
    const panel = document.getElementById('font-panel');
    if (!panel) return;
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

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

// ==========================================
// 🚀 全局初始化（自动注入悬浮工具栏）
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. 动态创建悬浮工具栏的 HTML 结构
    const toolHTML = `
        <div class="floating-font-tool">
            <button id="font-toggle-btn">A</button>
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
    document.body.insertAdjacentHTML('beforeend', toolHTML);

    // 2. 绑定悬浮按钮的点击展开/收起事件
    const toggleBtn = document.getElementById('font-toggle-btn');
    const panel = document.getElementById('font-panel');
    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
    }

    // 3. 恢复字号偏好
    const savedSize = localStorage.getItem('reader-font-size');
    if (savedSize) {
        changeFontSize(savedSize);
    }

    // 4. 恢复黑夜模式偏好（并从本地存储读取状态）
    const savedTheme = localStorage.getItem('reader-theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) themeBtn.textContent = '☀️ 亮色';
    }
});

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

// ==========================================
// 🌙 黑夜模式切换
// ==========================================
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('reader-theme', newTheme);
    
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.textContent = newTheme === 'light' ? '暗夜模式' : '亮色模式';
    }
}
