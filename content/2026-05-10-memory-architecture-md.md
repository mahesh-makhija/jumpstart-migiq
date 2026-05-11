---
id: 2026-05-10-memory-architecture-md
url: 'https://claude.ai/public/artifacts/0b7ea7eb-4091-406c-b930-ac2a019e2e97'
title: memory-architecture.md
source_type: article
date_added: '2026-05-10'
status: inbox
tags:
  - ai-architecture
  - ai-observability
  - enterprise-agent-memory-architecture
local_content: true
---
Enterprise Agent Memory Architecture
Complete Design Reference

1. Architecture Overview
The memory architecture operates across three time horizons, each with distinct storage, ownership, and consumers.
┌─────────────────────────────────────────────────────────────────┐
│                    SHORT-TERM (Session)                         │
│  Within a single conversation. Dies on session end / TTL.      │
│  Owner: Framework (ADK) or Developer (LangGraph)               │
│  Store: Postgres (DatabaseSessionService)                      │
│  Consumer: The agent, for the current conversation             │
├─────────────────────────────────────────────────────────────────┤
│                 CONTEXT MANAGEMENT (Assembly)                   │
│  Not a store. A compilation step before each LLM call.         │
│  Assembles: session state + RAG output + C360 context +        │
│  skill summaries + progressive disclosure                      │
│  Owner: Orchestrator / master agent                            │
│  Consumer: The LLM, for the next turn                          │
├─────────────────────────────────────────────────────────────────┤
│                   LONG-TERM (Signals)                           │
│  Across sessions, across channels, across time.                │
│  Owner: Conversation Miner pipeline                            │
│  Store: Signals Store (Postgres), C360 (warehouse), Feature    │
│  Store (ML training)                                           │
│  Consumer: NBO engine, context compiler, ML training pipeline  │
└─────────────────────────────────────────────────────────────────┘
Alongside all three layers, the observability layer (ClickHouse / Langfuse) captures operational telemetry — latency, token counts, model config, span hierarchies — for debugging, optimization, and audit. It is a parallel recording of what happened, not a memory system the agent reads from.

2. Short-Term Memory: The Session
2.1 What It Contains
The session holds everything needed for the current conversation: message history, tool call inputs and outputs, and curated state variables.
Two sub-components with different ownership models:
Session Events (history): The chronological record of every message, tool call, and tool response within the conversation. In ADK, the framework (Runner) captures these automatically — the developer has no control over what gets recorded. In LangGraph, the developer defines the state schema and only what's in the schema gets persisted via the checkpointer.
Session State (curated scratchpad): Structured key-value data the developer explicitly writes for use in future turns. In ADK, this is managed via state_delta on events, output_key on agents, or ToolContext writes inside tool functions. In LangGraph, this is the developer-defined TypedDict with reducer functions.
The critical design constraint in ADK: never mutate session.state directly. All state changes must flow through append_event() with a state_delta, ensuring the state is a materialized view of the event log (event-sourcing pattern).
2.2 The Event Object (ADK)
An Event is not a turn. It is the atomic unit of session history. A single user turn can generate 5-12 events:
Turn (invocation_id: "inv_001")
├── Event: author="user"         content="book me a flight to BLR"
├── Event: author="travel_agent" content=FunctionCall(search_flights)
├── Event: author="tool"         content=FunctionResponse(results)
├── Event: author="travel_agent" content=FunctionCall(check_loyalty)
│                                actions.state_delta={"destination":"BLR"}
├── Event: author="tool"         content=FunctionResponse(tier_info)
└── Event: author="travel_agent" content="I found 3 flights..."
                                 is_final_response()=True
