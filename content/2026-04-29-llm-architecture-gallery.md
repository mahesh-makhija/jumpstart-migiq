---
id: 2026-04-29-llm-architecture-gallery
url: 'https://sebastianraschka.com/llm-architecture-gallery/'
title: LLM Architecture Gallery
source_type: article
author: Sebastian Raschka
date_added: '2026-04-29'
status: inbox
tags:
  - transformer-models
  - attention-mechanisms
  - ai-architecture
local_content: true
---
Last updated: April 26, 2026
      (view changes)
      
        
        RSS
      
      If you do not see the latest changes, try a hard reload: Cmd+Shift+R on Mac or Ctrl+F5 on Windows.
    
    
      This page collects architecture figures and fact sheets from posts on
      my blog, plus selected release posts or technical reports
      when a new architecture has not been covered there yet. Click a figure to enlarge it, or use the model title to
      jump to the source article.
    
    
      If you spot an inaccurate fact sheet, mislabeled architecture, or broken link, please file an issue here:
      Architecture Gallery issue tracker.
    
    
      
        
      
      
      I am very grateful that several people asked for a way to support this project. So, the LLM Architecture Gallery is now available both as a physical poster on Redbubble
      and as a print-ready digital download on Gumroad. I ordered the Redbubble print myself to check the print quality;
      the photo shows the Medium size (26.9 x 23.4 in). The smallest labels are still readable at that size,
      but I probably would not go smaller.
      
    
    
      
    
  
      Sort by
      
    
    
      View
      
    
  
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      GPT-2 XL (1.5B)
        
        
      
    
              
            
            
              
              
                
                  Late-2019 dense baseline included here as a reference point for how much decoder stacks have changed since GPT-2.
                
                
                  
                    Scale
                    1.5B parameters
                  
                  
                    Context (tokens)
                    1,024
                  
                  
                  
                    License
                    OpenAI "Modified MIT" license
                  
                  
                    Date
                    2019-11-05
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    MHA with learned absolute positional embeddings
                  
                  
                    Layer mix
                    48 MHA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      300 KiB · High
                    
                  
                  
                    Key detail
                    Classic GPT-2 recipe with dropout, GELU, LayerNorm, and full multi-head attention.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                32.3
                              
                            
                          
                          
                            
                              
                                General
                                31.1
                              
                              
                                Scientific
                                24.8
                              
                              
                                Coding
                                33.9
                              
                              
                                Agents
                                39.4
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Llama 3 (8B)
        
        
      
    
              
            
            
              
              
                
                  Reference dense Llama stack used to contrast OLMo 2's normalization and attention choices.
                
                
                  
                    Scale
                    8B parameters
                  
                  
                    Context (tokens)
                    8,192
                  
                  
                  
                    License
                    Llama 3 Community License Agreement
                  
                  
                    Date
                    2024-04-18
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with RoPE
                  
                  
                    Layer mix
                    32 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      128 KiB · Moderate
                    
                  
                  
                    Key detail
                    Pre-norm baseline; wider than OLMo 2 at a similar scale.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Llama 3.2 (1B)
        
        
      
    
              
            
            
              
              
                
                  Small dense Llama baseline in the Qwen comparison, with fewer layers but more width.
                
                
                  
                    Scale
                    1B parameters
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    Llama Community License Agreement (variant-specific)
                  
                  
                    Date
                    2024-09-25
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA
                  
                  
                    Layer mix
                    16 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      32 KiB · Low
                    
                  
                  
                    Key detail
                    Wider architecture with more heads than Qwen3 0.6B.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                6.3
                              
                            
                          
                          
                            
                              
                                General
                                17.0
                              
                              
                                Scientific
                                7.6
                              
                              
                                Coding
                                0.6
                              
                              
                                Agents
                                0.0
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      OLMo 2 (7B)
        
        
      
    
              
            
            
              
              
                
                  Transparent dense model that keeps classic MHA and pushes normalization changes for training stability.
                
                
                  
                    Scale
                    7B parameters
                  
                  
                    Context (tokens)
                    4,096
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2024-11-25
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    MHA with QK-Norm
                  
                  
                    Layer mix
                    32 MHA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      512 KiB · Very high
                    
                  
                  
                    Key detail
                    Uses inside-residual post-norm instead of the usual pre-norm layout.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      DeepSeek V3 (671B)
        
        
      
    
              
            
            
              
              
                
                  DeepSeek's flagship template kicked off the recent wave of large open MoE models.
                
                
                  
                    Scale
                    671B total, 37B active (5.5% active)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    DeepSeek License Agreement v1.0
                  
                  
                    Date
                    2024-12-26
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA
                  
                  
                    Layer mix
                    61 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      68.6 KiB · Low
                    
                  
                  
                    Key detail
                    Uses a dense prefix plus a shared expert to keep a very large model practical at inference.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                16.5
                              
                            
                          
                          
                            
                              
                                General
                                24.9
                              
                              
                                Scientific
                                15.7
                              
                              
                                Coding
                                16.4
                              
                              
                                Agents
                                8.8
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      DeepSeek R1 (671B)
        
        
      
    
              
            
            
              
              
                
                  Reasoning-tuned DeepSeek model built on the V3 architecture rather than a new base design.
                
                
                  
                    Scale
                    671B total, 37B active (5.5% active)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2025-01-20
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA
                  
                  
                    Layer mix
                    61 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      68.6 KiB · Low
                    
                  
                  
                    Key detail
                    Architecture matches DeepSeek V3; the main change is the reasoning-oriented training recipe.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                18.8
                              
                            
                          
                          
                            
                              
                                General
                                33.1
                              
                              
                                Scientific
                                22.5
                              
                              
                                Coding
                                15.9
                              
                              
                                Agents
                                3.8
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Gemma 3 (27B)
        
        
      
    
              
            
            
              
              
                
                  Gemma's flagship text stack leans on local attention more aggressively than Gemma 2.
                
                
                  
                    Scale
                    27B parameters
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                    
                      Vocabulary
                      262,144 (~262k)
                    
                  
                  
                    License
                    Gemma Terms of Use + Gemma Prohibited Use Policy
                  
                  
                    Date
                    2025-03-11
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with QK-Norm and 5:1 sliding-window/global attention
                  
                  
                    Layer mix
                    52 sliding-window + 10 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      496 KiB · Very high
                    
                  
                  
                    Key detail
                    Built around a 27B sweet spot with heavier local attention and a large 262k multilingual vocabulary.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                10.3
                              
                            
                          
                          
                            
                              
                                General
                                15.1
                              
                              
                                Scientific
                                13.0
                              
                              
                                Coding
                                9.6
                              
                              
                                Agents
                                3.5
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      Mistral Small 3.1 (24B)
        
        
      
    
              
            
            
              
              
                
                  Fast dense 24B model that drops the sliding-window setup used in older Mistral releases.
                
                
                  
                    Scale
                    24B parameters
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-03-18
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    Standard GQA
                  
                  
                    Layer mix
                    40 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      160 KiB · Moderate
                    
                  
                  
                    Key detail
                    Latency-focused design with a smaller KV cache and fewer layers than Gemma 3 27B.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                14.5
                              
                            
                          
                          
                            
                              
                                General
                                21.9
                              
                              
                                Scientific
                                13.8
                              
                              
                                Coding
                                13.9
                              
                              
                                Agents
                                8.4
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      Llama 4 Maverick (400B)
        
        
      
    
              
            
            
              
              
                
                  Meta's large MoE follows the DeepSeek V3 playbook but with a more conventional attention stack.
                
                
                  
                    Scale
                    400B total, 17B active (4.3% active)
                  
                  
                    Context (tokens)
                    1,000,000
                  
                  
                  
                    License
                    Llama 4 Community License Agreement
                  
                  
                    Date
                    2025-04-05
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA
                  
                  
                    Layer mix
                    36 chunked + 12 full GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      192 KiB · High
                    
                  
                  
                    Key detail
                    Alternates dense and MoE blocks and uses fewer, larger experts than DeepSeek V3.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      Qwen3 (235B-A22B)
        
        
      
    
              
            
            
              
              
                
                  Large sparse Qwen variant that stays very close to DeepSeek V3 while removing the shared expert.
                
                
                  
                    Scale
                    235B total, 22B active (9.4% active)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-04-28
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with QK-Norm
                  
                  
                    Layer mix
                    94 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      188 KiB · High
                    
                  
                  
                    Key detail
                    High-capacity MoE design optimized for serving efficiency without a shared expert.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                17.0
                              
                            
                          
                          
                            
                              
                                General
                                16.9
                              
                              
                                Scientific
                                17.7
                              
                              
                                Coding
                                14.0
                              
                              
                                Agents
                                19.2
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Qwen3 (32B)
        
        
      
    
              
            
            
              
              
                
                  Large dense Qwen3 model that serves as the clearest like-for-like comparison for OLMo 3 32B.
                
                
                  
                    Scale
                    32B parameters
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-04-28
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with QK-Norm
                  
                  
                    Layer mix
                    64 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      256 KiB · High
                    
                  
                  
                    Key detail
                    Reference dense Qwen stack with QK-Norm and 8 KV heads.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                            Total score
                            
                              
                                14.5
                              
                            
                          
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Qwen3 (4B)
        
        
      
    
              
            
            
              
              
                
                  Mid-size dense Qwen3 model used here as a clean baseline against SmolLM3 and Tiny Aya.
                
                
                  
                    Scale
                    4B parameters
                  
                  
                    Context (tokens)
                    32,768
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-04-28
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with QK-Norm
                  
                  
                    Layer mix
                    36 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      144 KiB · Moderate
                    
                  
                  
                    Key detail
                    Compact Qwen3 dense stack with QK-Norm and a 151k vocabulary.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                            Total score
                            
                              
                                12.5
                              
                            
                          
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      Qwen3 (8B)
        
        
      
    
              
            
            
              
              
                
                  Dense Qwen3 baseline used here to show how little OLMo 3 changed the overall decoder recipe.
                
                
                  
                    Scale
                    8B parameters
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-04-28
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with QK-Norm
                  
                  
                    Layer mix
                    36 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      144 KiB · Moderate
                    
                  
                  
                    Key detail
                    Reference Qwen3 dense stack with QK-Norm and 8 KV heads.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                10.6
                              
                            
                          
                          
                            
                              
                                General
                                11.2
                              
                              
                                Scientific
                                12.7
                              
                              
                                Coding
                                7.1
                              
                              
                                Agents
                                11.6
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      SmolLM3 (3B)
        
        
      
    
              
            
            
              
              
                
                  Compact dense model that experiments with leaving out positional encodings in selected layers.
                
                
                  
                    Scale
                    3B parameters
                  
                  
                    Context (tokens)
                    131,072
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-06-19
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with periodic NoPE layers
                  
                  
                    Layer mix
                    36 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      72 KiB · Low
                    
                  
                  
                    Key detail
                    Every fourth layer omits RoPE to test a NoPE-style cadence.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      Kimi K2 (1T)
        
        
      
    
              
            
            
              
              
                
                  Trillion-parameter Moonshot model that essentially scales the DeepSeek V3 recipe upward.
                
                
                  
                    Scale
                    1T total, 32B active (3.2% active)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    Modified MIT License
                  
                  
                    Date
                    2025-07-10
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA
                  
                  
                    Layer mix
                    61 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      68.6 KiB · Low
                    
                  
                  
                    Key detail
                    More experts and fewer MLA heads than DeepSeek V3.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                26.3
                              
                            
                          
                          
                            
                              
                                General
                                36.3
                              
                              
                                Scientific
                                22.6
                              
                              
                                Coding
                                22.1
                              
                              
                                Agents
                                24.3
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      GLM-4.5 (355B)
        
        
      
    
              
            
            
              
              
                
                  Agent-oriented instruction/reasoning hybrid that borrows DeepSeek's dense-prefix MoE layout.
                
                
                  
                    Scale
                    355B total, 32B active (9% active)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2025-07-28
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with QK-Norm
                  
                  
                    Layer mix
                    92 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      368 KiB · Very high
                    
                  
                  
                    Key detail
                    Starts with three dense layers before MoE routing and keeps a shared expert.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                26.4
                              
                            
                          
                          
                            
                              
                                General
                                37.5
                              
                              
                                Scientific
                                25.6
                              
                              
                                Coding
                                26.3
                              
                              
                                Agents
                                16.2
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      GPT-OSS (120B)
        
        
      
    
              
            
            
              
              
                
                  Larger gpt-oss variant keeps the same alternating-attention recipe as the 20B model.
                
                
                  
                    Scale
                    117B total, 5.1B active (4.4% active)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-08-04
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with alternating sliding-window and global layers
                  
                  
                    Layer mix
                    18 sliding-window + 18 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      72 KiB · Low
                    
                  
                  
                    Key detail
                    Shared architectural template scaled up for OpenAI's flagship open-weight release.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                33.3
                              
                            
                          
                          
                            
                              
                                General
                                37.5
                              
                              
                                Scientific
                                29.1
                              
                              
                                Coding
                                28.6
                              
                              
                                Agents
                                37.9
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      GPT-OSS (20B)
        
        
      
    
              
            
            
              
              
                
                  OpenAI's smaller open-weight MoE model favors width and alternating local/global attention.
                
                
                  
                    Scale
                    21B total, 3.6B active (17.1% active)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-08-04
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with alternating sliding-window and global layers
                  
                  
                    Layer mix
                    12 sliding-window + 12 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      48 KiB · Low
                    
                  
                  
                    Key detail
                    Wider and shallower than Qwen3, with attention bias and sink mechanisms.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                24.5
                              
                            
                          
                          
                            
                              
                                General
                                29.3
                              
                              
                                Scientific
                                22.5
                              
                              
                                Coding
                                18.5
                              
                              
                                Agents
                                27.6
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      Gemma 3 (270M)
        
        
      
    
              
            
            
              
              
                
                  Tiny Gemma 3 variant that preserves the family's local-global attention recipe at a toy scale.
                
                
                  
                    Scale
                    270M parameters
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                    
                      Vocabulary
                      262,144 (~262k)
                    
                  
                  
                    License
                    Gemma Terms of Use + Gemma Prohibited Use Policy
                  
                  
                    Date
                    2025-08-14
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    Multi-query attention with QK-Norm and 5:1 sliding-window/global attention
                  
                  
                    Layer mix
                    15 sliding-window + 3 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      18 KiB · Very low
                    
                  
                  
                    Key detail
                    Keeps the Gemma 3 stack shape while shrinking down to 4 attention heads, a single KV head, and the same 262k vocabulary.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                7.7
                              
                            
                          
                          
                            
                              
                                General
                                20.1
                              
                              
                                Scientific
                                7.7
                              
                              
                                Coding
                                0.0
                              
                              
                                Agents
                                3.0
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Grok 2.5 (270B)
        
        
      
    
              
            
            
              
              
                
                  Rare production-model release that shows an older MoE style with fewer, larger experts.
                
                
                  
                    Scale
                    270B parameters
                  
                  
                    Context (tokens)
                    131,072
                  
                  
                  
                    License
                    Grok 2 Community License Agreement
                  
                  
                    Date
                    2025-08-22
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA
                  
                  
                    Layer mix
                    64 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      256 KiB · High
                    
                  
                  
                    Key detail
                    Adds an always-on SwiGLU path that effectively behaves like a shared expert.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Qwen3 Next (80B-A3B)
        
        
      
    
              
            
            
              
              
                
                  Efficiency-focused Qwen refresh that swaps standard attention for a DeltaNet-attention hybrid.
                
                
                  
                    Scale
                    80B total, 3B active (3.8% active)
                  
                  
                    Context (tokens)
                    262,144
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-09-09
                  
                  
                    Decoder type
                    Sparse hybrid
                  
                  
                    Attention
                    3:1 Gated DeltaNet and Gated Attention
                  
                  
                    Layer mix
                    12 gated attention + 36 DeltaNet
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      24 KiB · Very low
                    
                  
                  
                    Key detail
                    Adds many more experts, a shared expert, and a native 262k context.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                20.1
                              
                            
                          
                          
                            
                              
                                General
                                28.9
                              
                              
                                Scientific
                                22.1
                              
                              
                                Coding
                                15.3
                              
                              
                                Agents
                                14.2
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      MiniMax M2 (230B)
        
        
      
    
              
            
            
              
              
                
                  MiniMax's flagship returns to full attention and looks like a leaner, sparser cousin of Qwen3.
                
                
                  
                    Scale
                    230B total, 10B active (4.3% active)
                  
                  
                    Context (tokens)
                    196,608
                  
                  
                  
                    License
                    Modified MIT License
                  
                  
                    Date
                    2025-10-23
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with QK-Norm and partial RoPE
                  
                  
                    Layer mix
                    62 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      248 KiB · High
                    
                  
                  
                    Key detail
                    Uses per-layer QK-Norm and much sparser MoE routing than Qwen3.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Kimi Linear (48B-A3B)
        
        
      
    
              
            
            
              
              
                
                  Linear-attention hybrid that keeps a transformer backbone but replaces most full-attention layers.
                
                
                  
                    Scale
                    48B total, 3B active (6.3% active)
                  
                  
                    Context (tokens)
                    1,000,000
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2025-10-30
                  
                  
                    Decoder type
                    Sparse hybrid
                  
                  
                    Attention
                    3:1 Kimi Delta Attention and MLA
                  
                  
                    Layer mix
                    7 MLA + 20 Kimi Delta Attention
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      7.9 KiB · Very low
                    
                  
                  
                    Key detail
                    Uses NoPE in MLA layers and channel-wise gating for long-context efficiency.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                14.4
                              
                            
                          
                          
                            
                              
                                General
                                N/A
                              
                              
                                Scientific
                                N/A
                              
                              
                                Coding
                                14.2
                              
                              
                                Agents
                                N/A
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      OLMo 3 (32B)
        
        
      
    
              
            
            
              
              
                
                  Scaled-up OLMo 3 keeps the same block design but moves to grouped-query attention.
                
                
                  
                    Scale
                    32B parameters
                  
                  
                    Context (tokens)
                    65,536
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-11-20
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with QK-Norm and 3:1 sliding-window/global attention
                  
                  
                    Layer mix
                    48 sliding-window + 16 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      256 KiB · High
                    
                  
                  
                    Key detail
                    Keeps post-norm while scaling width and applying YaRN only on global layers.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      OLMo 3 (7B)
        
        
      
    
              
            
            
              
              
                
                  New transparent Allen AI model that keeps OLMo's post-norm flavor while modernizing context handling.
                
                
                  
                    Scale
                    7B parameters
                  
                  
                    Context (tokens)
                    65,536
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-11-20
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    MHA with QK-Norm and 3:1 sliding-window/global attention
                  
                  
                    Layer mix
                    24 sliding-window + 8 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      512 KiB · Very high
                    
                  
                  
                    Key detail
                    Retains post-norm, keeps MHA, and applies YaRN only on global layers.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                8.2
                              
                            
                          
                          
                            
                              
                                General
                                12.1
                              
                              
                                Scientific
                                12.9
                              
                              
                                Coding
                                3.4
                              
                              
                                Agents
                                4.2
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      DeepSeek V3.2 (671B)
        
        
      
    
              
            
            
              
              
                
                  DeepSeek's successor keeps the V3 template but adds sparse attention to cut long-context costs.
                
                
                  
                    Scale
                    671B total, 37B active (5.5% active)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2025-12-01
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA with DeepSeek Sparse Attention
                  
                  
                    Layer mix
                    61 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      68.6 KiB · Low
                    
                  
                  
                    Key detail
                    An evolutionary update focused on efficiency rather than a new base layout.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                32.1
                              
                            
                          
                          
                            
                              
                                General
                                29.7
                              
                              
                                Scientific
                                24.2
                              
                              
                                Coding
                                34.6
                              
                              
                                Agents
                                39.8
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Mistral Large 3 (673B)
        
        
      
    
              
            
            
              
              
                
                  Mistral's new flagship effectively adopts the DeepSeek architecture and retunes the expert sizes.
                
                
                  
                    Scale
                    673B total, 41B active (6.1% active)
                  
                  
                    Context (tokens)
                    262,144
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-12-02
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA
                  
                  
                    Layer mix
                    61 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      68.6 KiB · Low
                    
                  
                  
                    Key detail
                    Near-clone of DeepSeek V3 with larger experts, fewer routed experts, and multimodal support.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                22.8
                              
                            
                          
                          
                            
                              
                                General
                                27.8
                              
                              
                                Scientific
                                19.1
                              
                              
                                Coding
                                22.7
                              
                              
                                Agents
                                21.7
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Nemotron 3 Nano (30B-A3B)
        
        
      
    
              
            
            
              
              
                
                  NVIDIA's Nano model is the most extreme transformer-state-space hybrid in the gallery.
                
                
                  
                    Scale
                    30B total, 3B active (10% active)
                  
                  
                    Context (tokens)
                    1,000,000
                  
                  
                  
                    License
                    NVIDIA Nemotron Open Model License
                  
                  
                    Date
                    2025-12-04
                  
                  
                    Decoder type
                    Hybrid MoE
                  
                  
                    Attention
                    Mostly Mamba-2 with a few GQA layers
                  
                  
                    Layer mix
                    6 GQA + 23 Mamba-2 + 23 MoE
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      6 KiB · Very low
                    
                  
                  
                    Key detail
                    Interleaves Mamba-2 and MoE blocks, using attention only sparingly.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                13.2
                              
                            
                          
                          
                            
                              
                                General
                                16.2
                              
                              
                                Scientific
                                12.3
                              
                              
                                Coding
                                15.8
                              
                              
                                Agents
                                8.5
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Xiaomi MiMo-V2-Flash (309B)
        
        
      
    
              
            
            
              
              
                
                  Large MoE model that pushes sliding-window attention harder than most contemporaries.
                
                
                  
                    Scale
                    309B total, 15B active (4.9% active)
                  
                  
                    Context (tokens)
                    262,144
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2025-12-16
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    5:1 sliding-window/global attention
                  
                  
                    Layer mix
                    40 sliding-window + 8 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      144 KiB · Moderate
                    
                  
                  
                    Key detail
                    Uses an unusually small 128-token local window plus multi-token prediction.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                30.4
                              
                            
                          
                          
                            
                              
                                General
                                27.8
                              
                              
                                Scientific
                                20.4
                              
                              
                                Coding
                                25.8
                              
                              
                                Agents
                                47.3
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      GLM-4.7 (355B)
        
        
      
    
              
            
            
              
              
                
                  Immediate GLM predecessor that stays closer to the older GLM-4.5 style before the MLA shift.
                
                
                  
                    Scale
                    355B total, 32B active (9% active)
                  
                  
                    Context (tokens)
                    202,752
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2025-12-22
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with QK-Norm
                  
                  
                    Layer mix
                    92 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      368 KiB · Very high
                    
                  
                  
                    Key detail
                    Serves as the pre-MLA, pre-sparse-attention baseline with the same 32B active path as GLM-4.5.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                34.2
                              
                            
                          
                          
                            
                              
                                General
                                30.6
                              
                              
                                Scientific
                                19.7
                              
                              
                                Coding
                                32.0
                              
                              
                                Agents
                                54.3
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Arcee AI Trinity Large (400B)
        
        
      
    
              
            
            
              
              
                
                  Arcee's flagship blends several efficiency tricks into a DeepSeek-like coarse MoE design.
                
                
                  
                    Scale
                    400B total, 13B active (3.3% active)
                  
                  
                    Context (tokens)
                    512,000
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-01-27
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with gated attention and 3:1 sliding-window/global attention
                  
                  
                    Layer mix
                    45 sliding-window + 15 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      240 KiB · High
                    
                  
                  
                    Key detail
                    Combines QK-Norm, RoPE+NoPE, sandwich norm, and a coarse-grained MoE.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      GLM-5 (744B)
        
        
      
    
              
            
            
              
              
                
                  Huge GLM refresh that adopts both MLA and DeepSeek Sparse Attention for flagship-scale inference.
                
                
                  
                    Scale
                    744B total, 40B active (5.4% active)
                  
                  
                    Context (tokens)
                    202,752
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2026-02-11
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA with DeepSeek Sparse Attention
                  
                  
                    Layer mix
                    78 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      87.8 KiB · Moderate
                    
                  
                  
                    Key detail
                    Bigger than GLM-4.7, with more experts and fewer layers.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                40.6
                              
                            
                          
                          
                            
                              
                                General
                                42.8
                              
                              
                                Scientific
                                20.2
                              
                              
                                Coding
                                39.0
                              
                              
                                Agents
                                60.3
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Nemotron 3 Super (120B-A12B)
        
        
      
    
              
            
            
              
              
                
                  The Super variant scales up Nano and adds both latent experts and native speculative decoding support.
                
                
                  
                    Scale
                    120B total, 12B active (10% active)
                  
                  
                    Context (tokens)
                    1,000,000
                  
                  
                  
                    License
                    NVIDIA Nemotron Open Model License
                  
                  
                    Date
                    2026-03-11
                  
                  
                    Decoder type
                    Hybrid MoE
                  
                  
                    Attention
                    Mostly Mamba-2 with a few GQA layers
                  
                  
                    Layer mix
                    8 GQA + 40 Mamba-2 + 40 MoE
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      8 KiB · Very low
                    
                  
                  
                    Key detail
                    Adds latent-space MoE and shared-weight MTP for fast inference.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                36.0
                              
                            
                          
                          
                            
                              
                                General
                                42.1
                              
                              
                                Scientific
                                30.4
                              
                              
                                Coding
                                31.2
                              
                              
                                Agents
                                40.2
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Gemma 4 (31B)
        
        
      
    
              
            
            
              
              
                
                  Dense Gemma 4 scales the family to a 256K-context multimodal checkpoint without changing the core local-global recipe much.
                
                
                  
                    Scale
                    30.7B parameters
                  
                  
                    Context (tokens)
                    256,000
                  
                  
                    
                      Vocabulary
                      262,144 (~262k)
                    
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-04-02
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with QK-Norm, unified K/V on global layers, p-RoPE on global layers, and 5:1 sliding-window/global attention
                  
                  
                    Layer mix
                    50 sliding-window + 10 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      840 KiB · Very high
                    
                  
                  
                    Key detail
                    Carries Gemma's unusual pre/post-norm stack into a larger 31B dense model with 256K context.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                32.3
                              
                            
                          
                          
                            
                              
                                General
                                31.1
                              
                              
                                Scientific
                                24.8
                              
                              
                                Coding
                                33.9
                              
                              
                                Agents
                                39.4
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          
          
            
            
      Gemma 4 (26B-A4B)
        
        
      
    
              
            
            
              
              
                
                  Sparse Gemma 4 variant that keeps the local:global attention backbone while swapping dense FFNs for MoE layers.
                
                
                  
                    Scale
                    25.2B total, 3.8B active (15.1% active)
                  
                  
                    Context (tokens)
                    256,000
                  
                  
                    
                      Vocabulary
                      262,144 (~262k)
                    
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-04-02
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with QK-Norm, unified K/V on global layers, p-RoPE on global layers, and 5:1 sliding-window/global attention
                  
                  
                    Layer mix
                    25 sliding-window + 5 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      210 KiB · High
                    
                  
                  
                    Key detail
                    Uses 128 total experts with only 8 routed plus 1 shared expert active per token.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                27.1
                              
                            
                          
                          
                            
                              
                                General
                                27.1
                              
                              
                                Scientific
                                23.2
                              
                              
                                Coding
                                29.1
                              
                              
                                Agents
                                28.9
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Phi-4 (14B)
        
        
      
    
              
            
            
              
              
                
                  Microsoft's 14B dense Phi refresh stays close to Phi-3-medium but swaps its sliding-window attention for full-context GQA and a larger tokenizer.
                
                
                  
                    Scale
                    14B parameters
                  
                  
                    Context (tokens)
                    16,384
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2024-12-12
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with RoPE
                  
                  
                    Layer mix
                    40 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      200 KiB · High
                    
                  
                  
                    Key detail
                    Classic pre-norm RMSNorm stack with GQA, 40 heads, 10 KV heads, and a 100,352-token vocabulary.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                10.4
                              
                            
                          
                          
                            
                              
                                General
                                14.0
                              
                              
                                Scientific
                                16.4
                              
                              
                                Coding
                                11.2
                              
                              
                                Agents
                                0.0
                              
                            
                          
                        
                      
                    
                  
                
                
                  
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      xLSTM (7B)
        
        
      
    
              
            
            
              
              
                
                  Recurrent 7B language model that replaces self-attention with xLSTM blocks built around matrix memory.
                
                
                  
                    Scale
                    7B parameters
                  
                  
                    Context (tokens)
                    No explicit limit
                  
                  
                  
                    License
                    NXAI Community License Agreement
                  
                  
                    Date
                    2025-03-17
                  
                  
                    Decoder type
                    Recurrent
                  
                  
                    Attention
                    No self-attention; mLSTM recurrent layers with matrix memory
                  
                  
                    Layer mix
                    32 mLSTM
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      0 B · No cache
                    
                  
                  
                    Key detail
                    Stateful recurrent architecture aimed at fast long-context inference without an explicit context window.
                  
                  
                  
                  
                
                
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      GLM-4.5-Air (106B)
        
        
      
    
              
            
            
              
              
                
                  Compact GLM-4.5 companion that keeps the same agent-oriented sparse MoE recipe at a smaller serving footprint.
                
                
                  
                    Scale
                    106B total, 12B active (11.3% active)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2025-07-28
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA
                  
                  
                    Layer mix
                    46 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      184 KiB · High
                    
                  
                  
                    Key detail
                    Shrinks the GLM-4.5 layout to 46 layers and a single dense warmup layer before MoE routing.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                23.2
                              
                            
                          
                          
                            
                              
                                General
                                26.1
                              
                              
                                Scientific
                                21.7
                              
                              
                                Coding
                                23.8
                              
                              
                                Agents
                                21.0
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Qwen3 Coder Flash (30B-A3B)
        
        
      
    
              
            
            
              
              
                
                  Coding-tuned Qwen model that keeps a straightforward grouped-query MoE stack instead of the newer hybrid-attention variants.
                
                
                  
                    Scale
                    30B total, 3.3B active (11% active)
                  
                  
                    Context (tokens)
                    256,000
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2025-07-31
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA
                  
                  
                    Layer mix
                    48 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      96 KiB · Moderate
                    
                  
                  
                    Key detail
                    Uses 128 experts with 8 active per token and a native 256k context window for coding workloads.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                20.0
                              
                            
                          
                          
                            
                              
                                General
                                24.6
                              
                              
                                Scientific
                                14.9
                              
                              
                                Coding
                                19.4
                              
                              
                                Agents
                                21.1
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Kimi K2.5 (1T)
        
        
      
    
              
            
            
              
              
                
                  Native-multimodal Moonshot flagship that keeps the K2/DeepSeek-style MoE layout and pushes native context to 256k.
                
                
                  
                    Scale
                    1T total, 32B active (3.2% active)
                  
                  
                    Context (tokens)
                    256,000
                  
                  
                  
                    License
                    Modified MIT License
                  
                  
                    Date
                    2026-01-27
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA
                  
                  
                    Layer mix
                    61 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      68.6 KiB · Low
                    
                  
                  
                    Key detail
                    Keeps the 384-expert K2 backbone, but adds multimodal capabilities (not shown) and doubles the native context length.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                37.3
                              
                            
                          
                          
                            
                              
                                General
                                44.4
                              
                              
                                Scientific
                                26.0
                              
                              
                                Coding
                                25.8
                              
                              
                                Agents
                                52.8
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Step 3.5 Flash (196B)
        
        
      
    
              
            
            
              
              
                
                  Throughput-oriented MoE model that stays competitive with much larger DeepSeek-style systems.
                
                
                  
                    Scale
                    196B total, 11B active (5.6% active)
                  
                  
                    Context (tokens)
                    262,144
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-02-01
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with 3:1 sliding-window attention
                  
                  
                    Layer mix
                    36 sliding-window + 12 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      192 KiB · High
                    
                  
                  
                    Key detail
                    Uses MTP-3 during both training and inference for unusually high throughput.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                37.8
                              
                            
                          
                          
                            
                              
                                General
                                36.6
                              
                              
                                Scientific
                                30.9
                              
                              
                                Coding
                                31.6
                              
                              
                                Agents
                                52.0
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Nanbeige 4.1 (3B)
        
        
      
    
              
            
            
              
              
                
                  Small on-device oriented model that stays close to Llama 3.2 while nudging the scaling choices.
                
                
                  
                    Scale
                    3B parameters
                  
                  
                    Context (tokens)
                    262,144
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-02-10
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA
                  
                  
                    Layer mix
                    32 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      64 KiB · Low
                    
                  
                  
                    Key detail
                    Llama-like stack without tying input embeddings to the output layer.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                16.1
                              
                            
                          
                          
                            
                              
                                General
                                22.0
                              
                              
                                Scientific
                                26.2
                              
                              
                                Coding
                                8.9
                              
                              
                                Agents
                                7.2
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      MiniMax-M2.5 (230B)
        
        
      
    
              
            
            
              
              
                
                  Popular 230B coder that opts for a classic architecture instead of the newer hybrid-attention ideas.
                
                
                  
                    Scale
                    230B total, 10B active (4.3% active)
                  
                  
                    Context (tokens)
                    196,608
                  
                  
                  
                    License
                    Modified MIT License
                  
                  
                    Date
                    2026-02-12
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with QK-Norm
                  
                  
                    Layer mix
                    62 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      248 KiB · High
                    
                  
                  
                    Key detail
                    Deliberately avoids sliding-window or linear-attention hybrids while keeping a 10B active path.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Tiny Aya (3.35B)
        
        
      
    
              
            
            
              
              
                
                  Compact multilingual model from Cohere with a rare parallel transformer block.
                
                
                  
                    Scale
                    3.35B parameters
                  
                  
                    Context (tokens)
                    8,192
                  
                  
                  
                    License
                    Creative Commons Attribution-NonCommercial 4.0
                  
                  
                    Date
                    2026-02-13
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with 3:1 sliding-window attention
                  
                  
                    Layer mix
                    27 sliding-window + 9 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      72 KiB · Low
                    
                  
                  
                    Key detail
                    Runs attention and the MLP in parallel while mixing RoPE with NoPE.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Ling 2.5 (1T)
        
        
      
    
              
            
            
              
              
                
                  Trillion-parameter long-context model that swaps DeltaNet for Lightning Attention.
                
                
                  
                    Scale
                    1T total, 63B active (6.3% active)
                  
                  
                    Context (tokens)
                    256,000
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2026-02-15
                  
                  
                    Decoder type
                    Sparse hybrid
                  
                  
                    Attention
                    Lightning Attention plus MLA
                  
                  
                    Layer mix
                    10 MLA + 70 Lightning Attention
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      11.2 KiB · Very low
                    
                  
                  
                    Key detail
                    Uses a 7:1 linear-attention/MLA ratio and a much larger 63B active path.
                  
                  
                  
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Qwen3.5 (397B)
        
        
      
    
              
            
            
              
              
                
                  Mainline Qwen refresh that brings the Next-style hybrid attention into the flagship series.
                
                
                  
                    Scale
                    397B total, 17B active (4.3% active)
                  
                  
                    Context (tokens)
                    262,144
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-02-16
                  
                  
                    Decoder type
                    Sparse hybrid
                  
                  
                    Attention
                    3:1 Gated DeltaNet and Gated Attention
                  
                  
                    Layer mix
                    15 gated attention + 45 DeltaNet
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      30 KiB · Low
                    
                  
                  
                    Key detail
                    Turns the former Qwen3-Next side branch into the new core design with 512 experts and 17B active parameters.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                40.1
                              
                            
                          
                          
                            
                              
                                General
                                38.5
                              
                              
                                Scientific
                                31.1
                              
                              
                                Coding
                                37.4
                              
                              
                                Agents
                                53.3
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Sarvam (30B)
        
        
      
    
              
            
            
              
              
                
                  Reasoning-oriented Indian-language sparse MoE that keeps GQA at the smaller size.
                
                
                  
                    Scale
                    30B total, 2.4B active (8% active)
                  
                  
                    Context (tokens)
                    131,072
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-03-03
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA with QK-Norm
                  
                  
                    Layer mix
                    19 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      19 KiB · Very low
                    
                  
                  
                    Key detail
                    Large vocabulary and strong Indic language support paired with a reasoning-focused sparse MoE design.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                12.3
                              
                            
                          
                          
                            
                              
                                General
                                10.5
                              
                              
                                Scientific
                                19.4
                              
                              
                                Coding
                                7.9
                              
                              
                                Agents
                                11.5
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Sarvam (105B)
        
        
      
    
              
            
            
              
              
                
                  Larger Sarvam variant keeps the sparse MoE layout but switches from GQA to MLA.
                
                
                  
                    Scale
                    105B total, 10.3B active (9.8% active)
                  
                  
                    Context (tokens)
                    131,072
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-03-03
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA with KV LayerNorm and NoPE + RoPE
                  
                  
                    Layer mix
                    32 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      36 KiB · Low
                    
                  
                  
                    Key detail
                    Large vocabulary and strong Indic language support carried into the larger MLA-based sparse MoE variant.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                18.2
                              
                            
                          
                          
                            
                              
                                General
                                14.6
                              
                              
                                Scientific
                                23.5
                              
                              
                                Coding
                                9.8
                              
                              
                                Agents
                                24.7
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      INTELLECT-3 (106B)
        
        
      
    
              
            
            
              
              
                
                  Large-scale RL post-training of GLM-4.5-Air that keeps the compact 106B sparse MoE backbone intact.
                
                
                  
                    Scale
                    106B total, 12B active (11.3% active)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2025-11-26
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    GQA
                  
                  
                    Layer mix
                    46 GQA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      184 KiB · High
                    
                  
                  
                    Key detail
                    Keeps the GLM-4.5-Air architecture unchanged and shifts the capability profile through SFT plus large-scale RL.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                22.2
                              
                            
                          
                          
                            
                              
                                General
                                24.6
                              
                              
                                Scientific
                                25.1
                              
                              
                                Coding
                                19.1
                              
                              
                                Agents
                                19.8
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Mistral Small 4 (119B)
        
        
      
    
              
            
            
              
              
                
                  Multimodal Mistral Small refresh that jumps from the older dense 24B stack to an MLA-based sparse MoE design.
                
                
                  
                    Scale
                    119B total, 6.63B active (5.6% active)
                  
                  
                    Context (tokens)
                    256,000
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-03-16
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA
                  
                  
                    Layer mix
                    36 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      22.5 KiB · Very low
                    
                  
                  
                    Key detail
                    Uses 128 experts with 4 routed plus 1 shared expert active per token while unifying instruct, reasoning, and vision.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                26.9
                              
                            
                          
                          
                            
                              
                                General
                                37.1
                              
                              
                                Scientific
                                24.1
                              
                              
                                Coding
                                24.3
                              
                              
                                Agents
                                22.4
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Nemotron 3 Nano (4B)
        
        
      
    
              
            
            
              
              
                
                  Compact on-device hybrid that compresses Nemotron Nano 9B v2 into a mostly Mamba-2 stack with only four attention layers.
                
                
                  
                    Scale
                    4B parameters
                  
                  
                    Context (tokens)
                    262,144
                  
                  
                  
                    License
                    NVIDIA Nemotron Open Model License
                  
                  
                    Date
                    2026-03-16
                  
                  
                    Decoder type
                    Dense hybrid
                  
                  
                    Attention
                    GQA with only 4 attention layers
                  
                  
                    Layer mix
                    4 GQA + 21 Mamba-2 + 17 FFN
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      16 KiB · Very low
                    
                  
                  
                    Key detail
                    Uses a 42-layer stack with 21 Mamba-2 blocks, 17 ReLU² FFNs, and just 4 GQA layers.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                14.7
                              
                            
                          
                          
                            
                              
                                General
                                23.7
                              
                              
                                Scientific
                                15.2
                              
                              
                                Coding
                                10.0
                              
                              
                                Agents
                                9.8
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Gemma 4 (E2B)
        
        
      
    
              
            
            
              
              
                
                  Smallest Gemma 4 edge model keeps the family's hybrid attention stack and adds native audio on a phone-scale multimodal footprint. Uses per-layer embeddings, which add small layer-specific token vectors without scaling the full compute path, so its compute footprint is closer to 2.3B than a full 5.1B dense model.
                
                
                  
                    Scale
                    5.1B parameters (2.3B effective)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                    
                      Vocabulary
                      262,144 (~262k)
                    
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-04-02
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    Multi-query attention with QK-Norm, unified K/V on global layers, p-RoPE on global layers, and 4:1 sliding-window/global attention
                  
                  
                    Layer mix
                    28 sliding-window + 7 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      35 KiB · Low
                    
                  
                  
                    Key detail
                    Uses a double-wide GELU MLP plus a single KV head to stay light enough for offline edge deployments.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                12.1
                              
                            
                          
                          
                            
                              
                                General
                                20.3
                              
                              
                                Scientific
                                12.4
                              
                              
                                Coding
                                8.3
                              
                              
                                Agents
                                7.4
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Gemma 4 (E4B)
        
        
      
    
              
            
            
              
              
                
                  Larger Gemma 4 edge variant keeps the same multimodal hybrid recipe but doubles width and KV heads for a stronger 128K mobile checkpoint. Uses per-layer embeddings, which add small layer-specific token vectors without scaling the full compute path, so its compute footprint is closer to 4.5B than a full 8B dense model.
                
                
                  
                    Scale
                    8B parameters (4.5B effective)
                  
                  
                    Context (tokens)
                    128,000
                  
                  
                    
                      Vocabulary
                      262,144 (~262k)
                    
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-04-02
                  
                  
                    Decoder type
                    Dense
                  
                  
                    Attention
                    GQA with QK-Norm, unified K/V on global layers, p-RoPE on global layers, and 5:1 sliding-window/global attention
                  
                  
                    Layer mix
                    35 sliding-window + 7 global
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      84 KiB · Moderate
                    
                  
                  
                    Key detail
                    Steps up to a 42-layer stack with 2 KV heads while keeping the same edge-oriented local/global template.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                14.8
                              
                            
                          
                          
                            
                              
                                General
                                28.1
                              
                              
                                Scientific
                                16.2
                              
                              
                                Coding
                                6.4
                              
                              
                                Agents
                                8.7
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      GLM-5.1 (744B)
        
        
      
    
              
            
            
              
              
                
                  Post-trained GLM refresh that keeps the GLM-5 backbone intact but targets stronger long-horizon agentic coding.
                
                
                  
                    Scale
                    744B total, 40B active (5.4% active)
                  
                  
                    Context (tokens)
                    202,752
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2026-04-07
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA with DeepSeek Sparse Attention
                  
                  
                    Layer mix
                    78 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      87.8 KiB · Moderate
                    
                  
                  
                    Key detail
                    Architecture stays aligned with GLM-5; the main shift is the post-training recipe for agentic engineering tasks.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                          
                          
                          
                          
                          
                          
                            Total score
                            
                              
                                51.4
                              
                            
                          
                          
                            
                              
                                General
                                58.4
                              
                              
                                Scientific
                                36.9
                              
                              
                                Coding
                                43.4
                              
                              
                                Agents
                                67.0
                              
                            
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Qwen3.6 (35B-A3B)
        
        
      
    
              
            
            
              
              
                
                  Compact Qwen3.6 open-weight MoE that keeps the Qwen3.5 hybrid Gated DeltaNet/Gated Attention recipe while activating only about 3B parameters.
                
                
                  
                    Scale
                    35B total, 3B active (8.6% active)
                  
                  
                    Context (tokens)
                    262,144
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-04-15
                  
                  
                    Decoder type
                    Sparse hybrid
                  
                  
                    Attention
                    3:1 Gated DeltaNet and Gated Attention
                  
                  
                    Layer mix
                    10 gated attention + 30 DeltaNet
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      20 KiB · Very low
                    
                  
                  
                    Key detail
                    Uses 256 experts with 8 routed plus 1 shared expert active inside a 40-layer hybrid stack.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                            Total score
                            
                              
                                43
                              
                            
                          
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Kimi K2.6 (1T)
        
        
      
    
              
            
            
              
              
                
                  Native-multimodal K2.5 successor that keeps the same 1T sparse MoE backbone while targeting stronger long-horizon coding, design, and agent orchestration.
                
                
                  
                    Scale
                    1T total, 32B active (3.2% active)
                  
                  
                    Context (tokens)
                    256,000
                  
                  
                  
                    License
                    Modified MIT License
                  
                  
                    Date
                    2026-04-20
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA
                  
                  
                    Layer mix
                    61 MLA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      68.6 KiB · Low
                    
                  
                  
                    Key detail
                    Uses the same text architecture as Kimi K2.5, with the main change coming from the multimodal and agentic training recipe.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                            Total score
                            
                              
                                54
                              
                            
                          
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      Qwen3.6 (27B)
        
        
      
    
              
            
            
              
              
                
                  Dense Qwen3.6 model that keeps the Qwen3.5-style Gated DeltaNet/Gated Attention hybrid stack while replacing MoE blocks with dense FFNs.
                
                
                  
                    Scale
                    27B parameters
                  
                  
                    Context (tokens)
                    262,144
                  
                  
                  
                    License
                    Apache License 2.0
                  
                  
                    Date
                    2026-04-22
                  
                  
                    Decoder type
                    Dense hybrid
                  
                  
                    Attention
                    3:1 Gated DeltaNet and Gated Attention
                  
                  
                    Layer mix
                    16 gated attention + 48 DeltaNet
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      64 KiB · Low
                    
                  
                  
                    Key detail
                    Uses a 64-layer dense hybrid layout with 48 DeltaNet layers and 16 full-attention layers.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                            Total score
                            
                              
                                46
                              
                            
                          
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      DeepSeek V4-Flash (284B)
        
        
      
    
              
            
            
              
              
                
                  DeepSeek's efficient V4 preview keeps the million-token architecture while reducing the MoE scale to 284B parameters and 13B active parameters.
                
                
                  
                    Scale
                    284B total, 13B active (4.6% active)
                  
                  
                    Context (tokens)
                    1,048,576
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2026-04-24
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA-style CSA/HCA with mHC
                  
                  
                    Layer mix
                    43 CSA/HCA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      5.4 KiB · Very low
                    
                  
                  
                    Key detail
                    Uses 256 experts, 6 routed plus 1 shared expert per token, hash-based routing in the first 3 layers, and the same compressed attention design as the larger V4-Pro.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                            Total score
                            
                              
                                47
                              
                            
                          
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
      
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
            
          
          
          
            
            
      DeepSeek V4-Pro (1.6T)
        
        
      
    
              
            
            
              
              
                
                  DeepSeek's flagship V4 preview scales to 1.6T parameters and introduces compressed sparse attention plus manifold-constrained hyper-connections for million-token contexts.
                
                
                  
                    Scale
                    1.6T total, 49B active (3.1% active)
                  
                  
                    Context (tokens)
                    1,048,576
                  
                  
                  
                    License
                    MIT License
                  
                  
                    Date
                    2026-04-24
                  
                  
                    Decoder type
                    Sparse MoE
                  
                  
                    Attention
                    MLA-style CSA/HCA with mHC
                  
                  
                    Layer mix
                    61 CSA/HCA
                  
                  
                    
                      KV cache / token (bf16)
                      
                        info
                      
                    
                    
                      7.7 KiB · Very low
                    
                  
                  
                    Key detail
                    Uses 384 experts, 6 routed plus 1 shared expert per token, hash-based routing in the first 3 layers, and compressed attention caches for long-context efficiency.
                  
                  
                  
                  
                    
                      
                        AA Intelligence Index
                        
                          info
                        
                      
                      
                        
                        
                          
                            Total score
                            
                              
                                52
                              
                            
                          
                          
                        
                      
                    
                  
                
                
                
              
            
          
        
      
    
    
    
      
        Source article
      
          
            The Big LLM Architecture Comparison
          
        
        
        
      
    
        
          The original comparison article that walks through the architecture figures in context and explains the key
          design choices across dense, MoE, MLA, and hybrid decoder families.
        
        
          Read article
        
      
      
        
      
    

    
      
        Source article
      
          
            From GPT-2 to gpt-oss: Analyzing the Architectural Advances
          
        
        
        
      
    
        
          A focused follow-up article on the GPT-2 to gpt-oss shift, covering the architectural changes around
          RoPE, SwiGLU, MoE, GQA, sliding-window attention, and RMSNorm.
        
        
          Read article
        
      
      
        
      
    

    
      
        Source article
      
          
            From DeepSeek V3 to V3.2: Architecture, Sparse Attention, and RL Updates
          
        
        
        
      
    
        
          A DeepSeek-focused follow-up covering the V3.2 architecture updates, sparse attention changes, and the
          broader RL-related developments around the release.
        
        
          Read article
        
      
      
        
      
    

    
      
        Source article
      
          
            A Dream of Spring for Open-Weight LLMs
          
        
        
        
      
    
        
          Follow-up article covering the additional open-weight architecture releases from early 2026, including the
          newer MiniMax, Qwen, Ling, and Sarvam families.
        
        
          Read article
