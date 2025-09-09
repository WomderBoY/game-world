// 模块页面数据加载功能
class ModuleLoader {
    constructor() {
        this.gameId = null;
        this.moduleId = null;
        this.subPageId = null;
        this.gameData = null;
        this.moduleData = null;
        this.moduleDetails = null;
        this.init();
    }

    async init() {
        // 获取URL参数
        this.gameId = Utils.getUrlParameter('game');
        this.moduleId = Utils.getUrlParameter('module');
        this.subPageId = Utils.getUrlParameter('subpage');
        
        if (!this.gameId || !this.moduleId || 
            !Utils.isValidGameId(this.gameId) || 
            !Utils.isValidModuleId(this.moduleId)) {
            console.error('❌ 未找到游戏ID或模块ID参数，或参数无效');
            this.showError('未找到游戏ID或模块ID参数，或参数无效');
            return;
        }

        console.log(`🎮 加载游戏ID: ${this.gameId}, 模块ID: ${this.moduleId}, 子页面ID: ${this.subPageId || '无'}`);

        // 加载游戏数据
        await this.loadGameData();
        
        if (this.gameData) {
            this.findModuleData();
            await this.loadModuleDetails();
            this.handleSubPageLogic();
            this.renderModulePage();
        } else {
            this.showError('游戏数据加载失败');
        }
    }