All events sharing an invocation_id belong to one turn. The event.id is unique per event. Events are immutable records — you classify them by inspecting content via helper methods (get_function_calls(), get_function_responses(), is_final_response()).
2.3 Storage
Postgres is the recommended default for enterprise deployments. Reasons: compliance teams already trust it, supports India data residency (RBI guidelines), self-managed infra with standard backup/recovery, and pgvector extension available if semantic search is needed later.
No Redis needed unless concurrent session count creates a read latency bottleneck (thousands of simultaneous sessions requiring sub-5ms reads). No separate ClickHouse needed unless analytical queries across millions of sessions time out on Postgres.
Start with one store. Split when you hit a specific performance wall.
2.4 Framework Comparison
DimensionADKLangGraphSession eventsFramework auto-captures allDeveloper defines state schemaSession stateDeveloper-controlled via state_deltaDeveloper-defined TypedDict + reducersPersistenceDatabaseSessionService (Postgres)Checkpointer (Postgres, Redis)ObservabilityBuilt-in OpenTelemetry, auto-emittedLangSmith (separate product, opt-in)Time travelSession rewind via event historyCheckpoint-based replayEnterprise safetySafer — capture-everything default, audit trail embedded in runtimeMore control — but developer can forget to capture critical data
ADK's model (framework owns session) is safer for regulated financial services because the failure mode is benign (stored too much). LangGraph's model (developer owns schema) gives more control but the failure mode is dangerous (forgot to capture something needed for audit).

3. Observability Layer
Runs parallel to the session. Captures operational telemetry, not conversational content.
DimensionSessionObservability (ClickHouse)Who writesApp logic / frameworkInstrumentation middleware (OTel)What's storedMessages, tool calls, stateLatency, tokens, cost, model config, spansMutable?Yes (state overwrites)No (append-only, immutable)LifetimeMinutes (TTL)Weeks to monthsAudienceThe bot at runtimeEngineers, PMs, auditors post-hocQuestion answered"What does the bot need right now?""What actually happened mechanically?"
In ADK, session events and OTel traces are two projections of the same event stream, each enriched with different metadata. In LangGraph, they are cleanly separated — session state in the checkpointer, traces in LangSmith.

4. Context Management
Not a store — an assembly step. The master-agent-as-context-compiler pattern: before each LLM call, the orchestrator compiles the context window from multiple sources.
Sources assembled:

Session history (possibly compacted / summarized for long conversations)
Session state (curated variables from state_delta)
Customer context from C360 or signals store
RAG output from knowledge bases (progressive disclosure — cheap summaries always loaded, expensive details loaded on demand)
Skill summaries and tool descriptions
Channel-specific instructions

Key design principle: Two-tier context loading. Cheap, small context (customer name, product holdings, journey stage) is always in the prompt. Expensive, large context (full interaction history, detailed product specs) is loaded progressively only when the agent's reasoning requires it.
The context compiler is the architectural decision point. What goes into the context window determines what the agent can reason about. Everything outside it is invisible to the LLM regardless of what's in storage.

