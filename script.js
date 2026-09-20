// ==========================================
// 🔒 全站密码门禁系统
// ==========================================
const SITE_PASSWORD = "3528"; // 👈 在这里修改成你想要的密码！

// 1. 首页密码验证逻辑
function checkSitePassword() {
    const input = document.getElementById('site-password-input');
    if (!input) return;
    
    if (input.value === SITE_PASSWORD) {
        // 密码正确，记录状态
        sessionStorage.setItem('site_authenticated', 'true');
        // 显示真正的内容
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        // 初始化首页（如果之前没渲染过）
        renderWorks(worksData);
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
}

// 2. 页面加载时自动检查是否已解锁（防止刷新页面后又要重新输入）
document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = sessionStorage.getItem('site_authenticated') === 'true';
    const lockScreen = document.getElementById('lock-screen');
    const mainContent = document.getElementById('main-content');
    
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
});
// ==========================================
// 作品数据库：以后加新文章，只需在下面添加数据
// ==========================================
const worksData = [
    {
        title: "命运的交错",
        link: "works/work1.html",
        cp: "A x B",
        type: "原著向",
        status: "已完结", // 标签
        date: "2026-09-19"
    },
    {
        title: "长夜将明",
        link: "works/work2.html",
        cp: "C x D",
        type: "AU设定",
        status: "连载中",
        date: "2026-09-15"
    }
];

// ==========================================
// 核心渲染与搜索逻辑（无需修改）
// ==========================================
const worksContainer = document.getElementById('works-list');
const searchInput = document.getElementById('search-input');
const filterTags = document.querySelectorAll('.filter-tag');

let currentFilter = '全部'; // 当前选中的合集分类

// 1. 渲染作品列表
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

// 2. 过滤与搜索逻辑
function filterAndSearch() {
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const filtered = worksData.filter(work => {
        // 匹配分类（标签）
        const matchFilter = currentFilter === '全部' || 
                            work.type === currentFilter || 
                            work.status === currentFilter ||
                            work.cp.includes(currentFilter);
        
        // 匹配搜索词（标题、CP、类型）
        const matchSearch = keyword === '' || 
                            work.title.toLowerCase().includes(keyword) ||
                            work.cp.toLowerCase().includes(keyword) ||
                            work.type.toLowerCase().includes(keyword);
                            
        return matchFilter && matchSearch;
    });

    renderWorks(filtered);
}

// 3. 绑定搜索框事件
if (searchInput) {
    searchInput.addEventListener('input', filterAndSearch);
}

// 4. 绑定分类标签点击事件
filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
        // 移除其他标签的 active 状态
        filterTags.forEach(t => t.classList.remove('active'));
        // 添加当前标签的 active 状态
        tag.classList.add('active');
        
        currentFilter = tag.dataset.filter;
        filterAndSearch();
    });
});

// 5. 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    renderWorks(worksData);
});
// 日夜模式切换
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    // 检查本地存储的偏好
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
    });
}
// 阅读进度条
window.onscroll = function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById("myBar");
    if (progressBar) {
        progressBar.style.width = scrolled + "%";
    }
};
// 打字机效果
const text = "欢迎来到我的同人作品集，愿故事在这里永不完结。";
let i = 0;
const speed = 80; // 打字速度，数字越小越快
const typewriterElement = document.getElementById("typewriter");

function typeWriter() {
    if (typewriterElement && i < text.length) {
        typewriterElement.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}
if (typewriterElement) {
    // 稍微延迟一点启动
    setTimeout(typeWriter, 500); 
}
function unlockArticle() {
    const correctPassword = "你的秘密密码"; // 在这里设置你的密码
    const inputPassword = document.getElementById('password-input').value;
    
    if (inputPassword === correctPassword) {
        document.getElementById('protected-content').style.display = 'block'; // 显示文章
        document.getElementById('lock-screen').style.display = 'none'; // 隐藏锁
        // 可选：记住密码，刷新页面后不用重新输入
        sessionStorage.setItem('unlocked_work1', 'true'); 
    } else {
        document.getElementById('error-msg').style.display = 'block';
    }
}

// 页面加载时检查是否已经解锁过（可选）
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('unlocked_work1') === 'true') {
        const protectedContent = document.getElementById('protected-content');
        const lockScreen = document.getElementById('lock-screen');
        if (protectedContent) protectedContent.style.display = 'block';
        if (lockScreen) lockScreen.style.display = 'none';
    }
});
// ==================== 字号调节功能 ====================
function changeFontSize(size) {
    const root = document.documentElement;
    
    // 1. 设置对应的字号大小
    if (size === 'small') {
        root.style.setProperty('--reading-font-size', '0.9em');
    } else if (size === 'medium') {
        root.style.setProperty('--reading-font-size', '1.05em');
    } else if (size === 'large') {
        root.style.setProperty('--reading-font-size', '1.2em');
    }
    
    // 2. 保存到浏览器，下次打开记住选择
    localStorage.setItem('reader-font-size', size);
    
    // 3. 更新按钮的高亮状态
    const buttons = document.querySelectorAll('.font-controls button');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + size).classList.add('active');
}

// 页面加载时，读取之前保存的字号偏好
document.addEventListener('DOMContentLoaded', () => {
    const savedSize = localStorage.getItem('reader-font-size');
    if (savedSize) {
        changeFontSize(savedSize);
    }
});
