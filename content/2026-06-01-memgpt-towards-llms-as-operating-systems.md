---
id: 2026-06-01-memgpt-towards-llms-as-operating-systems
url: 'https://arxiv.org/abs/2310.08560'
title: 'MemGPT: Towards LLMs as Operating Systems'
source_type: paper
date_added: '2026-06-01'
status: inbox
tags:
  - ai-architecture
  - multimodal-ai-systems
  - transformer-models
  - memory-management-in-llms
local_content: true
---
View PDF
            Abstract:Large language models (LLMs) have revolutionized AI, but are constrained by limited context windows, hindering their utility in tasks like extended conversations and document analysis. To enable using context beyond limited context windows, we propose virtual context management, a technique drawing inspiration from hierarchical memory systems in traditional operating systems that provide the appearance of large memory resources through data movement between fast and slow memory. Using this technique, we introduce MemGPT (Memory-GPT), a system that intelligently manages different memory tiers in order to effectively provide extended context within the LLM's limited context window, and utilizes interrupts to manage control flow between itself and the user. We evaluate our OS-inspired design in two domains where the limited context windows of modern LLMs severely handicaps their performance: document analysis, where MemGPT is able to analyze large documents that far exceed the underlying LLM's context window, and multi-session chat, where MemGPT can create conversational agents that remember, reflect, and evolve dynamically through long-term interactions with their users. We release MemGPT code and data for our experiments at this https URL.
    

    
    
  
      Submission history From: Charles Packer [view email]                  [v1]
        Thu, 12 Oct 2023 17:51:32 UTC (391 KB)
    [v2]
        Mon, 12 Feb 2024 18:59:46 UTC (419 KB)
