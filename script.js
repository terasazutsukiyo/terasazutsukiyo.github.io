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
