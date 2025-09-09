// 轮播图功能
class Carousel {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.gamesData = [];
        this.init();
    }

    async init() {
        // 加载游戏数据
        await this.loadGamesData();
        
        // 绑定指示点点击事件
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (event) => {
                event.stopPropagation(); // 阻止事件冒泡，避免触发轮播图容器的点击事件
                this.goToSlide(index);
            });
        });

        // 绑定轮播图点击事件 - 只绑定到轮播图容器
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('click', (event) => {
                event.preventDefault();
                // 找到当前活动的轮播图
                const activeSlide = document.querySelector('.slide.active');
                if (activeSlide) {
                    const gameId = activeSlide.getAttribute('data-game-id');
                    console.log(`🖱️ 轮播图点击事件触发，当前活动轮播图游戏ID: ${gameId}`);
                    console.log(`🔍 点击的容器:`, carouselContainer);
                    console.log(`🔍 当前活动轮播图:`, activeSlide);
                    this.handleSlideClickByGameId(gameId);
                } else {
                    console.error('❌ 未找到当前活动的轮播图');
                }
            });
        }

        // 绑定箭头导航事件
        this.bindArrowNavigation();

        // 开始自动播放
        this.startAutoPlay();
    }

    async loadGamesData() {
        try {
            this.gamesData = await Utils.loadJSON('data/games.json');
            console.log('✅ 轮播图游戏数据加载成功:', this.gamesData);
            
            // 更新轮播图中的图片和内容
            this.updateCarouselImages();
        } catch (error) {
            console.error('❌ 轮播图游戏数据加载失败:', error);
            // 使用默认数据作为后备
            this.gamesData = [
                { id: 'game1', title: '王者荣耀', link: 'game.html?id=game1' },
                { id: 'game3', title: '原神', link: 'game.html?id=game3' },
                { id: 'game-studies', title: '游戏学研究', link: 'game-studies.html' }
            ];
        }
    }

    updateCarouselImages() {
        if (!this.gamesData || this.gamesData.length === 0) {
            console.error('❌ 没有游戏数据可以更新轮播图');
            return;
        }

        this.slides.forEach((slide, index) => {
            const game = this.gamesData[index];
            if (game) {
                // 更新图片
                const img = slide.querySelector('.slide-image');
                if (img && game.image) {
                    img.src = game.image;
                    img.alt = game.title;
                    console.log(`🖼️ 更新轮播图 ${index + 1} 图片: ${game.image}`);
                }

                // 更新标题和描述
                const titleElement = slide.querySelector('.slide-content h2');
                const descElement = slide.querySelector('.slide-content p');
                
                if (titleElement) {
                    titleElement.textContent = game.title;
                }
                
                if (descElement) {
                    // 根据游戏ID设置不同的描述
                    const descriptions = {
                        'game1': '当下最热门的手游之一',
                        'game3': '踏上提瓦特大陆的冒险',
                        'game-studies': '探索游戏与社会科学的关系'
                    };
                    descElement.textContent = descriptions[game.id] || '精彩游戏体验';
                }

                // 确保data-game-id属性正确
                slide.setAttribute('data-game-id', game.id);
            }
        });

        console.log('✅ 轮播图图片和内容更新完成');
    }

    goToSlide(index) {
        // 移除当前活动状态
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // 设置新的活动状态
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    bindArrowNavigation() {
        const prevArrow = document.querySelector('.carousel-arrow.prev');
        const nextArrow = document.querySelector('.carousel-arrow.next');
        
        if (prevArrow) {
            prevArrow.addEventListener('click', (event) => {
                event.stopPropagation(); // 阻止事件冒泡
                this.prevSlide();
            });
        }
        
        if (nextArrow) {
            nextArrow.addEventListener('click', (event) => {
                event.stopPropagation(); // 阻止事件冒泡
                this.nextSlide();
            });
        }
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000); // 每4秒切换一次
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }

    handleSlideClickByGameId(gameId) {
        console.log(`🎮 准备跳转到游戏ID: ${gameId}`);
        
        if (gameId) {
            // 添加延迟以便查看调试信息
            setTimeout(() => {
                if (gameId === 'game-studies') {
                    console.log(`✅ 跳转到: game-studies.html`);
                    window.location.href = `game-studies.html`;
                } else {
                    console.log(`✅ 跳转到: game.html?id=${gameId}`);
                    window.location.href = `game.html?id=${gameId}`;
                }
            }, 100);
        } else {
            console.error('❌ 未找到游戏ID');
        }
    }

    handleSlideClick(index) {
        console.log(`🖱️ 点击了轮播图索引: ${index}`);
        console.log(`📊 当前游戏数据:`, this.gamesData);
        
        // 根据轮播图索引跳转到对应的游戏页面
        if (this.gamesData && this.gamesData[index]) {
            const game = this.gamesData[index];
            console.log(`🎮 准备跳转到游戏: ${game.title} (${game.id})`);
            // 跳转到game.html页面，传递gameId参数
            window.location.href = `game.html?id=${game.id}`;
        } else {
            console.error('❌ 未找到对应的游戏数据，索引:', index);
            console.error('❌ 游戏数据长度:', this.gamesData ? this.gamesData.length : 'undefined');
        }
    }
}

// 当DOM加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', function() {
    new Carousel();
});
