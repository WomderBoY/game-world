// 全局主要逻辑
console.log('游戏天地网站已加载');

// 导航栏汉堡菜单功能
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // 测试JSON数据加载
    testJSONLoading();
});

// 测试JSON数据加载功能
async function testJSONLoading() {
    try {
        const gamesData = await Utils.loadJSON('data/games.json');
        if (gamesData) {
            console.log('✅ JSON数据加载成功:', gamesData);
            console.log(`📊 共加载了 ${gamesData.length} 个游戏数据`);
        } else {
            console.error('❌ JSON数据加载失败');
        }
    } catch (error) {
        console.error('❌ JSON数据加载出错:', error);
    }
}
