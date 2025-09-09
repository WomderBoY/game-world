// 工具函数
class Utils {
    // 获取URL参数
    static getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // 加载JSON数据
    static async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('加载JSON数据失败:', error);
            return null;
        }
    }

    // 生成面包屑导航
    static generateBreadcrumb(items) {
        return items.map((item, index) => {
            if (index === items.length - 1) {
                return `<span class="breadcrumb-current">${item.text}</span>`;
            } else {
                return `<a href="${item.link}" class="breadcrumb-link">${item.text}</a>`;
            }
        }).join(' <span class="breadcrumb-separator">></span> ');
    }

    // 跳转到404页面
    static redirectTo404() {
        window.location.href = '404.html';
    }

    // 验证游戏ID是否有效
    static isValidGameId(gameId) {
        const validGameIds = ['game1', 'game2', 'game3'];
        return validGameIds.includes(gameId);
    }

    // 验证模块ID是否有效
    static isValidModuleId(moduleId) {
        const validModuleIds = [
            'guide', 'beginner-guide', 'characters', 'heros', 'strategy', 'esports',
            'world', 'items', 'quests', 'tips',
            'weapons', 'elements', 'events', 'weapon', 'map'
        ];
        return validModuleIds.includes(moduleId);
    }
}
