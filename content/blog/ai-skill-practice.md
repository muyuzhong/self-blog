---
title: "我现在不再手写 Skill，而是让 AI 先写，再用结果去训练它"
excerpt: "Claude 或 Codex 先生成 Skill 初版，再用真实任务、失败轨迹和 SkillOpt 去优化。Skill 是可以被验证、被拒绝、被迭代的工程资产。"
tags: ["AI", "Agent", "Skills", "SkillOpt", "工程笔记"]
---

> **引言**
>
> 他站在铁匠铺前，看着那块粗粝的铁坯。第一锤落下时，它什么都不是——只是矿石的残渣、杂质的集合。但铁匠知道，真正的工作不是第一锤，而是之后的每一锤：加热、锻打、淬火、审视、再加热。刀锋不是在诞生时就有了形状，而是在无数次"打错了、修正、再打"的循环里，慢慢显露出它该有的轮廓。
>
> 写 Skill 也是这样。

---

> **TL;DR**
>
> 我以前写过一篇关于 Skill 的文章，重点还在"怎么把 Skill 写清楚"。但最近用得多了之后，我发现自己已经很少从空白文件开始手写 Skill。更实际的做法是：先让 Claude 或 Codex 生成一个结构正确的初版，再用真实任务样本跑几轮，把失败、误触发、输出偏差变成修改依据。到了 SkillOpt 这一类工具里，Skill 甚至可以被当成一个可训练的文本参数：rollout、reflect、edit、gate，最后导出 `best_skill.md`。

写 Skill 是手艺活。先想清楚触发场景，再写 description，再整理工作流、反模式、例子和脚本。这个过程有一个隐含前提：我知道这个 Skill 应该长什么样。

这个前提经不起验证。

很多 Skill 在写之前设计不好。它的问题要等到模型拿着它去做任务时才暴露：该触发时没触发，不该触发时被打开；正文写得很完整，模型读完仍然不知道下一步做什么；反模式写得太软，模型还是会顺手多做。

Skill 的质量靠它在任务里的行为判断。第一版先交给 AI。

## 第一步，把任务边界说清楚

Claude 和 Codex 现在都有官方封装的创建 Skill 能力。先交给它任务边界，比一开始就写 `SKILL.md` 更好。

我通常会给 AI 这样一段输入：

```text
我要创建一个 skill，用于 [任务类型]。

使用场景：
- 用户会在什么情况下需要它
- 典型触发词是什么
- 哪些相似场景不该触发

目标输出：
- 最终要产出什么
- 文件格式或目录结构是什么
- 是否需要脚本、模板、reference

已有样本：
- 2-3 个成功任务
- 2-3 个失败任务
- 我不喜欢的输出样式

约束：
- 不要做什么
- 遇到什么情况必须追问
- 哪些内容应该放进 SKILL.md，哪些应该放进 references/
```

不要让 AI "帮我写一个更强的 prompt"。那样它很容易写出一份长而热闹的说明书。

让它做工程拆分：哪些内容进 frontmatter，哪些进 `SKILL.md`，哪些拆到 `references/`，哪些应该变成脚本。

一个 Skill 的第一版，结构正确比漂亮重要。它至少要有这几层：

```text
skill-name/
├── SKILL.md
├── references/
├── scripts/
└── agents/openai.yaml
```

`SKILL.md` 是入口，告诉模型什么时候用、怎么开始、什么时候停。更长的材料放到 `references/`；确定性强、容易写错的流程放到 `scripts/`。

AI 擅长生成合规、完整、不漏字段的骨架。人的工作是给它足够好的边界。

## 第二步，让 AI 先做一个"可失败"的初版

第一版 Skill 不需要完美。

第一版只要满足三个要求：

1. 能被正确触发；
2. 能指导模型完成主路径；
3. 有足够明确的反模式。

它一定会有问题。问题要留到真实任务里暴露。

比如我之前写技术博客风格 Skill 时，一开始会写"技术分析 70%，文学余味 30%"。这句话看起来清楚，但模型实际使用时仍然可能跑偏：有时写得太散文，有时又完全没有个人判断。

后来我才知道，更具体的操作规则比比例本身有用：

- 开头要先提出技术张力；
- 每个主要段落必须有工程细节；
- 文学表达只放在开头、转折和结尾；
- 不要用隐喻压住技术主干；
- 结尾要留下工程判断，而不是空泛感慨。

这些规则从一次次改稿里反推出来。

Skill 的第一版应该允许自己暴露问题。失败轨迹告诉你它缺的是触发规则、执行步骤、反模式，还是样例。

## 第三步，用真实任务优化

手工优化 Skill 时，我会做一个很简单的表：

```text
任务输入 | 是否触发 | 输出问题 | 应该补到哪里
```

例如：

