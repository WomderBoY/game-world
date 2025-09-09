// 游戏页面数据加载功能
class GameLoader {
    constructor() {
        this.gameId = null;
        this.gameData = null;
        this.init();
    }

    async init() {
        // 获取URL参数中的游戏ID
        this.gameId = Utils.getUrlParameter('id');
        
        if (!this.gameId || !Utils.isValidGameId(this.gameId)) {
            console.error('❌ 未找到游戏ID参数或游戏ID无效');
            this.showError('未找到游戏ID参数或游戏ID无效');
            return;
        }

        console.log(`🎮 加载游戏ID: ${this.gameId}`);

        // 加载游戏数据
        await this.loadGameData();
        
        if (this.gameData) {
            this.renderGamePage();
        } else {
            this.showError('游戏数据加载失败');
        }
    }

    async loadGameData() {
        try {
            // 直接加载对应游戏的JSON文件
            const gameData = await Utils.loadJSON(`data/games/${this.gameId}/${this.gameId}.json`);
            
            if (!gameData) {
                throw new Error('无法加载游戏数据');
            }

            this.gameData = gameData;
            console.log('✅ 游戏数据加载成功:', this.gameData);
        } catch (error) {
            console.error('❌ 游戏数据加载失败:', error);
            this.gameData = null;
        }
    }

    renderGamePage() {
        // 更新页面标题
        document.title = `${this.gameData.title} - 游戏天地`;
        
        // 更新面包屑导航
        this.updateBreadcrumb();
        
        // 更新游戏标题和描述
        this.updateGameHeader();
        
        // 渲染模块导航
        this.renderModules();
    }

    updateBreadcrumb() {
        const gameTitleElement = document.getElementById('game-title');
        if (gameTitleElement) {
            gameTitleElement.textContent = this.gameData.title;
        }
    }

    updateGameHeader() {
        const gameNameElement = document.getElementById('game-name');
        const gameDescriptionElement = document.getElementById('game-description');
        
        if (gameNameElement) {
            gameNameElement.textContent = this.gameData.title;
        }
        
        if (gameDescriptionElement) {
            gameDescriptionElement.textContent = this.gameData.description;
        }
    }

    renderModules() {
        const modulesGrid = document.getElementById('modules-grid');
        
        if (!modulesGrid || !this.gameData.modules) {
            console.error('❌ 模块容器或模块数据不存在');
            return;
        }

        // 清空现有内容
        modulesGrid.innerHTML = '';

        // 为每个模块创建卡片
        this.gameData.modules.forEach(module => {
            const moduleCard = this.createModuleCard(module);
            modulesGrid.appendChild(moduleCard);
        });

        console.log(`✅ 渲染了 ${this.gameData.modules.length} 个模块`);
    }

    createModuleCard(module) {
        const card = document.createElement('div');
        card.className = 'module-card';
        
        // 创建模块链接
        const moduleLink = `module.html?game=${this.gameId}&module=${module.id}`;
        
        // 为不同模块设置不同的图标
        const moduleIcons = {
            'guide': '📚',
            'beginner-guide': '📖',
            'characters': '👥',
            'strategy': '🎯',
            'esports': '🏆',
            'world': '🌍',
            'items': '⚔️',
            'quests': '📜',
            'tips': '💡',
            'weapons': '🗡️',
            'elements': '⚡',
            'events': '🎉',
            'weapon': '🔫',
            'map': '🗺️'
        };
        
        const icon = moduleIcons[module.id] || '🎮';
        
        // 如果有thumbnail图片，使用图片；否则使用图标
        const imageContent = module.thumbnail 
            ? `<img src="${module.thumbnail}" alt="${module.title}" class="module-thumbnail" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="module-card-icon" style="display: none;">${icon}</div>`
            : `<div class="module-card-icon">${icon}</div>`;
        
        card.innerHTML = `
            <div class="module-card-image">
                ${imageContent}
            </div>
            <div class="module-card-content">
                <h3>${module.title}</h3>
                <p>${module.description}</p>
                <a href="${moduleLink}" class="module-card-button">进入模块</a>
            </div>
        `;

        return card;
    }

    showError(message) {
        // 跳转到404页面
        window.location.href = '404.html';
    }
}

// 当DOM加载完成后初始化游戏加载器
document.addEventListener('DOMContentLoaded', function() {
    // 只在game.html页面初始化
    if (window.location.pathname.includes('game.html')) {
        new GameLoader();
    }
});
