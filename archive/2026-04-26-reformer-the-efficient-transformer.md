---
id: 2026-04-26-reformer-the-efficient-transformer
url: 'https://arxiv.org/pdf/2001.04451'
title: 'Reformer: The Efficient Transformer'
source_type: paper
date_added: '2026-04-26'
status: inbox
tags:
  - transformer-models
  - attention-mechanisms
  - efficient-transformers
local_content: true
---
View PDF
            Abstract:Large Transformer models routinely achieve state-of-the-art results on a number of tasks but training these models can be prohibitively costly, especially on long sequences. We introduce two techniques to improve the efficiency of Transformers. For one, we replace dot-product attention by one that uses locality-sensitive hashing, changing its complexity from O($L^2$) to O($L\log L$), where $L$ is the length of the sequence. Furthermore, we use reversible residual layers instead of the standard residuals, which allows storing activations only once in the training process instead of $N$ times, where $N$ is the number of layers. The resulting model, the Reformer, performs on par with Transformer models while being much more memory-efficient and much faster on long sequences.
    

    
    
  
      Submission history From: Nikita Kitaev [view email]                  [v1]
        Mon, 13 Jan 2020 18:38:28 UTC (421 KB)
    [v2]
        Tue, 18 Feb 2020 16:01:18 UTC (423 KB)
