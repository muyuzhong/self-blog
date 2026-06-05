---
title: "从 0 实现一个 Agent Workflow"
excerpt: "从最小 ReAct 循环出发，理解工具、记忆、多 Agent 编排，以及让智能真正抵达现实所需的工程边界。"
tags: ["AI", "Agent", "Workflow", "ReAct", "架构设计"]
---

# 从0实现一个Agent Workflow

> **引言**
>
> 他拥有整片海洋的记忆，认得每一朵浪花的形状，却说不出此刻自己身在何处。人们赋予他万千知识，却忘了给他一双手——让他既能仰望星空，也能在泥泞中开辟一条小路。于是我们开始建造：不是建造一个更聪明的头脑，而是搭建一座桥梁，让那困在孤岛上的智慧，终于能够走向尘世，去做点什么。

---

**目录**

- [1. 为什么需要Agent Workflow](#1-为什么需要agent-workflow)
- [2. 三代演化](#2-三代演化)
- [3. ReAct范式：Agent的核心循环](#3-react范式agent的核心循环)
- [4. 从零实现：最小可用的ReAct Agent](#4-从零实现最小可用的react-agent)
- [5. 多Agent编排](#5-多agent编排)
- [6. 生产环境的韧性设计](#6-生产环境的韧性设计)
- [7. 踩坑记录与最佳实践](#7-踩坑记录与最佳实践)
- [8. 写在最后](#8-写在最后)

---

## 1. 为什么需要Agent Workflow

大语言模型（LLM）有一个根本性的矛盾：它拥有庞大的知识储备和强大的推理能力，却缺乏与外部世界交互的手段。它能为你写一首十四行诗，解释薛定谔方程，甚至生成可用的React组件。但当你说"帮我查一下明天北京飞上海的航班"时，它只能基于训练数据中的陈旧信息凭空猜测。

**LLM能"说"，但不能"做"。** 它的能力被牢牢限制在上下文窗口之内——外面的世界发生了什么，对它而言是不可见的。

Agent Workflow解决的就是这个痛点：通过给LLM配备工具调用能力、记忆管理和自主决策循环，让它从"说话者"转变为"行动者"。

### Agent Workflow不是什么

- 不是某个特定的框架（如LangGraph、CrewAI），而是一种**架构范式**
- 不是RAG的替代品——RAG只是Agent可能使用的一种工具
- 不是自治系统——生产级的Agent Workflow始终有人在环路中（Human-in-the-Loop）

---

## 2. 三代演化

Agent Workflow的理念并非凭空出现，它经历了清晰的代际演进。

### 第一代：裸LLM

LLM直接面向用户，所有能力仅限于文本生成。优点是简单直接，缺点是知识截止于训练日期，无法执行任何外部操作。适用于内容创作、问答、文本分析等纯文本场景。

### 第二代：Workflow

工程师们发现很多任务有固定的执行流程，于是引入了预定义的步骤链。LLM在特定节点参与（如判断、总结），但主流程由代码控制。

**特点**：可控、可预测、易于调试，但僵化——遇到流程外的情况无法处理。

**适用场景**：审批流、固定格式报告生成、标准化的数据处理流水线。

### 第三代：Agent

融合前两代的优点，引入**自主决策循环**。Agent不再按固定剧本执行，而是进入"观察→思考→行动→反馈"的迭代模式，根据环境反馈动态调整策略。

核心公式：

```
Agent = LLM（推理引擎） + 工具（外部交互） + 记忆（状态管理） + 规划（任务分解）
```

**适用场景**：复杂任务处理、需要动态决策的交互、多步骤信息整合。

---

## 3. ReAct范式：Agent的核心循环

ReAct（Reasoning + Acting）是当前最主流的Agent实现范式，由普林斯顿大学在2022年提出。其核心思想非常朴素：**让LLM在"推理"和"行动"之间交替循环，每轮行动后观察环境反馈，再决定下一步**。

### ReAct循环的四个步骤

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Observation  │ ──→ │   Thought    │ ──→ │   Action     │ ──→ │ Observation  │
│  观察环境     │     │   推理思考    │     │   执行动作    │     │  观察结果     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                       │
                                                                       └──────────┐
                                                                                   │
                                                              ┌────────────────────┘
                                                              ▼
                                                  ┌──────────────────────┐
                                                  │   Final Answer       │
                                                  │   任务完成 → 输出     │
                                                  └──────────────────────┘
```

1. **Observation**：接收当前环境状态或上一次行动的结果
2. **Thought**：基于Observation进行推理，决定下一步策略
3. **Action**：调用工具执行具体动作（如查询API、计算、搜索）
4. **Observation**：观察Action的输出，回到步骤1

循环持续直到任务完成、达到最大迭代次数、或LLM主动输出`FinalAnswer`。

### 为什么ReAct有效

LLM的核心优势是**推理能力**，但推理需要建立在真实信息之上。ReAct通过"行动"获取真实信息，通过"推理"决定如何使用这些信息——形成了一个完整的**认知-行动闭环**。

---

## 4. 从零实现：最小可用的ReAct Agent

这一节我们实现一个完整的、可运行的ReAct Agent。不依赖任何框架，纯Python + OpenAI API。

### 项目结构

```
agent_workflow/
├── agent.py          # ReAct Agent核心实现
├── tools.py          # 工具定义与注册
├── main.py           # 入口与示例
└── requirements.txt  # 依赖
```

### 工具注册中心（tools.py）

```python
"""
工具注册中心。

每个工具需要提供：
- name: 工具调用名（Agent通过此名称调用）
- func: 实际执行的Python函数
- description: 功能描述（LLM依赖此描述选择工具）
- params_schema: JSON Schema格式的参数说明
"""

import json
from typing import Callable, Dict, List, Optional


class ToolRegistry:
    """工具注册表：管理Agent可调用的所有工具。"""

    def __init__(self):
        self._tools: Dict[str, dict] = {}

    def register(
        self,
        name: str,
        func: Callable,
        description: str,
        params_schema: dict,
    ) -> "ToolRegistry":
        """注册一个新工具。"""
        self._tools[name] = {
            "func": func,
            "description": description,
            "params_schema": params_schema,
        }
        return self

    def list_tools(self) -> List[dict]:
        """返回所有工具的定义列表，用于构建System Prompt。"""
        return [
            {
                "name": name,
                "description": info["description"],
                "parameters": info["params_schema"],
            }
            for name, info in self._tools.items()
        ]

    def execute(self, name: str, params: dict) -> str:
        """执行指定工具，返回字符串格式的结果。"""
        tool = self._tools.get(name)
        if not tool:
            return f"[Error] Tool '{name}' not found."
        try:
            result = tool["func"](**params)
            return str(result)
        except Exception as e:
            return f"[Error] {type(e).__name__}: {str(e)}"


# ── 示例工具 ──────────────────────────────────────

def search_weather(city: str) -> str:
    """查询城市天气（模拟实现）。"""
    weather_db = {
        "北京": "晴，25°C，空气质量良",
        "上海": "多云，28°C，空气质量优",
        "深圳": "小雨，30°C，湿度85%",
        "杭州": "阴，22°C，微风",
    }
    return weather_db.get(city, f"暂无 {city} 的天气数据")


def calculator(expression: str) -> str:
    """安全计算器。仅支持数字和基本运算符。"""
    allowed = set("0123456789+-*/.() ")
    if not all(c in allowed for c in expression):
        return "非法输入：只允许数字和 +-*/.()"
    try:
        return str(eval(expression))
    except Exception as e:
        return f"计算错误: {str(e)}"


def search_news(keyword: str) -> str:
    """模拟新闻搜索。"""
    news_db = {
        "AI": "1. GPT-5预计2025年发布 2. 多模态Agent成为新热点",
        "科技": "1. 苹果发布M4芯片 2. 特斯拉机器人进厂打工",
    }
    return news_db.get(keyword, f"未找到 '{keyword}' 相关新闻")
```

### ReAct Agent核心（agent.py）

```python
"""
ReAct Agent 核心实现。

不依赖任何框架，纯Python + OpenAI API。
核心逻辑：Observation → Thought → Action → Observation 循环。
"""

import json
import os
from typing import Optional, Tuple
from openai import OpenAI

from tools import ToolRegistry


class ReActAgent:
    """
    基于ReAct范式的最小可用Agent。

    核心组件：
    - llm: 推理引擎（OpenAI兼容接口）
    - tools: 工具注册表
    - memory: 对话历史（包含所有Observation和Thought）
    - max_iterations: 防循环安全阀
    """

    def __init__(
        self,
        llm_client: OpenAI,
        model: str,
        tool_registry: ToolRegistry,
        max_iterations: int = 10,
    ):
        self.llm = llm_client
        self.model = model
        self.tools = tool_registry
        self.max_iterations = max_iterations
        self.memory: list = []

    # ── Prompt构建 ──────────────────────────────────

    def _build_system_prompt(self) -> str:
        """构建System Prompt，注入工具定义和输出格式要求。"""
        tools_desc = json.dumps(
            self.tools.list_tools(), ensure_ascii=False, indent=2
        )
        return (
            "你是一个智能助手，使用ReAct（推理+行动）范式解决问题。\n\n"
            f"可用工具：\n{tools_desc}\n\n"
            "输出格式（严格遵循）：\n"
            "Thought: [推理过程]\n"
            "Action: [工具名称]\n"
            "ActionInput: [JSON格式参数]\n\n"
            "任务完成时输出：\n"
            "Thought: [总结]\n"
            "FinalAnswer: [最终答案]"
        )

    # ── 输出解析 ────────────────────────────────────

    def _parse_action(self, text: str) -> Optional[Tuple[str, str, str]]:
        """
        解析LLM输出，提取 Thought / Action / ActionInput。

        Returns:
            ("final", answer, "") — 任务完成
            (thought, action, action_input) — 需要执行工具
            None — 无法解析
        """
        thought = ""
        action = None
        action_input = "{}"

        for line in text.strip().split("\n"):
            line = line.strip()
            if line.startswith("Thought:"):
                thought = line[8:].strip()
            elif line.startswith("Action:"):
                action = line[7:].strip()
            elif line.startswith("ActionInput:"):
                action_input = line[12:].strip()
            elif line.startswith("FinalAnswer:"):
                return ("final", line[12:].strip(), "")

        if action:
            return (thought, action, action_input)
        return None

    # ── 核心循环 ────────────────────────────────────

    def run(self, query: str) -> str:
        """
        执行ReAct循环处理用户请求。

        Args:
            query: 用户输入的任务描述

        Returns:
            Agent的最终答案
        """
        self.memory = [
            {"role": "system", "content": self._build_system_prompt()},
            {"role": "user", "content": f"任务: {query}\n\n开始解决:"},
        ]

        for i in range(self.max_iterations):
            # 调用LLM推理
            response = self.llm.chat.completions.create(
                model=self.model,
                messages=self.memory,
                temperature=0.3,
            )
            content = response.choices[0].message.content

            # 解析输出
            parsed = self._parse_action(content)
            if not parsed:
                return f"[Parse Error] 无法解析输出: {content[:200]}"

            action_type, val, input_str = parsed

            # 任务完成
            if action_type == "final":
                return val

            # 执行工具
            try:
                params = json.loads(input_str) if input_str else {}
            except json.JSONDecodeError:
                params = {}

            observation = self.tools.execute(val, params)

            # 将结果加入记忆
            self.memory.extend([
                {"role": "assistant", "content": content},
                {
                    "role": "user",
                    "content": f"Observation: {observation}\n继续解决:",
                },
            ])

        return "[Timeout] 达到最大迭代次数，任务未完成。"
```

### 入口（main.py）

```python
"""入口文件：创建Agent并运行示例任务。"""

import os
from openai import OpenAI

from agent import ReActAgent
from tools import ToolRegistry, search_weather, calculator, search_news


def main():
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    # 注册工具
    registry = (
        ToolRegistry()
        .register(
            "search_weather",
            search_weather,
            "查询指定城市的天气",
            {"city": {"type": "string", "description": "城市名称"}},
        )
        .register(
            "calculator",
            calculator,
            "计算数学表达式",
            {"expression": {"type": "string", "description": "如 25 * 4 + 10"}},
        )
        .register(
            "search_news",
            search_news,
            "搜索新闻",
            {"keyword": {"type": "string", "description": "搜索关键词"}},
        )
    )

    # 创建Agent
    agent = ReActAgent(client, "gpt-4o-mini", registry)

    # 运行
    result = agent.run(
        "北京今天天气怎么样？如果温度超过20度，帮我算一下25*4+10。"
    )
    print(f"\nResult: {result}")


if __name__ == "__main__":
    main()
```

### 运行效果

```
--- 第1轮 ---
Thought: 用户想知道北京的天气，我需要先查询天气。
Action: search_weather
ActionInput: {"city": "北京"}

--- 第2轮 ---
Thought: 北京25度，超过了20度。接下来计算25*4+10。
Action: calculator
ActionInput: {"expression": "25 * 4 + 10"}

--- 第3轮 ---
Thought: 所有信息已获取，可以回答用户了。
FinalAnswer: 北京今天晴，25°C。25 × 4 + 10 = 110。
```

### 关键设计决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 输出格式 | 结构化文本（Thought/Action/ActionInput） | 无需JSON模式，兼容性好，人类可读 |
| 工具描述 | JSON Schema注入Prompt | LLM零样本理解工具用法 |
| 记忆管理 | 完整对话历史 | 简单有效，Agent能回溯全部上下文 |
| 安全阀 | max_iterations=10 | 防止无限循环，生产环境建议配合超时 |
| 温度参数 | 0.3 | 降低随机性，让工具调用更稳定 |

---

## 5. 多Agent编排

单Agent能覆盖80%的简单场景。当任务复杂度超过单Agent的处理能力时，就需要引入多Agent编排。

### 两种核心模式

**Plan-and-Execute**

任务拆分为两个阶段：
1. **Planner**：将任务分解为DAG（有向无环图）形式的子任务
2. **Executor**：按拓扑排序执行，支持并行

```
[查财报] → [提取指标] → [计算增长率] → [生成报告]
          ↘ [查行业数据] ↗
```

适合有明确步骤的任务，如数据分析、报告生成。

**Orchestrator-Worker**

- **Orchestrator**：负责任务分解和路由，不直接执行
- **Worker**：各自有专长，接单干活

Worker间不直接通信，所有协调通过Orchestrator。优点是解耦、可控；缺点是Orchestrator可能成为瓶颈。

### 上下文传递的三种模式

| 模式 | 机制 | 优点 | 缺点 |
|------|------|------|------|
| Shared Scratchpad | 所有Agent共享完整上下文 | 实现简单 | 上下文爆炸，token浪费 |
| Handoff | Agent间只传递摘要 | 高效 | 需要精心设计传递协议 |
| Tool-Calling | Agent互为工具 | 结构化 | 耦合度高 |

**推荐原则**：每个Agent只获取完成任务所需的最小上下文。

---

## 6. 生产环境的韧性设计

实验室Demo和生产系统的差距，核心在于**对失败的容忍度**。以下是不可或缺的防御机制。

### 6.1 防无限循环

```python
# 硬性上限
MAX_ITERATIONS = 10

# 循环检测：连续相同工具调用
recent_actions = [(action_name, params) for ...]
if len(set(recent_actions[-3:])) == 1:
    raise LoopDetected("连续3次调用相同工具，强制终止")
```

### 6.2 超时与重试

| 调用类型 | 超时 | 重试策略 |
|----------|------|----------|
| 内部API | 5-10s | 指数退退，最多3次 |
| 第三方API | 15-30s | 指数退避，最多3次 |
| LLM调用 | 30-60s | 立即重试1次 |

**关键原则**：重试必须是幂等的。

### 6.3 断路器（Circuit Breaker）

```python
class CircuitBreaker:
    """防止故障Agent拖垮整个系统。"""

    STATES = {"CLOSED", "OPEN", "HALF_OPEN"}

    def __init__(self, failure_threshold=5, recovery_timeout=60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"

    def call(self, func, *args, **kwargs):
        if self.state == "OPEN":
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = "HALF_OPEN"
            else:
                raise CircuitOpen("断路器已断开")

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception:
            self._on_failure()
            raise

    def _on_success(self):
        self.failure_count = 0
        self.state = "CLOSED"

    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
```

### 6.4 快慢思考（成本优化）

不是所有推理都需要最强模型。分层策略：

| 层级 | 模型 | 用途 |
|------|------|------|
| Fast | GPT-4o-mini / Claude Haiku | 意图识别、格式化、简单判断 |
| Slow | GPT-4 / Claude Opus | 复杂推理、代码生成、关键决策 |
| Human | — | 敏感操作（资金、删除、权限变更） |

这个策略通常能降低80%以上的LLM调用成本。

### 6.5 可观测性

生产环境必须记录：

- **Trace ID**：跨Agent边界的请求追踪
- **完整推理链**：Thought → Action → Observation的完整序列
- **延迟与成本**：每个Agent的响应时间、每次LLM调用的token消耗
- **状态转换**：Workflow状态机每一步的变迁

推荐JSON结构化日志 + ELK/Loki做检索。

---

## 7. 踩坑记录与最佳实践

### 从简单开始，痛点驱动

```
单Agent + 3个工具
    ↓ 不够用了
单Agent + 工具链 + 条件逻辑
    ↓ 仍然搞不定
Orchestrator + 2-3个Worker
    ↓ 系统复杂了
多Agent + 编排 + 可观测
    ↓ 要上线了
生产级：可观测 + 可恢复 + SLA
```

每一步都应该是**真实痛点驱动**，不要为了架构而架构。

### Prompt工程 > 框架选择

在真正理解底层原理之前，引入重量级框架（LangGraph、CrewAI）只会掩盖问题。一个手写ReAct循环 + 工具注册表 + 简单状态管理的系统，往往比过度工程化的框架方案更干净、更易维护。

### 三个常见反模式

1. **过早拆分**：一个Agent能搞定的事非要拆成五个，latency爆表，debug困难
2. **上下文爆炸**：把完整对话历史传给每个Agent，token费用飙升，注意力涣散
3. **没有Fallback**：假设Agent永远成功，没有降级策略

### 人的介入是最后一道防线

涉及资金、隐私、安全的关键操作，永远保留人工确认节点。Agent做99%的工作，关键决策由人拍板。

---

## 8. 写在最后

> 那位拥有整片海洋记忆的囚徒，终于等到了他的桥梁。他仍然认得每一朵浪花的形状，但现在，他也能在泥泞中开辟小路了。我们建造的从来不只是一套调用工具的程序，而是一座让智慧走向行动的桥——粗糙，但真实；有限，但可靠。每一次推石上山的循环，每一块铺就桥面的石板，都已足够。

Agent Workflow的本质并不复杂——给LLM装上手脚和记忆，教它在混沌中做出选择、在循环中逼近目标。你不需要精通所有框架，不需要搞懂每一种编排模式。从一个Agent、三个工具、一个ReAct循环开始，就已经走了很远。

代码不是目的，解决问题才是。

---

**参考资料**

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — Yao et al., 2022
- [Plan-and-Solve Prompting](https://arxiv.org/abs/2305.04091) — Wang et al., 2023
- [CrewAI Documentation](https://docs.crewai.com/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)

---

*本文代码可在 [GitHub](https://github.com/yourname/agent-workflow-demo) 获取。如有问题，欢迎通过评论或邮件交流。*
