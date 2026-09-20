// ==========================================
// 🔒 全站密码系统
// ==========================================
const SITE_PASSWORD = "3528"; // 在此修改密码

function checkSitePassword() {
    const input = document.getElementById('site-password-input');
    if (!input) return;
    if (input.value === SITE_PASSWORD) {
        sessionStorage.setItem('site_authenticated', 'true');
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        renderWorks(worksData);
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
}

// ==========================================
// 📖 作品数据与渲染逻辑
// ==========================================
const worksData = [
    { title: "命运的交错", link: "works/work1.html", cp: "A x B", type: "原著向", status: "已完结", date: "2026-09-19" },
    { title: "长夜将明", link: "works/work2.html", cp: "C x D", type: "AU设定", status: "连载中", date: "2026-09-15" }
];

const worksContainer = document.getElementById('works-list');
const searchInput = document.getElementById('search-input');
const filterTags = document.querySelectorAll('.filter-tag');
let currentFilter = '全部';

function renderWorks(data) {
    if (!worksContainer) return;
    if (data.length === 0) {
        worksContainer.innerHTML = '<li style="text-align:center; color:#8b8b8b; padding: 20px;">没有找到匹配的作品</li>';
        return;
    }
    worksContainer.innerHTML = data.map(work => `
        <li class="work-item">
            <a href="${work.link}">${work.title}</a>
            <div class="meta">
                <span class="badge">${work.cp}</span>
                <span class="badge">${work.type}</span>
                <span class="badge status-${work.status === '已完结' ? 'done' : 'ongoing'}">${work.status}</span>
                <span style="margin-left: auto; color: #b0a8a0;">更新：${work.date}</span>
            </div>
        </li>
    `).join('');
}

function filterAndSearch() {
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filtered = worksData.filter(work => {
        const matchFilter = currentFilter === '全部' || work.type === currentFilter || work.status === currentFilter || work.cp.includes(currentFilter);
        const matchSearch = keyword === '' || work.title.toLowerCase().includes(keyword) || work.cp.toLowerCase().includes(keyword) || work.type.toLowerCase().includes(keyword);
        return matchFilter && matchSearch;
    });
    renderWorks(filtered);
}

if (searchInput) searchInput.addEventListener('input', filterAndSearch);
filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        currentFilter = tag.dataset.filter;
        filterAndSearch();
    });
});

// ==========================================
// 🔤 字号调节功能
// ==========================================
// ==========================================
// 🔤 字号调节功能（只改变正文大小）
// ==========================================
function changeFontSize(size) {
    const content = document.querySelector('.story-content');
    if (!content) return;

    // 把大号从 1.25em 调整到 1.15em，中号也稍微调整
    if (size === 'small') content.style.fontSize = '0.95em';
    else if (size === 'medium') content.style.fontSize = '1.05em';
    else if (size === 'large') content.style.fontSize = '1.15em'; // 从 1.25 降下来，会更柔和

    localStorage.setItem('reader-font-size', size);
    
    document.querySelectorAll('.font-panel button').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.getElementById('btn-' + size);
    if (targetBtn) targetBtn.classList.add('active');
}

// ==========================================
// 🚀 页面加载初始化
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = sessionStorage.getItem('site_authenticated') === 'true';
    const lockScreen = document.getElementById('lock-screen');
    const mainContent = document.getElementById('main-content');
    
    // 首页密码门逻辑
    if (lockScreen && mainContent) {
        if (isAuthenticated) {
            lockScreen.style.display = 'none';
            mainContent.style.display = 'block';
            renderWorks(worksData);
        } else {
            lockScreen.style.display = 'block';
            mainContent.style.display = 'none';
        }
    }

    // 恢复字号偏好
    const savedSize = localStorage.getItem('reader-font-size');
    if (savedSize) {
        changeFontSize(savedSize);
    }
});
// 切换悬浮字体面板的显示/隐藏
function toggleFontPanel() {
    function toggleFontPanel() {
    const panel = document.getElementById('font-panel');
    if (!panel) return; // ✅ 新增：如果找不到面板，直接返回，不报错
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}
    const panel = document.getElementById('font-panel');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}
// ==========================================
// 💬 Giscus 评论系统
// ==========================================
function initGiscus() {
    const container = document.getElementById('giscus-container');
    if (!container) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', '你的用户名/blog-comments');
    script.setAttribute('data-repo-id', 'R_kgDOxxxxxx');        // 👈 替换为你的 repo-id
    script.setAttribute('data-category', '评论');
    script.setAttribute('data-category-id', 'DIC_kwDOxxxxxx');  // 👈 替换为你的 category-id
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '1');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'noborder_light');
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;

    container.appendChild(script);
}

// 页面加载时自动初始化
document.addEventListener('DOMContentLoaded', () => {
    initGiscus();
});