```text
"帮我把这些材料整理成博客"
触发：是
问题：文章像总结，不像开发者复盘
修改：在 SKILL.md 增加"先写误解，再写实践改变判断"的段落节奏
```

再比如：

```text
"只帮我改一下标题"
触发：不应该触发
问题：长文写作 Skill 被误用
修改：在 description 里明确排除纯标题生成
```

这类记录比"感觉还不够好"有用得多。它把 Skill 修改从审美问题变成了定位问题。

失败一般落在四个位置：触发失败（description 没写清楚）、执行失败（`SKILL.md` 太抽象）、边界失败（反模式不够硬）、材料失败（例子和参考放错了位置）。

这时再让 AI 改 Skill，给它明确诊断：

```text
这个 skill 在三个任务里误触发了。
问题集中在 description 过宽。
请只修改 frontmatter description，不要改正文。
需要新增排除场景：标题生成、单句润色、短社媒文案。
```

这样改出来的 Skill 会稳定很多。它被约束得更准。

## 第四步，把 Skill 当成可以训练的文本参数

SkillOpt 这类工具把 Skill 的优化再往前推了一步。

SkillOpt 的思路很直接：不改模型权重，把 Skill 文档本身当成要训练的外部状态。目标模型固定，任务环境固定，优化器模型根据 rollout 轨迹提出修改，然后用验证集决定是否接受。

**target model** 拿着 Skill 做任务，**optimizer model** 看轨迹、找失败模式、提修改建议。执行和改说明书被拆开。部署时只需要 target model 和最终的 Skill 文档，optimizer model 的成本只发生在训练阶段。训练 Skill 是一次性付费，使用时没有额外推理链路。

它的循环大致是：

```text
Rollout  ->  Reflect  ->  Aggregate  ->  Select  ->  Update  ->  Gate
执行任务     分析轨迹      合并补丁       选编辑       改 Skill     验证是否变好
```

这套流程引入了一个硬性门槛：**改动必须通过验证，不能因为看起来合理就被接受。**

SkillOpt 对修改非常克制。它不鼓励一次性重写整份文档，用 textual learning rate 控制每轮最多改几条规则。论文默认 4 条，和神经网络的 learning rate 类似：步子太小，学得慢；步子太大，好的规则和坏的规则混在一起，验证集判断不了谁带来了变化。

被验证集否掉的修改不会消失，而是作为负反馈留给后续 reflection，提醒优化器不要重复踩同一个坑。还有 slow/meta update：跨 epoch 回顾 Skill 的长期变化，把更高层的策略记下来，类似 momentum——不只看当前一步的梯度，也保留一部分历史方向。

Skill 优化追求"每次只留下经过验证的改动"。

我把项目 clone 到了 `E:\tools\SkillOpt`，里面的结构很清楚：

```text
E:\tools\SkillOpt
├── configs/
├── data/
├── skillopt/
├── scripts/
├── outputs/
└── docs/
```

如果只是跑一个最小实验，大概是这样：

```powershell
cd E:\tools\SkillOpt
pip install -e .

python scripts/train.py `
  --config configs/searchqa/default.yaml `
  --split_dir data/searchqa_split `
  --num_epochs 2 `
  --batch_size 5 `
  --edit_budget 3
```

这里的 `--edit_budget 3` 就是我本地实验里用的"每轮最多接受多少条编辑"。论文里提到的默认上限是 4，我本地为了小样本实验收得更紧一点。

更推荐的写法，是把覆盖项放到 `--cfg-options` 里：

```powershell
python scripts/train.py `
  --config configs/searchqa/default.yaml `
  --cfg-options `
    train.num_epochs=2 `
    train.batch_size=5 `
    optimizer.learning_rate=3 `
    env.split_dir=data/searchqa_split
