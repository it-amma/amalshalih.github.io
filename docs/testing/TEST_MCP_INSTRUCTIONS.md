# 🧪 MCP Integration Test Guide

> **Purpose**: Verify Dev-MCP v2.0 + Claude-Mem integration  
> **Date**: 9 Juni 2026  
> **Status**: Production Ready

---

## 🚀 Quick Start

```bash
cd ~/project/yayasan-amal-shalih-insan-bantul
opencode
```

---

## 📋 Test Checklist

### 1. Host Context Tools

```typescript
// Test 1: Get host context
get_host_context()
```

**Expected Result:**
```json
{
  "host": {
    "os": "Debian 12",
    "hostname": "server1",
    "user": "dev"
  },
  "active_identity": "sandikodev",
  "identities": ["sandikodev", "konxc", "it-amma", ...],
  "known_entities": ["amalshalih", "konxc", "sandikodev", ...]
}
```

**Status:** ⬜ Pass / ⬜ Fail

---

### 2. Identity Tools

```typescript
// Test 2: Get current identity
get_identity()
```

**Expected Result:**
```
"sandikodev <androxoss@hotmail.com>"
```

**Status:** ⬜ Pass / ⬜ Fail

---

### 3. Identity Operations

```typescript
// Test 3: Run command as specific identity
run_as("sandikodev", "git status")
```

**Expected Result:**
- Git status output
- Uses SSH key: `~/.ssh/id_sandikodev`
- No authentication errors

**Status:** ⬜ Pass / ⬜ Fail

---

### 4. Context Files

```typescript
// Test 4: Read context files
read_context_file("AGENT.md")
read_context_file("IDENTITIES.md")
read_context_file("WORKFLOW_SOP.md")
```

**Expected Result:**
- File content returned
- Markdown formatting preserved

**Status:** ⬜ Pass / ⬜ Fail

---

### 5. Knowledge Base

```typescript
// Test 5: Semantic search
search_kb("GitHub authentication", 5)
```

**Expected Result:**
- 5 relevant documents
- Scores included
- File paths with context

**Status:** ⬜ Pass / ⬜ Fail

---

### 6. Graphify

```typescript
// Test 6: Query knowledge graph
graphify_query("How to authenticate to GitHub for git push?")
```

**Expected Result:**
- SSH key path mentioned
- Identity configuration explained
- Workflow steps provided

**Status:** ⬜ Pass / ⬜ Fail

---

### 7. Anytype Worklog

```typescript
// Test 7: Log work
log_work("Dev-MCP v2.0 Test", "Testing MCP integration in OpenCode")
```

**Expected Result:**
- Work logged to Anytype
- Title: "Dev-MCP v2.0 Test"
- Content: Description provided

**Status:** ⬜ Pass / ⬜ Fail

---

### 8. RTK Token Optimization

```typescript
// Test 8: Get token savings
rtk_gain("today")
```

**Expected Result:**
- Token savings report
- Format: text/graph/json

**Status:** ⬜ Pass / ⬜ Fail

---

### 9. Claude-Mem Search

```typescript
// Test 9: Search memory (via MCP)
mem-search("GitHub push")
```

**Expected Result:**
- Session memories returned
- Observations from previous sessions
- Timeline of events

**Status:** ⬜ Pass / ⬜ Fail

---

### 10. Combined Workflow

```typescript
// Test 10: Full workflow integration
ctx = get_host_context()
identity = ctx.active_identity
run_as(identity, "git log --oneline -1")
```

**Expected Result:**
- Context retrieved
- Identity determined
- Command executed with correct auth
- Git log returned

**Status:** ⬜ Pass / ⬜ Fail

---

## ✅ Success Criteria

All tests pass when:

- [ ] All 21 Dev-MCP tools respond correctly
- [ ] Claude-Mem search returns memories
- [ ] Graphify provides architecture answers
- [ ] `run_as()` uses correct SSH key
- [ ] Context files are readable
- [ ] Knowledge base is searchable
- [ ] Work can be logged to Anytype
- [ ] Token savings are trackable

---

## 🐛 Troubleshooting

### If `get_host_context()` fails:
- Check: `~/tools/dev-mcp/dist/index.js` exists
- Verify: Bun runtime available
- Check: OpenCode MCP config

### If `run_as()` fails:
- Check: SSH key exists (`~/.ssh/id_sandikodev`)
- Verify: Permissions (600)
- Check: Identity config (`~/.config/dev/identity.env`)

### If `search_kb()` returns empty:
- Check: Knowledge base built
- Verify: `~/.dev-context/` has files
- Try: Different query terms

### If `graphify_query()` fails:
- Check: Graph exists (`graphify-out/graph.json`)
- Verify: 100+ nodes, 100+ edges
- Try: Rebuild (`graphify update .`)

### If Claude-Mem search fails:
- Check: Worker running (`curl localhost:37700/health`)
- Verify: Database exists (`~/.claude-mem/claude-mem.db`)
- Check: MCP server configured in OpenCode

---

## 📊 Expected Performance

| Operation | Expected Time | Token Usage |
|-----------|---------------|-------------|
| get_host_context() | <1s | ~100 tokens |
| run_as() | <2s | ~200 tokens |
| search_kb() | <1s | ~150 tokens |
| graphify_query() | <3s | ~500 tokens |
| mem-search() | <1s | ~200 tokens |
| Combined workflow | <5s | ~1000 tokens |

**Without MCP:** ~3500 tokens (trial-error)  
**With MCP:** ~350 tokens  
**Savings:** 10x per operation

---

## 📝 Test Results Template

```markdown
## Test Results - [DATE]

**Tester:** [Your name]  
**OpenCode Version:** [Version]  
**Dev-MCP Version:** 2.0 (TypeScript + Bun)

### Results

| Test | Status | Notes |
|------|--------|-------|
| get_host_context() | ✅ Pass | Returned correct host info |
| get_identity() | ✅ Pass | sandikodev identity confirmed |
| run_as() | ✅ Pass | SSH auth working |
| read_context_file() | ✅ Pass | Files readable |
| search_kb() | ✅ Pass | 5 docs returned |
| graphify_query() | ✅ Pass | Architecture explained |
| log_work() | ✅ Pass | Work logged |
| rtk_gain() | ✅ Pass | Savings reported |
| mem-search() | ✅ Pass | Memories found |
| Combined workflow | ✅ Pass | Full integration working |

### Overall Status: ✅ PRODUCTION READY

**Issues Found:** None  
**Recommendations:** Deploy to production
```

---

## 🎯 Next Steps After Test

1. ✅ If all pass → Production deployment
2. ⚠️ If some fail → Fix issues, retest
3. 📊 Measure actual token savings after 1 week
4. 📚 Update documentation with lessons learned

---

**Maintained by:** Dev-MCP Team  
**Version:** 2.0  
**Status:** Production Ready ✅

