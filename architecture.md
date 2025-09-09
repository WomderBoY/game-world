# 🎮 游戏天地网站架构（新版）

## 1. 总体说明

* 采用 **HTML/CSS/JS + JSON 数据驱动**
* 首页负责展示所有游戏的入口（轮播图）
* 每个游戏有单独的二级页面，展示模块导航
* 每个模块有单独的三级页面，展示详细内容

---

## 2. 文件与文件夹结构

```
game-world/
│
├── index.html                  # 首页（轮播图展示游戏入口）
├── game.html                   # 二级页面模板（展示某个游戏的模块导航）
├── module.html                 # 三级页面模板（展示某模块详细内容）
│
├── data/                       # JSON 数据
│   ├── games.json              # 首页游戏数据（用于轮播图）
│   └── games/                  
│       ├── game1/              # 游戏1文件夹
│       │   ├── game1.json      # 游戏1数据（包含模块信息）
│       │   └── modules/        # 游戏1的模块数据
│       │       ├── characters.json
│       │       ├── esports.json
│       │       ├── guide.json
│       │       └── strategy.json
│       ├── game2/              # 游戏2文件夹
│       │   ├── game2.json      # 游戏2数据
│       │   └── modules/        # 游戏2的模块数据
│       │       ├── items.json
│       │       ├── quests.json
│       │       ├── tips.json
│       │       └── world.json
│       └── game3/              # 游戏3文件夹
│           ├── game3.json      # 游戏3数据
│           └── modules/        # 游戏3的模块数据
│               ├── characters.json
│               ├── elements.json
│               ├── events.json
│               └── weapons.json
│
├── assets/                     
│   ├── css/
│   │   ├── reset.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── main.js             # 全局逻辑（导航、面包屑）
│   │   ├── carousel.js         # 首页轮播图逻辑
│   │   ├── loadGame.js         # 二级页面加载指定游戏的模块导航
│   │   ├── loadModule.js       # 三级页面加载指定模块的详细内容
│   │   └── utils.js            # 工具函数
│   │
│   ├── img/
│   │   ├── logo.png
│   │   ├── carousel/           # 首页轮播图图片（每个游戏入口图）
│   │   ├── modules/            # 模块缩略图
│   │   └── details/            # 三级页面的详细插图
│   │
│   └── icons/
│
└── README.md
```

---

## 3. 数据文件设计

### 3.1 首页游戏数据：`games.json`

供 **首页轮播图** 使用

```json
[
  {
    "id": "game1",
    "title": "王者荣耀",
    "image": "assets/img/carousel/lol.jpg",
    "link": "game.html?id=game1"
  },
  {
    "id": "game2",
    "title": "塞尔达传说",
    "image": "assets/img/carousel/zelda.jpg",
    "link": "game.html?id=game2"
  }
]
```

---

### 3.2 游戏数据（含模块信息）：`games/game1.json`

供 **二级页面（game.html）** 使用

```json
{
  "id": "game1",
  "title": "王者荣耀",
  "modules": [
    {
      "id": "guide",
      "title": "新手指南",
      "thumbnail": "assets/img/modules/lol_guide.jpg",
      "description": "适合新玩家的入门教程",
      "link": "module.html?game=game1&module=guide"
    },
    {
      "id": "characters",
      "title": "角色介绍",
      "thumbnail": "assets/img/modules/lol_characters.jpg",
      "description": "英雄的背景与技能",
      "link": "module.html?game=game1&module=characters"
    }
  ]
}
```

---

### 3.3 模块数据：`games/game1/modules/guide.json`

供 **三级页面（module.html）** 使用

```json
{
  "gameId": "game1",
  "moduleId": "guide",
  "title": "王者荣耀 - 新手指南",
  "sections": [
    {
      "heading": "游戏目标",
      "text": "玩家分成两队，目标是摧毁敌方主基地。",
      "image": "assets/img/details/lol_goal.jpg"
    },
    {
      "heading": "操作基础",
      "text": "学习如何移动、攻击和释放技能。",
      "image": "assets/img/details/lol_controls.jpg"
    }
  ]
}
```

**实际文件结构说明：**
- 每个游戏有独立的文件夹（如 `game1/`, `game2/`, `game3/`）
- 游戏主数据文件位于 `games/gameX/gameX.json`
- 模块数据文件位于 `games/gameX/modules/` 文件夹下
- 模块文件名直接使用模块ID（如 `guide.json`, `characters.json`）

---

## 4. 页面逻辑说明

### 4.1 **首页（index.html）**

* 动态读取 `games.json`
* 渲染轮播图（每张图点击 → 跳转 `game.html?id=xxx`）

### 4.2 **二级页面（game.html）**

* 获取 URL 参数 `id`
* 读取对应 `games/gameX/gameX.json`
* 动态渲染 **2×2 卡片模块导航**
* 点击模块卡片 → 跳转 `module.html?game=xxx&module=yyy`

### 4.3 **三级页面（module.html）**

* 获取 URL 参数 `game` 和 `module`
* 加载 `games/gameX/modules/moduleY.json`
* 渲染：

  * 顶部导航 + 面包屑（首页 > 游戏 > 模块）
  * 横向三级导航（模块内小标题）
  * 主体：宽屏左文右图 / 窄屏文上图下

---

## 5. 脚本职责划分

* **`utils.js`**：获取 URL 参数、加载 JSON
* **`carousel.js`**：轮播逻辑
* **`loadGame.js`**：渲染二级页面模块导航
* **`loadModule.js`**：渲染三级页面内容
* **`main.js`**：全局导航栏折叠、面包屑生成