```

一次运行之后，重点看 `outputs/<run_name>/`：

```text
config.json
history.json
runtime_state.json
best_skill.md
skills/skill_v0000.md
steps/step_0001/
```

`history.json` 告诉你每一步有没有产生 patch、有没有被 gate 接受、当前 skill 分数有没有提升。`steps/` 里能看到候选 skill、合并后的 patch、验证结果。`best_skill.md` 才是最后可复用的产物。

这和手写 Skill 最大的区别：它保留了优化过程。

微软团队在多个 benchmark 上测到平均提升明显，覆盖直接对话、Codex 执行环境、Claude Code 执行环境。benchmark 和真实个人工作流之间有距离，我不会拿来替自己的项目背书。它说明了一件事：Skill 可以变成一种跨模型、跨执行环境迁移的文本策略。

## 我本地跑出来的一个反直觉结果

我本地有几组输出，比如：

```text
outputs/skillopt_searchqa_mimo-v2.5-pro_20260527_164746
outputs/skillopt_interview_practice_mimo-v2.5-pro_20260527_203249
```

SearchQA 那组里，`summary.json` 显示 baseline selection hard 已经是 `1.0`，best selection hard 也是 `1.0`。`history.json` 里有 patch 产生，但 gate 最后都是 reject。

这看起来像"优化失败"。它给了一个提醒：

**如果评估集太容易，SkillOpt 没有理由接受新 Skill。**

在这个实验里，初始 skill 已经能把验证集跑满，后续编辑即使看起来更丰富，也不会提高分数。gate 拒绝它们，反而说明系统没有被"看起来更好"的文本骗走。

Skill 优化不是让文档越来越长，也不是让规则越来越多。它只关心这些规则有没有让目标任务变稳。

另一个 interview_practice 的输出也类似。很多 step 没有生成 patch，或者生成了也没有被接受。这说明如果任务样本太简单、评分太宽，优化器找不到真正可学习的梯度。

人要把精力从"写几条看起来不错的规则"，转移到"准备能暴露问题的任务和评估"。

要让 SkillOpt 真正发挥作用，准备更好的任务集比换更强的模型重要：

- 要有失败样本；
- 要有边界样本；
- 要有会诱导模型误触发的样本；
- 评分标准要能区分"看起来对"和"真的对"；
- 验证集不能和训练集太像。

数据没有难度，loss 就没有方向。

## 我现在会怎样做一个新 Skill

做一个新 Skill，按这条路径走。

先让 AI 生成初版。

要求它输出目录结构、`SKILL.md`、可能需要的 `references/` 和 `scripts/`。同时让它解释哪些内容为什么放在入口，哪些内容为什么延迟加载。

然后准备 10 到 30 个真实任务样本。

这一步比写 Skill 更重要。样本最好分成四类：主路径、边界、失败、反例。没有这些样本，后面的优化都只是在凭感觉。

接着手工跑几轮。

先不用 SkillOpt。直接让 Claude 或 Codex 带着 Skill 做任务，记录触发、输出、失败原因。这个阶段的目标是找出 Skill 的主要失败面。

然后把失败转成修改请求。

不要对 AI 说"优化一下"。要说清楚它要修改哪一层：

```text
只改 description，让它减少误触发。
```

或者：

```text
保留正文结构，只在 Rewrite Rules 里增加两个反模式。
```

最后再上 SkillOpt。

当任务可以被自动评分，或者至少有一个稳定 evaluator 时，再让 SkillOpt 去跑。它适合优化那些可以重复执行、可以打分、可以比较候选版本的 Skill。

如果任务本身很主观，比如"文章更有气质"，SkillOpt 就不一定是第一选择。你需要先把"好"拆成可检查的指标，比如技术细节密度、是否保留原意、是否避免营销腔、是否有明确结尾判断。

这也是我觉得个人使用 SkillOpt 时最需要警惕的地方。很多个人 Skill 其实没有现成 evaluator，比如写作风格、代码审查口吻、项目复盘结构。它们要先把"好"拆成检查项。工具只能帮你跑流程，不能替你定义方向。

## Skill 不是一次写完的文档

Skill 不是一份写完就能用的说明书。它有入口、有模块、有测试样本、有失败记录、有版本、有验证。手写只是第一步，AI 生成只是第一版，真正让它变稳的是后面的任务反馈。

做 Skill 分三层：

第一层，让 AI 写出结构。  
第二层，用真实任务暴露失败。  
第三层，用工具或验证循环决定哪些修改值得留下。

Claude 和 Codex 的 Skill 创建能力解决第一层，把模糊需求变成合规的 Skill 目录。手工测试解决第二层，看到 Skill 在真实任务里怎么误判。SkillOpt 解决第三层，把"我觉得该改"变成"这个改动有没有通过验证"。

三层合起来，才像一个完整的 Skill 工作流。建立一个让 Skill 变好的循环，比写一个好 Skill 更重要。

一个 Skill 真正成熟的时刻：它第一次拒绝了一个看起来合理但没有带来提升的修改。它开始像一个有验证边界的工程对象。

---

> 那块铁坯最终成了一把刀。它不会记得自己被打了多少锤，也不会知道哪一锤最关键。但它知道一件事：每一锤都留下了痕迹，而痕迹的累积，就是锋利。
>
> Skill 的成熟，不在于它第一次被写得多漂亮，而在于它第一次拒绝了一个没有带来提升的修改。那一刻，它开始像一把真正的刀——有边界，有重量，有方向。
>
> 而铁匠放下锤子，看着刀锋上映出的自己的脸，知道明天还要再来。因为刀会钝，任务会变，而锻造这件事，从来没有终点。

---

## 参考

- [SkillOpt 项目页](https://microsoft.github.io/skillopt/)
- [SkillOpt arXiv 论文](https://arxiv.org/abs/2605.23904)
