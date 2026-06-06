---
id: 2026-06-06-thoughtfold-folding-reasoning-chains-via-introspective-prefe
url: 'https://arxiv.org/abs/2606.03503'
title: 'ThoughtFold: Folding Reasoning Chains via Introspective Preference Learning'
source_type: paper
date_added: '2026-06-06'
status: inbox
tags:
  - transformer-models
  - ai-architecture
  - ai-accelerated-output
  - introspective-preference-learning
  - reasoning-optimization
local_content: true
---
View PDF
            Abstract:Large Reasoning Models (LRMs) have achieved remarkable progress thanks to Reinforcement Learning with Verifiable Rewards (RLVR) on Chain-of-Thoughts (CoTs). However, since long CoTs naturally contain trial and errors and mainstream RLVR approaches choose outcome-correct CoT trajectories for memorization, the redundant explorations in long CoTs are inevitably reinforced, which results in the over-thinking issues of LRMs. Previous attempts to resolve this issue mainly give more advantage to shorter trajectories, yet their learning signals are still outcome-based and cannot reduce the memorization of redundant explorations in long CoTs. Therefore, we propose ThoughtFold, a framework that leverages fine-grained preference learning to mitigate redundant explorations for efficient reasoning. ThoughtFold employs an introspective strategy to identify redundancy within each correct trajectory, which yields a spectrum of candidate sub-trajectories. Leveraging this spectrum, we introduce a masked preference optimization objective that explicitly penalizes redundant explorations and encourages the model to directly bridge essential reasoning segments, effectively folding its reasoning chains into a more concise path. Extensive experiments show that ThoughtFold significantly enhances efficiency. It reduces the token usage of DeepSeek-R1-Distill-Qwen-7B by approximately 56% while maintaining state-of-the-art accuracy.
    

    
    
  
      Submission history From: Ziyan Liu [view email]          [v1]
        Tue, 2 Jun 2026 11:21:27 UTC (692 KB)
