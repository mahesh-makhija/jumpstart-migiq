---
id: 2026-06-06-streaming-communication-in-multi-agent-reasoning
url: 'https://arxiv.org/abs/2606.05158'
title: Streaming Communication in Multi-Agent Reasoning
source_type: paper
date_added: '2026-06-06'
status: inbox
tags:
  - multi-agent-systems
  - reasoning-optimization
  - streaming-communication
local_content: true
---
View PDF
            Abstract:Multi-agent reasoning systems adopt a "generate-then-transfer" paradigm that forces end-to-end latency to scale linearly with pipeline depth. We introduce StreamMA, a multi-agent reasoning system that streams each reasoning step to downstream agents as soon as it is generated, pipelining adjacent agents and thus reducing latency. Surprisingly, this pipelining also improves effectiveness: because multi-step reasoning quality is non-uniform and early steps are more reliable than later ones, working with these reliable early steps instead of the full chain prevents error-prone late steps from misleading downstream agents. We formalize both advantages with the first closed-form joint analysis of stream, serial, and single protocols, deriving the effectiveness ordering, speedup upper bound, and cost ratio. Across eight reasoning benchmarks spanning mathematics, science, and code, two frontier LLMs (Claude Opus 4.6 and GPT-5.4), and three topologies (Chain, Tree, Graph), StreamMA outperforms both baselines (avg. +7.3 pp, max +22.4 pp on HMMT 2026; Claude Opus 4.6-high). Beyond these contributions, we discover a "step-level scaling law": increasing per-agent steps consistently improves both effectiveness and efficiency, a new scaling dimension orthogonal to and composable with agent-count scaling.
    

    
    
  
      Submission history From: Zhen Yang [view email]          [v1]
        Wed, 3 Jun 2026 17:57:04 UTC (139 KB)