5. Long-Term Memory: The Conversation Miner Pipeline
5.1 Design Philosophy
For enterprise cross-sell use cases (Tata Capital), the long-term memory architecture is purpose-built around signals, not general-purpose memories. The distinction: a memory says "customer's EMI is 45,000." A signal says "high-intent home loan BT candidate, current EMI 45,000 with HDFC, wants EMI reduction, dual-income household, trigger within 30 days."
Signals are opinionated, action-oriented, and designed for consumption by the NBO engine.
5.2 Three-Layer Pipeline
CAPTURE ──→ HARVEST ──→ SERVE
Capture: Every channel emits interaction data. No LLM in this layer — it is pure normalization and routing.
Harvest: The Conversation Miner extracts structured signals from full conversations. This is where the memory LLM runs.
Serve: The signals store provides real-time context for inbound interactions, feeds the NBO engine for offer scoring, and queues data for C360 and ML training.
5.3 Capture Layer (Channel Adapters)
Each channel produces interaction data in its own format. Channel adapters normalize into a canonical interaction event and publish to the event bus (Kafka).
No LLM in this layer. The channel's own LLM (e.g., Sarvam's voice bot) already ran during the conversation and produced structured metadata (intent, entities, disposition). The adapter packages both the structured metadata and the raw content (transcript, chat log) into the canonical envelope.
Voice Bot (Sarvam)  ──→ Adapter ──→ ┐
Call Center (SFDC)  ──→ Adapter ──→ │
WhatsApp (Moengage) ──→ Adapter ──→ ├──→ Kafka (customer-partitioned)
Push Notifications  ──→ Adapter ──→ │
Digital (In-App)    ──→ Adapter ──→ ┘
Canonical interaction event structure:
json{
  "customer_id": "TC_CUST_12345",
  "journey_id": "j_12345_hlbt_001",
  "channel": "voice_bot",
  "actor": "sarvam_sales_bot",
  "actor_type": "ai_agent",
  "timestamp": "2026-05-10T14:30:00+05:30",
  "session_id": "voice_session_789",
  "structured_metadata": {
    "intent": "home_loan_bt_inquiry",
    "disposition": "interested_callback",
    "product_discussed": "home_loan_bt",
    "call_duration_seconds": 180
  },
  "raw_content": "[full transcript or chat log]"
}
Journey stitching is upstream, not inferred. For outbound interactions, Moengage (the campaign controller) tags the journey_id at origination. For inbound interactions, the IVR or bot identifies the customer, looks up open journeys, and tags the conversation before it begins. The Conversation Miner never needs to figure out journey membership.
WhatsApp session boundaries: WhatsApp lacks a clean session-end event. Use a timeout-based boundary (15-20 minutes of silence = session end). Run the miner on each quiet period with deduplication — if the same signal is extracted from two windows of the same conversation, the signals store deduplicates on insert.
5.4 Harvest Layer (Conversation Miner)
The miner triggers on session-end event and runs in under 10 seconds. It produces two output streams from a single LLM pass:
Output 1 — Cross-sell signals (for immediate action):
json{
  "customer_id": "TC_CUST_12345",
  "journey_id": "j_12345_hlbt_001",
  "source_conversation": "voice_session_789",
  "signals": [
    {
      "product": "home_loan_bt",
      "intent_strength": "high",
      "evidence": "explicitly asked about lower rates",
      "objections": ["processing_fees"],
      "timing_cue": "wants to decide before June",
      "recommended_channel": "relationship_manager_call",
      "recommended_next_action": "send rate comparison"
    }
  ],
  "suppression_signals": [
    {
      "product": "personal_loan",
      "reason": "customer explicitly said stop calling about PLs",
      "hard_block": true
    }
  ]
}
Output 2 — Training artifacts (for ML model improvement):
json{
  "conversation_id": "voice_session_789",
  "journey_id": "j_12345_hlbt_001",
  "labels": {
    "product_discussed": "home_loan_bt",
    "intent_expressed": true,
    "intent_strength": 0.85,
    "objections_raised": ["processing_fees"],
    "sentiment_trajectory": ["neutral", "interested", "hesitant"],
    "call_outcome": "callback_requested"
  },
  "features": {
    "conversation_turns": 14,
    "customer_initiated": false,
    "competitor_mentioned": "HDFC",
    "price_sensitivity_signals": 2,
    "call_duration_seconds": 180
  },
  "text_features": {
    "objection_verbatims": ["the processing fees are too high"],
    "rebuttal_that_worked": "waiver for existing customers"
  }
}
Extraction optimization: The structured metadata from the channel's own LLM (Sarvam's intent, disposition, product discussed) bypasses the extraction LLM — it goes straight to the signals store as pre-extracted facts. The miner LLM only processes the raw transcript content for signals the channel didn't already structure (life events, timing cues, competitor mentions, objection details).
Suppression signals: When a customer says "stop calling me about X," this is not a cross-sell signal — it's a hard constraint that must flow to Moengage as a suppression rule, overriding the NBO engine.
5.5 Serve Layer (Three Consumers)
Conversation Miner Output
         │
         ├──→ Signals Store (Postgres) ──→ NBO engine reads for offer scoring
         │                              ──→ Context compiler reads for inbound calls
         │
         ├──→ C360 (overnight ETL) ──→ Enriches customer warehouse
         │
         └──→ Feature Store (batch) ──→ ML training pipeline
Signals Store: A dedicated Postgres table indexed by customer_id and journey_id. This is the real-time queryable layer — not the offer mart (which stays focused on offers) and not C360 (which is batch). The signals store serves two read patterns: "what should I offer this customer?" (NBO engine) and "what happened in this customer's recent conversations?" (context compiler for inbound calls).
C360: Picks up signals in the overnight ETL. Signals should land in a separate "derived insights" layer within C360, clearly marked as AI-generated, not commingled with verified bureau or system-of-record data.
Feature Store: Holds training artifacts indexed by customer_id, product, and journey_id. Training artifacts sit unlabeled until conversion outcomes arrive from LOS (SFDC/Jocata). Outcome join on journey_id completes the labeled training record.