    async loadGameData() {
        try {
            // 加载游戏数据
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

    findModuleData() {
        if (!this.gameData || !this.gameData.modules) {
            this.moduleData = null;
            return;
        }

        // 根据模块ID查找对应的模块数据
        this.moduleData = this.gameData.modules.find(module => module.id === this.moduleId);
        
        if (!this.moduleData) {
            console.error(`❌ 未找到ID为 ${this.moduleId} 的模块数据`);
        } else {
            console.log('✅ 模块数据加载成功:', this.moduleData);
        }
    }

    async loadModuleDetails() {
        try {
            // 尝试加载模块的详细数据
            const moduleDetails = await Utils.loadJSON(`data/games/${this.gameId}/modules/${this.moduleId}.json`);
            
            if (moduleDetails) {
                this.moduleDetails = moduleDetails;
                console.log('✅ 模块详细数据加载成功:', this.moduleDetails);
            } else {
                // 如果没有详细数据文件，使用默认内容
                this.moduleDetails = null;
                console.log('ℹ️ 未找到模块详细数据，使用默认内容');
            }
        } catch (error) {
            console.log('ℹ️ 模块详细数据加载失败，使用默认内容:', error);
            this.moduleDetails = null;
        }
    }

    handleSubPageLogic() {
        // 如果模块支持子页面
        if (this.moduleDetails && this.moduleDetails.hasSubPages) {
            // 如果没有指定子页面ID，使用默认子页面
            if (!this.subPageId) {
                this.subPageId = this.moduleDetails.defaultSubPage;
                // 更新URL但不刷新页面
                this.updateURL();
            }
            
            // 验证子页面ID是否有效
            const validSubPage = this.moduleDetails.subPages.find(subPage => subPage.id === this.subPageId);
            if (!validSubPage) {
                console.warn(`⚠️ 无效的子页面ID: ${this.subPageId}，使用默认子页面`);
                this.subPageId = this.moduleDetails.defaultSubPage;
                this.updateURL();
            }
            
            console.log(`📄 当前子页面: ${this.subPageId}`);
        } else {
            // 如果模块不支持子页面，清除子页面ID
            this.subPageId = null;
        }
    }

    updateURL() {
        const newUrl = new URL(window.location);
        if (this.subPageId) {
            newUrl.searchParams.set('subpage', this.subPageId);
        } else {
            newUrl.searchParams.delete('subpage');
        }
        window.history.replaceState({}, '', newUrl);
    }

    renderModulePage() {
        // 更新页面标题
        document.title = `${this.moduleData?.title || '模块'} - ${this.gameData.title} - 游戏天地`;
        
        // 更新面包屑导航
        this.updateBreadcrumb();
        
        // 更新模块标题和描述
        this.updateModuleHeader();
        
        // 渲染次级导航栏
        this.renderSubNav();
        
        // 渲染模块内容
        this.renderModuleContent();
    }

    updateBreadcrumb() {
        const breadcrumbContainer = document.getElementById('breadcrumb');
        
        if (!breadcrumbContainer) {
            console.error('❌ 面包屑容器不存在');
            return;
        }

        // 构建面包屑HTML
        let breadcrumbHTML = `
            <a href="index.html" class="breadcrumb-link">首页</a>
            <span class="breadcrumb-separator">></span>
            <a href="game.html?id=${this.gameId}" class="breadcrumb-link">${this.gameData.title}</a>
            <span class="breadcrumb-separator">></span>
        `;

        // 在面包屑中显示所有模块，当前模块高亮
        if (this.gameData.modules && this.gameData.modules.length > 0) {
            const moduleLinks = this.gameData.modules.map(module => {
                const isCurrentModule = module.id === this.moduleId;
                const linkClass = isCurrentModule ? 'breadcrumb-current' : 'breadcrumb-link';
                const href = isCurrentModule ? '#' : `module.html?game=${this.gameId}&module=${module.id}`;
                
                return `<a href="${href}" class="${linkClass}">${module.title}</a>`;
            }).join(' ');
            
            breadcrumbHTML += moduleLinks;
        } else {
            breadcrumbHTML += `<span class="breadcrumb-current">${this.moduleData?.title || '模块'}</span>`;
        }

        breadcrumbContainer.innerHTML = breadcrumbHTML;
    }

    updateModuleHeader() {
        const moduleNameElement = document.getElementById('module-name');
        const moduleDescriptionElement = document.getElementById('module-description');
        
        if (moduleNameElement) {
            moduleNameElement.textContent = this.moduleData?.title || '模块';
        }
        
        if (moduleDescriptionElement) {
            moduleDescriptionElement.textContent = this.moduleData?.description || '模块描述';
        }
    }

    renderSubNav() {
        const subNav = document.getElementById('sub-nav');
        
        if (!subNav) {
            console.error('❌ 次级导航容器不存在');
            return;
        }

        // 清空现有内容
        subNav.innerHTML = '';

        // 如果当前模块支持子页面，显示子页面导航
        if (this.moduleDetails && this.moduleDetails.hasSubPages && this.moduleDetails.subPages) {
            this.renderSubPageNav(subNav);
        } else {
            // 如果不支持子页面，隐藏次级导航栏
            subNav.style.display = 'none';
        }
    }

    renderSubPageNav(subNav) {
        // 显示次级导航栏
        subNav.style.display = 'flex';

        // 为每个子页面创建链接
        this.moduleDetails.subPages.forEach(subPage => {
            const link = document.createElement('a');
            link.className = 'sub-nav-link sub-page-link';
            link.href = `module.html?game=${this.gameId}&module=${this.moduleId}&subpage=${subPage.id}`;
            link.textContent = subPage.title;
            
            // 高亮当前子页面
            if (subPage.id === this.subPageId) {
                link.classList.add('active');
            }
            
            subNav.appendChild(link);
        });

        console.log(`✅ 渲染了 ${this.moduleDetails.subPages.length} 个子页面导航链接`);
    }

    renderModuleNav(subNav) {
        // 为每个模块创建链接
        this.gameData.modules.forEach(module => {
            const link = document.createElement('a');
            link.className = 'sub-nav-link';
            link.href = `module.html?game=${this.gameId}&module=${module.id}`;
            link.textContent = module.title;
            
            // 高亮当前模块
            if (module.id === this.moduleId) {
                link.classList.add('active');
            }
            
            subNav.appendChild(link);
        });

        console.log(`✅ 渲染了 ${this.gameData.modules.length} 个模块导航链接`);
    }

    renderModuleContent() {
        const contentLayout = document.getElementById('content-layout');
        
        if (!contentLayout) {
            console.error('❌ 内容布局容器不存在');
            return;
        }

        // 如果有详细数据，使用详细数据；否则使用默认内容
        let contentText;
        let contentImage;
        
        if (this.moduleDetails && this.moduleDetails.hasSubPages && this.subPageId) {
            // 如果有子页面，渲染子页面内容
            contentText = this.generateSubPageContent();
            contentImage = this.getSubPageImage();
        } else if (this.moduleDetails && this.moduleDetails.sections) {
            // 如果有详细数据但不是子页面结构，使用原有逻辑
            contentText = this.generateDetailedContent();
            contentImage = this.getModuleImage();
        } else {
            // 使用默认内容
            contentText = this.generateModuleContent();
            contentImage = this.getModuleIcon();
        }
        
        contentLayout.innerHTML = `
            <div class="content-text">
                ${contentText}
            </div>
            <div class="content-image">
                ${contentImage}
            </div>
        `;
    }

    generateModuleContent() {
        // 默认内容，当没有JSON文件时使用
        return `
            <h2>${this.moduleData?.title || '模块'}</h2>
            <p>${this.moduleData?.description || '这里是模块的详细内容...'}</p>
            <p>更多内容正在开发中，敬请期待！</p>
        `;
    }

    generateDetailedContent() {
        if (!this.moduleDetails || !this.moduleDetails.sections) {
            return this.generateModuleContent();
        }

        let content = `<h2>${this.moduleDetails.title}</h2>`;
        
        this.moduleDetails.sections.forEach((section, index) => {
            const sectionId = `section-${index}`;
            const isFirstSection = index === 0;
            
            content += `
                <div class="collapsible-section">
                    <h3 class="collapsible-header" onclick="toggleSection('${sectionId}')">
                        <span class="collapsible-icon">${isFirstSection ? '▼' : '▶'}</span>
                        ${section.heading}
                    </h3>
                    <div class="collapsible-content ${isFirstSection ? 'expanded' : ''}" id="${sectionId}">
            `;
            
            // 处理text数组
            if (section.text && Array.isArray(section.text)) {
                section.text.forEach(textItem => {
                    if (typeof textItem === 'string') {
                        // 如果是字符串，直接使用
                        content += `<p class="indent">${textItem}</p>`;
                    } else if (textItem && textItem.content) {
                        // 如果是对象，使用content和class
                        const className = textItem.class || '';
                        content += `<p class="${className}">${textItem.content}</p>`;
                    }
                });
            } else if (typeof section.text === 'string') {
                // 如果text是字符串，直接使用
                content += `<p class="indent">${section.text}</p>`;
            }
            
            content += `
                    </div>
                </div>
            `;
        });

        return content;
    }

    generateSubPageContent() {
        if (!this.moduleDetails || !this.moduleDetails.hasSubPages || !this.subPageId) {
            return this.generateModuleContent();
        }

        // 获取当前子页面的信息
        const currentSubPage = this.moduleDetails.subPages.find(subPage => subPage.id === this.subPageId);
        if (!currentSubPage) {
            return this.generateModuleContent();
        }

        // 获取当前子页面的内容
        const subPageSections = this.moduleDetails.sections[this.subPageId];
        if (!subPageSections) {
            return this.generateModuleContent();
        }

        let content = `<h2>${currentSubPage.title}</h2>`;
        content += `<p class="subpage-description">${currentSubPage.description}</p>`;
        
        subPageSections.forEach((section, index) => {
            const sectionId = `section-${index}`;
            const isFirstSection = index === 0; // 第一个section默认展开
            
            content += `
                <div class="collapsible-section">
                    <h3 class="collapsible-header" onclick="toggleSection('${sectionId}')">
                        <span class="collapsible-icon">${isFirstSection ? '▼' : '▶'}</span>
                        ${section.heading}
                    </h3>
                    <div class="collapsible-content ${isFirstSection ? 'expanded' : ''}" id="${sectionId}">
            `;
            
            // 处理文本内容
            if (Array.isArray(section.text)) {
                // 如果是数组格式，处理每个文本项
                section.text.forEach(textItem => {
                    if (typeof textItem === 'string') {
                        // 普通字符串
                        content += `<p>${textItem}</p>`;
                    } else if (typeof textItem === 'object' && textItem.content) {
                        // 对象格式，支持class属性
                        const className = textItem.class ? ` class="${textItem.class}"` : '';
                        content += `<p${className}>${textItem.content}</p>`;
                    }
                });
            } else {
                // 如果是字符串格式，保持原有逻辑
                content += `<p>${section.text}</p>`;
            }
            
            content += `
                    </div>
                </div>
            `;
        });

        return content;
    }

    getSubPageImage() {
        // 获取当前子页面的内容
        const subPageSections = this.moduleDetails.sections[this.subPageId];
        if (!subPageSections || subPageSections.length === 0) {
            return `<div class="placeholder-image">${this.getModuleIcon()}</div>`;
        }

        // 查找第一个有图片的section
        for (const section of subPageSections) {
            if (section.image) {
                return `<img src="${section.image}" alt="${section.heading}" class="content-image-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="placeholder-image" style="display: none;">${this.getModuleIcon()}</div>`;
            }
        }

        // 如果没有找到图片，使用占位符
        return `<div class="placeholder-image">${this.getModuleIcon()}</div>`;
    }

    getModuleImage() {
        // 获取模块的详细数据
        if (!this.moduleDetails || !this.moduleDetails.sections) {
            return `<div class="placeholder-image">${this.getModuleIcon()}</div>`;
        }

        // 查找第一个有图片的section
        for (const section of this.moduleDetails.sections) {
            if (section.image) {
                return `<img src="${section.image}" alt="${section.heading}" class="content-image-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="placeholder-image" style="display: none;">${this.getModuleIcon()}</div>`;
            }
        }

        // 如果没有找到图片，使用占位符
        return `<div class="placeholder-image">${this.getModuleIcon()}</div>`;
    }

    getModuleIcon() {
        const iconMap = {
            'guide': '📚',
            'beginner-guide': '📖',
            'characters': '👥',
            'heros': '👥',
            'strategy': '🎯',
            'esports': '🏆',
            'world': '🌍',
            'items': '⚔️',
            'quests': '📜',
            'tips': '💡',
            'weapons': '🗡️',
            'elements': '⚡',
            'events': '🎉'
        };

        return iconMap[this.moduleId] || '🎮';
    }

    showError(message) {
        // 跳转到404页面
        window.location.href = '404.html';
    }
}

// 全局折叠功能函数
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const header = content.previousElementSibling;
    const icon = header.querySelector('.collapsible-icon');
    
    if (content.classList.contains('expanded')) {
        // 折叠
        content.classList.remove('expanded');
        icon.textContent = '▶';
    } else {
        // 展开
        content.classList.add('expanded');
        icon.textContent = '▼';
    }
}

// 当DOM加载完成后初始化模块加载器
document.addEventListener('DOMContentLoaded', function() {
    // 只在module.html页面初始化
    if (window.location.pathname.includes('module.html')) {
        new ModuleLoader();
    }
});
