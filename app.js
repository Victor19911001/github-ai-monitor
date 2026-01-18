// ============================
// GitHub AI Trends - Enhanced Frontend
// ============================

// 静态部署：从本地 data.json 加载数据
const DATA_URL = './data.json';

// DOM Elements
const newHotCards = document.getElementById('newHotCards');
const trendingCards = document.getElementById('trendingCards');
const lastUpdateEl = document.getElementById('lastUpdate');
const refreshBtn = document.getElementById('refreshBtn');
const totalReposEl = document.getElementById('totalRepos');
const totalStarsEl = document.getElementById('totalStars');
const todayGrowthEl = document.getElementById('todayGrowth');

// Modal Elements
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalTitle = document.getElementById('modalTitle');
const modalRank = document.getElementById('modalRank');
const modalStars = document.getElementById('modalStars');
const modalGrowth = document.getElementById('modalGrowth');
const modalWhatIs = document.getElementById('modalWhatIs');
const modalProblem = document.getElementById('modalProblem');
const modalUseCase = document.getElementById('modalUseCase');
const modalQuickStart = document.getElementById('modalQuickStart');
const modalGithubLink = document.getElementById('modalGithubLink');

// All repos for modal reference
let allRepos = [];

// SVG Icons
const ICONS = {
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    growth: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>`
};

// AI/Tool Category Keywords for smart summaries
const CATEGORY_KEYWORDS = {
    agent: ['agent', 'cowork', 'copilot', 'assistant', 'autopilot'],
    llm: ['llm', 'gpt', 'claude', 'gemini', 'language model', 'transformer', 'chat'],
    coding: ['code', 'coding', 'developer', 'programming', 'ide', 'editor', 'cli'],
    automation: ['automat', 'workflow', 'pipeline', 'task', 'schedule'],
    data: ['data', 'extract', 'parse', 'scrape', 'structured'],
    ui: ['ui', 'interface', 'visual', 'editor', 'design', 'component'],
    skill: ['skill', 'template', 'boilerplate', 'starter', 'framework']
};

// Generate smart Chinese summary based on description
function generateSmartSummary(name, description) {
    const text = (name + ' ' + description).toLowerCase();
    let category = 'tool';

    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(k => text.includes(k))) {
            category = cat;
            break;
        }
    }

    const summaries = {
        agent: '🤖 这是一个 AI 智能助手/Agent 工具，可以自动执行复杂任务，提升工作效率。',
        llm: '🧠 这是一个大语言模型（LLM）相关工具，用于文本生成、对话或内容处理。',
        coding: '💻 这是一个辅助编程的开发者工具，帮助你更快地写出更好的代码。',
        automation: '⚡ 这是一个自动化工具，可以帮你自动完成重复性工作流程。',
        data: '📊 这是一个数据处理工具，用于从非结构化内容中提取结构化信息。',
        ui: '🎨 这是一个界面/可视化工具，让设计和开发更加直观高效。',
        skill: '📚 这是一个技能模板或框架，提供开箱即用的最佳实践。',
        tool: '🔧 这是一个实用的 AI 工具，可以帮助提升日常工作效率。'
    };

    return summaries[category];
}

// Generate problem description - GitHubDaily style pain-point hook
function generateProblemSolving(name, description) {
    const text = (name + ' ' + description).toLowerCase();

    if (text.includes('sync') || text.includes('share')) {
        return '用 Claude 配置了半天的技能，换到 Cursor 又要重来一遍？这个工具让你一键同步到所有 AI 助手。';
    }
    if (text.includes('extract') || text.includes('structured')) {
        return '从一堆文档里手动找数据？太累了。这个库让 LLM 帮你自动抽取结构化信息，还能标注来源。';
    }
    if (text.includes('cowork') || text.includes('desktop') || text.includes('productivity')) {
        return '每天在 ChatGPT 和本地工作之间来回切换？这个桌面应用让 AI 直接融入你的工作流。';
    }
    if (text.includes('agent') || text.includes('agentic')) {
        return '想让 AI 自动完成复杂任务，但不知道怎么写 Agent？这个框架帮你搞定。';
    }
    if (text.includes('visual') || text.includes('editor')) {
        return '写代码太抽象，想要可视化编辑？这个工具让你像搭积木一样构建界面。';
    }
    if (text.includes('template') || text.includes('starter') || text.includes('skill')) {
        return '从零开始搭项目太慢？这套模板/技能库帮你跳过重复劳动，直接起飞。';
    }
    if (text.includes('llm') || text.includes('gpt') || text.includes('language')) {
        return '想用大模型但不知道怎么接入？这个工具帮你降低门槛，几行代码搞定。';
    }

    return '日常工作中有个痛点一直没好的解决方案？这个项目可能就是你要找的那个。';
}

// Generate use case description - GitHubDaily style
function generateUseCase(name, description) {
    const text = (name + ' ' + description).toLowerCase();

    if (text.includes('cli') || text.includes('terminal') || text.includes('code')) {
        return '👨‍💻 开发者 / 每天用命令行的技术人。如果你同时用多个 AI 编程助手，这个工具能帮你省不少时间。';
    }
    if (text.includes('enterprise') || text.includes('production') || text.includes('fullstack')) {
        return '🏢 企业开发者 / 负责 AI 项目落地的人。生产级方案，可以直接参考架构。';
    }
    if (text.includes('daily') || text.includes('news') || text.includes('资讯')) {
        return '📰 AI 爱好者 / 想追踪前沿动态但没时间刷推的人。自动帮你整理每日精华。';
    }
    if (text.includes('free') || text.includes('open source') || text.includes('local')) {
        return '🔒 注重隐私或预算有限的人。本地运行 + 开源免费，数据不出门。';
    }
    if (text.includes('visual') || text.includes('design') || text.includes('ui')) {
        return '🎨 设计师 / 前端开发者。低代码搭界面，不用写太多样式代码。';
    }

    return '🌟 对 AI 工具感兴趣的任何人。无论是学习新技术还是寻找效率工具，都值得一看。';
}

// Generate core highlights - GitHubDaily style bullet points
function generateHighlights(name, description, stars) {
    const text = (name + ' ' + description).toLowerCase();
    const highlights = [];

    // Star-based highlight
    if (stars >= 10000) {
        highlights.push(`🔥 ${formatNumber(stars)}+ Stars，社区验证的热门项目`);
    } else if (stars >= 1000) {
        highlights.push(`⭐ ${formatNumber(stars)} Stars，快速增长中的潜力项目`);
    } else {
        highlights.push(`🌱 新项目但势头很猛，值得早期关注`);
    }

    // Feature-based highlights
    if (text.includes('open source') || text.includes('free') || text.includes('开源')) {
        highlights.push('✅ 完全开源免费，无隐藏费用');
    }
    if (text.includes('local') || text.includes('本地') || text.includes('privacy')) {
        highlights.push('🔒 支持本地运行，数据隐私有保障');
    }
    if (text.includes('production') || text.includes('enterprise')) {
        highlights.push('🏭 生产级方案，企业可直接采用');
    }
    if (text.includes('visual') || text.includes('ui') || text.includes('editor')) {
        highlights.push('🎨 可视化操作，上手门槛极低');
    }
    if (text.includes('cli') || text.includes('terminal')) {
        highlights.push('⌨️ 命令行工具，开发者友好');
    }
    if (text.includes('llm') || text.includes('gpt') || text.includes('claude')) {
        highlights.push('🤖 无缝对接主流大模型');
    }
    if (text.includes('sync') || text.includes('多平台')) {
        highlights.push('🔄 多工具/多平台同步，一劳永逸');
    }
    if (text.includes('python')) {
        highlights.push('🐍 Python 实现，易于二次开发');
    }
    if (text.includes('typescript') || text.includes('react') || text.includes('vue')) {
        highlights.push('⚛️ 现代前端技术栈，代码质量有保证');
    }

    // Ensure at least 3 highlights
    const fallbackHighlights = [
        '📚 文档完善，上手无压力',
        '🚀 持续维护更新中',
        '💡 社区活跃，问题有人答'
    ];
    while (highlights.length < 3) {
        highlights.push(fallbackHighlights[highlights.length]);
    }

    return highlights.slice(0, 3);
}

// Translate English description to elegant Chinese
function translateDescription(desc) {
    const translations = {
        'Eigent: The Open Source Cowork Desktop to Unlock Your Exceptional Productivity': 'Eigent：开源 AI 协作桌面，释放你的卓越生产力',
        'The Open Source Cowork Desktop to Unlock Your Exceptional Productivity': '开源 AI 协作桌面，释放你的卓越生产力',
        'An agentic skills framework & software development methodology that works': '一套真正有效的 AI Agent 技能框架与软件开发方法论',
        'A Python library for extracting structured information from unstructured text using LLMs with precise source grounding': '基于 LLM 从非结构化文本中精准提取结构化信息的 Python 库',
        'Sync skills to all your AI CLI tools with one command for Claude, Codex, Cursor, Antigravity & more': '一条命令同步技能到所有 AI CLI 工具（支持 Claude、Codex、Cursor、Antigravity 等）',
        'AI 资讯日报 Claude Code Skill - 每天自动获取、分析、归类 AI 前沿资讯': 'AI 资讯日报：每天自动获取、分析、归类 AI 前沿资讯',
        'Flexible Fullstack solution template for production-ready deployments on Amazon Bedrock AgentCore': '灵活的全栈解决方案模板，用于在 Amazon Bedrock AgentCore 上进行生产级部署',
        'Free, local, open-source Cowork for Gemini CLI, Claude Code, Codex, Opencode, Qwen Code, Goose Cli, Auggie, and more': '免费、本地化、开源的 AI 协作工具，支持 Gemini CLI、Claude Code 等多种 AI 助手',
        'The visual editor for React with AI superpowers': '具有 AI 超能力的 React 可视化编辑器'
    };

    // Check exact match first
    if (translations[desc]) return translations[desc];

    // Check partial match
    for (const [eng, chn] of Object.entries(translations)) {
        if (desc.includes(eng)) return chn;
    }

    // Return original if no translation found
    return desc;
}

// Format numbers (e.g., 1200 -> 1.2k)
function formatNumber(num) {
    if (typeof num === 'string') {
        num = parseInt(num.replace(/,/g, '')) || 0;
    }
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

// Open modal with project details
function openModal(repoId) {
    // Ensure repoId is compared correctly (String vs Number)
    const repo = allRepos.find(r => String(r.id) === String(repoId));
    if (!repo) {
        console.error('Repo not found:', repoId, 'Available IDs:', allRepos.map(r => r.id));
        return;
    }

    const name = repo.full_name || repo.name || 'Unknown';
    const desc = repo.description || '暂无描述';
    const stars = typeof repo.stargazers_count === 'string'
        ? parseInt(repo.stargazers_count.replace(/,/g, ''))
        : (repo.stargazers_count || 0);
    const growth = repo.growth || '';
    const url = repo.html_url || `https://github.com/${name}`;
    const rank = repo._rank || 1;

    // Populate modal content
    modalRank.textContent = `#${rank}`;
    modalTitle.textContent = name;
    modalStars.textContent = `⭐ ${formatNumber(stars)} Stars`;
    modalGrowth.textContent = growth ? `📈 ${growth}` : '';
    modalWhatIs.textContent = translateDescription(desc);
    modalProblem.textContent = generateProblemSolving(name, desc);
    modalUseCase.textContent = generateUseCase(name, desc);
    modalGithubLink.href = url;

    // Populate highlights list
    const modalHighlights = document.getElementById('modalHighlights');
    if (modalHighlights) {
        const highlights = generateHighlights(name, desc, stars);
        modalHighlights.innerHTML = highlights.map(h => `<li>${h}</li>`).join('');
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Create repo card HTML
function createRepoCard(repo, index, type = 'fire') {
    const stars = repo.stargazers_count || repo.stars || 0;
    const growth = repo.growth || '';
    const name = repo.full_name || repo.name || 'Unknown';
    const desc = repo.description || '暂无描述';
    const summary = generateSmartSummary(name, desc);

    // Store repo with rank for modal
    repo._rank = index + 1;
    repo.id = repo.id || `${name}-${index}`;

    return `
        <div class="repo-card ${type} fade-in stagger-${index + 1}" data-id="${repo.id}">
            <div class="card-header">
                <span class="repo-name">${name}</span>
                <div class="rank-badge">#${index + 1}</div>
            </div>
            <p class="repo-summary">${summary}</p>
            <p class="repo-description">${desc}</p>
            <div class="card-footer">
                <div class="card-stats">
                    <span class="stat stars">
                        ${ICONS.star}
                        ${formatNumber(stars)}
                    </span>
                    ${growth ? `<span class="stat growth">${ICONS.growth} ${growth}</span>` : ''}
                </div>
                <button class="view-detail-btn" data-id="${repo.id}">查看详情</button>
            </div>
        </div>
    `;
}

// Render cards
function renderCards(container, repos, type) {
    if (!repos || repos.length === 0) {
        container.innerHTML = `
            <div class="repo-card" style="text-align: center; color: var(--text-muted);">
                暂无数据，请稍后刷新
            </div>
        `;
        return;
    }
    // Store for modal reference
    allRepos = [...allRepos, ...repos];
    container.innerHTML = repos.slice(0, 5).map((repo, i) => createRepoCard(repo, i, type)).join('');
}

// Update stats
function updateStats(newHot, trending) {
    const repos = [...(newHot || []), ...(trending || [])];
    const totalRepos = repos.length;

    let totalStars = 0;
    let todayGrowth = 0;

    repos.forEach(repo => {
        const stars = typeof repo.stargazers_count === 'string'
            ? parseInt(repo.stargazers_count.replace(/,/g, '')) || 0
            : repo.stargazers_count || 0;
        totalStars += stars;

        if (repo.growth) {
            const match = repo.growth.match(/(\d+(?:,\d+)?)/);
            if (match) {
                todayGrowth += parseInt(match[1].replace(/,/g, '')) || 0;
            }
        }
    });

    totalReposEl.textContent = totalRepos;
    totalStarsEl.textContent = formatNumber(totalStars);
    todayGrowthEl.textContent = '+' + formatNumber(todayGrowth);
}

// Fetch data from static JSON file
async function fetchData() {
    allRepos = []; // Reset
    try {
        const response = await fetch(DATA_URL + '?t=' + Date.now());
        if (!response.ok) throw new Error('数据文件未找到');
        const data = await response.json();

        renderCards(newHotCards, data.new_hot, 'fire');
        renderCards(trendingCards, data.trending, 'trend');
        updateStats(data.new_hot, data.trending);

        const updateTime = data.update_time || new Date().toLocaleTimeString('zh-CN');
        lastUpdateEl.innerHTML = `<span class="pulse"></span> ${updateTime} 更新`;

    } catch (error) {
        console.error('Fetch error:', error);
        loadDemoData();
    }
}

// Demo data for when API is not available
function loadDemoData() {
    const demoNewHot = [
        { id: 'demo1', full_name: 'runkids/skillshare', description: '📚 Sync skills to all your AI CLI tools with one command for Claude, Codex, Cursor, Antigravity & more', stargazers_count: 122, html_url: 'https://github.com/runkids/skillshare' },
        { id: 'demo2', full_name: 'geekjourneyx/ai-daily-skill', description: 'AI 资讯日报 Claude Code Skill - 每天自动获取、分析、归类 AI 前沿资讯', stargazers_count: 115, html_url: 'https://github.com/geekjourneyx/ai-daily-skill' },
        { id: 'demo3', full_name: 'awslabs/fullstack-agentcore', description: 'Flexible Fullstack solution template for production-ready deployments on Amazon Bedrock AgentCore', stargazers_count: 113, html_url: 'https://github.com/awslabs/fullstack-solution-template-for-agentcore' },
    ];

    const demoTrending = [
        { id: 'demo4', full_name: 'eigent-ai/eigent', description: 'Eigent: The Open Source Cowork Desktop to Unlock Your Exceptional Productivity', stargazers_count: '8,892', growth: '760 stars today', html_url: 'https://github.com/eigent-ai/eigent' },
        { id: 'demo5', full_name: 'obra/superpowers', description: 'An agentic skills framework & software development methodology that works', stargazers_count: '27,680', growth: '1,422 stars today', html_url: 'https://github.com/obra/superpowers' },
        { id: 'demo6', full_name: 'google/langextract', description: 'A Python library for extracting structured information from unstructured text using LLMs with precise source grounding', stargazers_count: '21,685', growth: '425 stars today', html_url: 'https://github.com/google/langextract' },
    ];

    renderCards(newHotCards, demoNewHot, 'fire');
    renderCards(trendingCards, demoTrending, 'trend');
    updateStats(demoNewHot, demoTrending);

    lastUpdateEl.innerHTML = `<span class="pulse"></span> 演示数据`;
}

// Event Listeners
modalClose.addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Event delegation for card clicks
document.addEventListener('click', (e) => {
    // Handle "View Details" button click
    const btn = e.target.closest('.view-detail-btn');
    if (btn) {
        e.stopPropagation(); // Stop bubbling to card
        const id = btn.dataset.id;
        if (id) openModal(id);
        return;
    }

    // Handle Card click
    const card = e.target.closest('.repo-card');
    if (card) {
        const id = card.dataset.id;
        if (id) openModal(id);
    }
});

refreshBtn.addEventListener('click', () => {
    refreshBtn.style.pointerEvents = 'none';
    fetchData().finally(() => {
        setTimeout(() => {
            refreshBtn.style.pointerEvents = 'auto';
        }, 1000);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});