6. ML Training Data Pipeline
6.1 The Outcome Join
The training artifact from the Conversation Miner doesn't know the final outcome. Conversion data arrives days or weeks later from LOS.
Training Artifact (from Miner, day 0)
         +
Conversion Outcome (from LOS, day 7-30)
         =
Complete Labeled Training Record
For customers who never convert, apply a timeout window (e.g., 60 days post-last-contact), then label as negative class.
6.2 Three Training Record Types
Journey-level records (for propensity model): One record per customer × product × journey attempt. Features aggregated across all pre-conversion conversations: total conversations, channels used, intent trajectory across touches, cumulative objections, days to conversion. The intent trajectory (e.g., [0.3, 0.4, 0.7, 0.85, 0.9] across 5 conversations) is far more predictive than any single conversation's score.
Conversation-level records (for contact strategy model): One record per conversation, labeled by what happened next. Features include: this conversation's channel/intent/objections + journey-so-far context + next action taken + next action result. The model learns optimal next-action recommendations (channel, timing, actor type).
Objection-rebuttal pairs (for sales bot optimization): One record per objection instance, with product, segment, rebuttal used, and outcome. Over thousands of pairs, this builds a lookup of what rebuttals work for which objections in which segments. Feeds directly back into the Sarvam bot's prompt.
6.3 The Feedback Loop
Conversations → Miner → Signals → NBO Engine → Better Offers
     ↑                     ↓
     └──── ML Models ← Feature Store ← Training Artifacts
Two learning loops at different time scales: the NBO engine adapts in real-time based on signals. The ML models retrain on weeks/months of accumulated journey-level data. The campaign optimization agent (Karpathy Loop) operates in between — tuning campaign parameters in days.

7. Full System Architecture
┌─────────────────────── CHANNELS ────────────────────────┐
│ Sarvam Voice │ Call Center │ WhatsApp │ Push │ In-App   │
└──────┬───────┴──────┬──────┴─────┬────┴───┬──┴────┬─────┘
       │              │            │        │       │
       ▼              ▼            ▼        ▼       ▼
┌─────────────── CHANNEL ADAPTERS (no LLM) ───────────────┐
│         Normalize → Canonical Interaction Event          │
│         Journey ID tagged by Moengage (outbound)         │
│         or looked up from journey state (inbound)        │
└──────────────────────────┬──────────────────────────────-┘
                           │
                           ▼
┌─────────────── EVENT BUS (Kafka) ───────────────────────┐
│              Customer-partitioned topics                 │
│              Durable, ordered, replayable                │
└──────────────────────────┬──────────────────────────────-┘
                           │
                           ▼
┌─────────── CONVERSATION MINER (LLM, async) ─────────────┐
│  Triggers on session-end event (<10 sec total)           │
│  Input: full conversation + structured channel metadata  │
│  Output 1: Cross-sell signals + suppression signals      │
│  Output 2: Training artifacts (labels + features)        │
│  Channel metadata bypasses LLM (already structured)      │
│  LLM processes raw content only                          │
└────────┬──────────────────┬─────────────────┬───────────-┘
         │                  │                 │
         ▼                  ▼                 ▼
┌────────────────┐  ┌──────────────┐  ┌──────────────────┐
│ SIGNALS STORE  │  │     C360     │  │  FEATURE STORE   │
│ (Postgres)     │  │ (Warehouse)  │  │  (ML Training)   │
│                │  │              │  │                   │
│ Real-time      │  │ Overnight    │  │ Batch join with   │
│ queryable      │  │ ETL pickup   │  │ LOS outcomes on   │
│                │  │              │  │ journey_id        │
│ Consumers:     │  │ AI-generated │  │                   │
│ • NBO engine   │  │ insights     │  │ Produces:         │
│ • Context      │  │ layer,       │  │ • Journey records │
│   compiler     │  │ separate     │  │ • Conv records    │
│   (inbound)    │  │ from SoR     │  │ • Objection pairs │
└────────────────┘  └──────────────┘  └──────────────────┘
         │                                    │
         ▼                                    ▼
