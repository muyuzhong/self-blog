- # LowTemp Notes

  低温笔记 · [muyuzhong.xyz](https://muyuzhong.xyz/)

  > 在噪声退去之后，记录仍然成立的东西。

  这是低温笔记的站点源码。

  低温笔记是一个个人研究站点，主题是 Coding Agent 的可靠性：上下文工程、最小必要修改、增量验证。它本身也是一个实验——把"知识的成熟度"做成可见的状态，而不是让它藏在发布日期里。

  大多数技术博客默认一件事：文章发布时就是成品。这不成立。一个判断从"我觉得"到"我验证过"通常要几个月，中间的状态没有地方放，于是要么憋着不写，要么写完就假装它是结论。

  温度是给这个中间状态的一个坐标。

  ## 温度系统

  | 状态         | 温度   | 形态   | 含义                           |
  | ------------ | ------ | ------ | ------------------------------ |
  | `draft`      | 19.5°C | 雾     | 想法刚成形，可能是错的         |
  | `exploring`  | 14.0°C | 液态   | 在做，还没定型                 |
  | `tested`     | 8.4°C  | 结晶中 | 在真实项目里跑过，仍有反例风险 |
  | `stable`     | 4.2°C  | 结晶   | 长期没有遇到反例               |
  | `deprecated` | —      | 升华   | 观点已经改变                   |

  两条规则：

  - **站点温度是全部公开内容温度的中位数。** 它随写作变化，不是装饰。
  - **升华不删除。** 观点改变时，旧文标记 `deprecated` 并保留，在文首链接到新的判断。删掉错误的记录，等于删掉判断是怎么形成的。

  ## 内容分类

  | 分类     | 用途                           |
  | -------- | ------------------------------ |
  | 工程笔记 | 完整、可复用的工程文章         |
  | 研究笔记 | 尚未定型的探索                 |
  | 建造日志 | 项目中的决策与失败             |
  | 随笔     | 少量关于认知与行动的非技术思考 |

  编号：文章 `LTN-xxx`，项目 `LAB-xxx`。

  ## 目录结构

  ```
  src/
    content/
      writing/          # 文章，一篇一个文件
    components/         # 语义组件、温度显示
    pages/
      index.astro       # 首页
      writing/          # 文章列表与详情
      projects/         # 项目档案
      log/              # 日志
      about/            # 关于
  public/
    og.png
  ```

  ## Frontmatter

  ```yaml
  ---
  id: LTN-024
  title: Skill 的评价与优化
  subtitle: 从提示词经验到可测试的工程资产
  category: 工程笔记        # 工程笔记 | 研究笔记 | 建造日志 | 随笔
  status: stable           # draft | exploring | tested | stable | deprecated
  tags: [AGENT, EVALUATION, SKILL]
  published: 2026-07-13
  excerpt: Skill 的价值不在于描述得多完整，而在于它能否稳定改善 Agent 在真实任务中的表现。
  minutes: 9
  featured: true
  ---
  ```

  温度由 `status` 推导，不手写温度值。

  ## 正文语义组件

  正文用四个组件标记段落的性质。它们不是排版糖，是给读者的类型标注——读者有权知道哪一句是已验证的结论，哪一句只是想法。

  ```mdx
  <Note type="idea">还没验证的想法</Note>
  <Note type="decision">做了什么选择，以及代价是什么</Note>
  <Note type="failed">试过，不成立，原因是</Note>
  <Note type="open">还没有答案的问题</Note>
  ```

  以及 diff 块，用于展示真实的代码变更：

  ````
  ```diff
  - 旧做法
  + 新做法
  ```
  ````

  ## 本地运行

  ```bash
  pnpm install
  pnpm dev        # http://localhost:4321
  pnpm build
  pnpm preview
  ```

  ## 新增一篇文章

  1. 在 `src/content/writing/` 新建 `ltn-0xx-<slug>.md`
  2. 填 frontmatter，`status` 按当前真实成熟度填，不要一上来就写 `stable`
  3. 写正文，一篇只讲一个核心命题
  4. 想法变了就改 `status`，不要改结论、假装当初就想清楚了

  ## 这个站点不做的事

  - 没有评论区
  - 没有第三方追踪脚本
  - 没有阅读量、点赞、排行
  - 不删除已经不成立的文章
  - 不为了更新频率写没有观察支撑的内容

  理由和这个博客的主题是同一个：可靠性不来自能做更多，而来自知道哪些事不该做。

  ## 许可

  代码 MIT。文章 CC BY-NC 4.0——可以转载和引用，注明来源，不用于商业用途。

  ------

  **LowTemp Notes** — a personal research site on Coding Agent reliability: context engineering, minimal necessary change, incremental verification.

  Each note carries a temperature that marks how settled the idea is, from 19.5°C (fog) to 4.2°C (crystal). Notes that turn out wrong are marked as sublimated, not deleted.

  暮羽中 · Independent builder and observer
