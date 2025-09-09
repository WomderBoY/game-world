# 游戏天地网站数据结构说明

## 文件结构

```
data/
├── games.json                    # 首页轮播图数据
├── games/
│   ├── game1/                   # 王者荣耀游戏文件夹
│   │   ├── game1.json          # 王者荣耀游戏数据
│   │   └── modules/            # 王者荣耀模块数据
│   │       ├── guide.json      # 新手指南
│   │       ├── characters.json # 角色介绍
│   │       ├── strategy.json   # 战术攻略
│   │       └── esports.json    # 电竞赛事
│   ├── game2/                   # 塞尔达传说游戏文件夹
│   │   ├── game2.json          # 塞尔达传说游戏数据
│   │   └── modules/            # 塞尔达传说模块数据
│   │       ├── world.json      # 世界探索
│   │       ├── items.json      # 道具收集
│   │       ├── quests.json     # 任务攻略
│   │       └── tips.json       # 游戏技巧
│   └── game3/                   # 原神游戏文件夹
│       ├── game3.json          # 原神游戏数据
│       └── modules/            # 原神模块数据
│           ├── characters.json # 角色图鉴
│           ├── weapons.json    # 武器系统
│           ├── elements.json   # 元素反应
│           └── events.json     # 活动资讯
```

## 数据文件说明

### 1. 首页轮播图数据 (`data/games.json`)

用于首页轮播图显示，包含游戏的基本信息：

```json
[
  {
    "id": "game1",
    "title": "王者荣耀",
    "image": "assets/img/carousel/placeholder1.jpg",
    "link": "game.html?id=game1"
  }
]
```

### 2. 游戏数据 (`data/games/gameX/gameX.json`)

用于二级页面（game.html），包含游戏的详细信息和模块列表：

```json
{
  "id": "game1",
  "title": "王者荣耀",
  "description": "当下最热门的手游之一",
  "modules": [
    {
      "id": "guide",
      "title": "新手指南",
      "thumbnail": "assets/img/modules/lol_guide.jpg",
      "description": "适合新玩家的入门教程",
      "link": "module.html?game=game1&module=guide"
    }
  ]
}
```

### 3. 模块详细数据 (`data/games/gameX/modules/moduleY.json`)

用于三级页面（module.html），包含模块的详细内容：

```json
{
  "gameId": "game1",
  "moduleId": "guide",
  "title": "王者荣耀 - 新手指南",
  "sections": [
    {
      "heading": "游戏目标",
      "text": "玩家分成两队，目标是摧毁敌方主基地...",
      "image": "assets/img/details/lol_goal.jpg"
    }
  ]
}
```

## 数据加载流程

1. **首页**：加载 `data/games.json` 显示轮播图
2. **游戏页面**：根据URL参数 `id` 加载 `data/games/gameX/gameX.json`
3. **模块页面**：根据URL参数 `game` 和 `module` 加载：
   - `data/games/gameX/gameX.json`（获取游戏信息和模块列表）
   - `data/games/gameX/modules/moduleY.json`（获取模块详细内容，可选）

## 优势

1. **高度模块化**：每个游戏都有独立的文件夹，包含游戏数据和所有模块
2. **清晰的组织结构**：游戏文件夹下包含游戏数据和modules子文件夹
3. **易于扩展**：添加新游戏只需创建新的游戏文件夹
4. **简化文件命名**：模块文件使用简洁的名称（如guide.json而不是game1_guide.json）
5. **性能优化**：按需加载，减少初始加载时间
6. **维护性**：数据结构清晰，便于维护和更新
7. **团队协作友好**：不同开发者可以独立维护不同游戏的数据
