---
id: LTN-022
title: 为什么我放弃原来的 Sandbox 架构
subtitle: Tau 魔改记录 01:一次错误的抽象如何拖慢项目
category: buildlog
status: tested
confidence: 中高
scope: Agent 基础设施
tags: [sandbox, architecture, coding-agent]
published: 2026-06-18
updated: 2026-06-30
excerpt: 我给 Agent 沙箱设计了一套"通用执行抽象",六周后亲手删掉。它解决的问题是真实的,但抽象层级错了。
minutes: 14
featured: true
tempLog:
  - { date: 2026-05-30, status: exploring }
  - { date: 2026-06-18, status: tested }
notes:
  - { anchor: "通用执行抽象", text: "当时觉得这是整个系统最优雅的部分。" }
---

五月的大部分时间,我在给 Coding Agent 写一个沙箱层。目标是真实的:Agent 执行的命令需要隔离、可观测、可回滚。错的是我的第一反应——设计一个"通用执行抽象",统一描述命令、文件操作和代码运行,再让三种后端去实现它。

## 失败的样子

抽象层本身不难写,难的是它每天都在漏。命令执行有超时和信号,文件操作有原子性和锁,代码运行有资源限制——三种语义在接口层被抹平,然后在每个后端里用特例重新冒出来。六周后,这个"统一层"里有 14 个 `if backend ==` 分支。

<div class="note failed">
<div class="note-label">FAILED ATTEMPT / 01</div>

通用执行抽象:UnifiedExec,一个接口三个后端。死于第 14 个特例分支。删除它的那个下午,系统总代码量减少了 40%。

</div>

## 重写后的结构

现在的版本没有抽象层。三种执行各自是独立的模块,共享的只有两个东西:一个日志协议,一个回滚记录的格式。隔离策略各写各的,重复了大概 80 行代码。

<div class="note decision">
<div class="note-label">ENGINEERING DECISION</div>

接受 80 行重复,换掉 14 个特例分支。重复是看得见的成本,错误抽象是看不见的成本——而看不见的成本总是在深夜结算。

</div>

## 带走的东西

判断一个抽象该不该存在,我现在只问一个问题:它消除的是重复,还是差异?重复应该被消除;差异应该被尊重——它是问题域在告诉你,这里本来就不是一件事。
