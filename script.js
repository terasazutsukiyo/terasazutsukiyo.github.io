// ==========================================
// 📖 文章数据
// ==========================================
const postsData = [
    { title: "第一篇日志", link: "works/log1.html", category: "Blog", date: "2026-09-20", tags: ["日常"], summary: "今天搭建了博客，感觉非常有成就感..." },
    { title: "深夜的杂念", link: "works/essay1.html", category: "随笔", date: "2026-09-18", tags: ["思考"], summary: "晚上总是很容易产生一些奇怪的想法..." },
    { title: "命运的交错", link: "works/work1.html", category: "同人", cp: "A x B", type: "原著向", status: "已完结", date: "2026-09-19", tags: ["同人"], summary: "这是一篇基于原作的同人小说..." }
];

let currentCategory = 'Blog';
const FANFIC_PASSWORD = "3528";

// ==========================================
// 🎨 渲染文章列表
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
// 🔄 切换版块逻辑
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
// 🔒 同人密码验证
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
// 🚀 页面加载初始化
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderWorks(postsData.filter(p => p.category === 'Blog'));
});