┌────────────────┐                   ┌──────────────────┐
│   NBO ENGINE   │                   │   ML MODELS      │
│   Offer Mart   │◄─────────────────-│ • Propensity     │
│   Moengage     │   Better scores   │ • Contact strat  │
│   Campaigns    │                   │ • Objection      │
└────────────────┘                   └──────────────────┘


──── WITHIN EACH CHANNEL (runtime) ────

┌─────────────────────────────────────────────────────────┐
│                    SESSION (ADK)                         │
│  Events: auto-captured by Runner                        │
│  State: developer-managed via state_delta               │
│  Store: Postgres (DatabaseSessionService)               │
│  Dies on TTL / session end                              │
├─────────────────────────────────────────────────────────┤
│               CONTEXT COMPILER                           │
│  Assembles before each LLM turn:                        │
│  Session state + Signals Store query + C360 context     │
│  + RAG output + skill summaries                         │
│  Two-tier loading: cheap always, expensive on demand    │
├─────────────────────────────────────────────────────────┤
│              OBSERVABILITY (OTel → ClickHouse)           │
│  Parallel trace: latency, tokens, cost, model config    │
│  For engineers and auditors, not runtime                │
└─────────────────────────────────────────────────────────┘

8. Open Issues and Design Decisions
8.1 Human Agent Conversations
Call center human agents produce conversations via telephony recordings. ASR quality is lower (cross-talk, code-switching Hindi/English, background noise). The Conversation Miner prompt needs channel-specific tuning. Consider: using human agent CRM disposition notes as the primary signal source (already structured), with transcript mining as supplementary.
8.2 Conversation Miner Evals
No eval framework defined. Need: ground truth dataset (human-labeled signals from sample conversations), accuracy metrics for signal extraction, human-in-the-loop validation on a sample before signals drive customer-facing actions. The approval gate between AI recommendation and autonomous execution applies here.
8.3 DPDP Compliance
India's Digital Personal Data Protection Act applies to every step: recording, transcription, LLM processing, signal storage, cross-sell targeting. Requires: explicit consent at conversation start, opt-out mechanism, right to erasure (delete signals, retrain models without that data), data residency in India.
8.4 C360 Write-Back Governance
Signals are AI-generated, not system-of-record. Must land in a separate derived insights layer within C360, clearly distinguished from verified bureau data. Ownership: who controls the schema — data engineering team or AI team? Trust: do stakeholders accept LLM-extracted signals alongside verified data?
8.5 Multi-Product Journeys
One inbound conversation can spawn signals for multiple products. Journey stitching logic must handle one conversation mapping to multiple journey IDs. The miner output already supports an array of signals with different product fields.
8.6 Training Data Cold Start
ML models need thousands of labeled journey records. First 90 days may not have sufficient volume for niche products. Interim strategy: rules-based NBO scoring until sufficient training data accumulates, then transition to ML-based scoring per product category.
8.7 Medium-Term Memory Gap
Addressed by running the Conversation Miner on session-end event (not batch). Signals land in the signals store within 10 seconds of conversation end. Inbound calls query the signals store for real-time context. The signals store bridges the gap between session expiry and C360 refresh.

9. Technology Choices Summary
ComponentTechnologyRationaleSession storePostgres (ADK DatabaseSessionService)Compliance-friendly, India data residency, self-managedObservabilityClickHouse / LangfuseColumnar for analytical queries, append-only tracesEvent busKafkaDurable, ordered, customer-partitioned, replayableConversation Miner LLMHaiku-class modelLow cost per call, sufficient for extractionSignals storePostgres (dedicated table)Real-time queryable, same infra as sessionC360Existing data warehouseOvernight ETL from signals storeFeature storePostgres or dedicated ML feature storeBatch join with LOS outcomesMemory framework (optional)Mem0 over pgvectorIf general-purpose memory needed beyond cross-sell signals
9.1 When to Add Mem0
The current architecture is purpose-built for cross-sell signals. If the platform expands to general-purpose customer memory (call center copilot needing full interaction history, relationship manager dashboard, customer self-service with personalization), add Mem0 as the harvest layer. Mem0's extraction pipeline, deduplication, conflict resolution, and graph mode handle the general case. The Conversation Miner handles the cross-sell-specific case. They can coexist — the miner for signals, Mem0 for memories — consuming from the same Kafka event stream.Content is user-generated and unverified.
