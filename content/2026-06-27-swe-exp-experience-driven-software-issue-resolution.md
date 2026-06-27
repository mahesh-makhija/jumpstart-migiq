---
id: 2026-06-27-swe-exp-experience-driven-software-issue-resolution
url: 'https://arxiv.org/abs/2507.23361'
title: 'SWE-Exp: Experience-Driven Software Issue Resolution'
source_type: paper
date_added: '2026-06-27'
status: inbox
tags:
  - automated-issue-resolution
  - multi-agent-systems
  - ai-accelerated-output
  - continual-learning-systems
  - experience-driven-issue-resolution
local_content: true
---
Authors:Silin Chen, Shaoxin Lin, Yuling Shi, Heng Lian, Xiaodong Gu, Longfei Yun, Dong Chen, Lin Cao, Jiyang Liu, Nu Xia, Qianxiang Wang            
    View PDF
    HTML (experimental)
            Abstract:Recent advances in large language model (LLM) agents have shown remarkable progress in software issue resolution, leveraging advanced techniques such as multi-agent collaboration and Monte Carlo Tree Search (MCTS). However, current agents act as memoryless explorers - treating each problem separately without retaining or reusing knowledge from previous repair experiences. This leads to redundant exploration of failed trajectories and missed chances to adapt successful issue resolution methods to similar problems. To address this problem, we introduce SWE-Exp, an experience-enhanced approach that distills concise and actionable experience from prior agent trajectories, enabling continuous learning across issues. Our method introduces a multi-faceted experience bank that captures both successful and failed repair attempts. Specifically, it extracts reusable issue resolution knowledge at different levels - from high-level problem comprehension to specific code changes. Experiments show that SWE-Exp achieves a Pass@1 resolution rate of 73.0% on SWE-Bench Verified using the state-of-the-art LLM Claude 4 Sonnet, significantly outperforming prior results under other agent frameworks. Our approach establishes a new paradigm in which automated software engineering agents systematically accumulate and leverage repair expertise, fundamentally shifting from trial-and-error exploration to strategic, experience-driven issue resolution.
    

    
    
  
      Submission history From: Yuling Shi [view email]                  [v1]
        Thu, 31 Jul 2025 09:13:42 UTC (735 KB)
    [v2]
        Mon, 2 Feb 2026 08:45:09 UTC (748 KB)
