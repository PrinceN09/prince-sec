# PrinceSec Evidence Checklist

Use this while you work on any security project, lab, or investigation.
It is written for the SOC Capstone first, but every section is reusable.

**Golden rule:** PrinceSec only publishes what you actually did and can show.
If it is not captured now, it cannot be honestly reconstructed later.
Capture first, tidy later.

---

## 0. Set up before you start (5 minutes)

- [ ] Create a project folder outside any public repo: `evidence-raw/<project-slug>/`
- [ ] Create a running log file: `evidence-raw/<project-slug>/LOG.md` (template in section 2)
- [ ] Turn on timestamps in your terminal and note the system time zone of each machine
- [ ] Decide screenshot naming: `YYYYMMDD-HHMMSS_<stage>_<short-description>.png`
- [ ] Keep **raw, unedited originals** in `evidence-raw/`. Publish only redacted copies.
- [ ] Note the project's rules: is publishing allowed? (course, employer, or institution)
- [ ] Never download or store live malware where it could be shared. Record hashes, do not host samples.

---

## 1. Environment and architecture (capture once, update if it changes)

- [ ] Every system in the lab: name, role, OS and version, IP range (lab-only), purpose
- [ ] Wazuh components: manager, indexer, dashboard, agents, versions
- [ ] Attacker/test systems, victim/endpoint systems, monitoring systems
- [ ] How systems connect: network segments, hypervisor, virtual switches
- [ ] A diagram, even a rough hand sketch or screenshot (it will be redrawn later)
- [ ] Anything that differs from the assignment brief, and why
- [ ] Tool and version list (Wazuh, OS, Sysmon, scanners, analysis tools)

---

## 2. Per-step log (copy this block for every meaningful action)

```
### Step <n>: <short title>
Time (with time zone):
Stage: Detection | Triage | Investigation | Containment | Eradication | Recovery | Lessons
Machine / where I ran it:
Why I did this (what question was I answering?):
Command or action (exact text):
Output (paste, or file name):
What I observed:
What I concluded / what it changed about my thinking:
Evidence files: (screenshot names, exports)
Redaction needed? yes / no (what)
```

The "why", "observed", and "concluded" lines are what make this an investigation
instead of a list of screenshots. Do not skip them.

---

## 3. Capture checklist by stage

### Detection

- [ ] Screenshot of the Wazuh alert(s) with the timestamp visible
- [ ] Alert ID and rule ID
- [ ] Rule description, rule level/severity, and rule groups
- [ ] Agent/host that generated it
- [ ] Full alert JSON export (or event details)
- [ ] The relevant raw log lines that triggered it
- [ ] The detection rule itself (default or custom) and why it fired
- [ ] Anything that was NOT detected or was noisy (false positives and misses are valuable)

### Triage

- [ ] How you decided it was worth investigating (true vs false positive reasoning)
- [ ] Severity you assigned and why
- [ ] Scope guess: which hosts, users, and files might be affected
- [ ] Related alerts you looked at

### Investigation

- [ ] Each query, search, or filter you used (Wazuh, Linux commands, etc.), with results
- [ ] Timeline of events in order (time, host, event, source)
- [ ] Process, parent process, and command line details
- [ ] File details: name, path, hash (MD5/SHA1/SHA256), size, created/modified time
- [ ] Network activity: IPs, ports, domains (lab-only vs real)
- [ ] User accounts involved
- [ ] Persistence or lateral movement checks, including results that were negative
- [ ] Threat intelligence or analysis lookups (source and result)
- [ ] Your hypotheses, and which ones you ruled out and why
- [ ] Impact assessment: what was affected, what was not, how you know

### Containment

- [ ] Exactly what you did (isolate host, block IP, disable account, etc.)
- [ ] When you did it and why that action
- [ ] Proof it worked (before and after)
- [ ] Any side effects or trade-offs you considered

### Eradication

- [ ] What was removed or fixed (files, processes, persistence, accounts)
- [ ] Commands used and their output
- [ ] How you verified the threat was gone

### Recovery

- [ ] Steps taken to restore normal operation
- [ ] Verification that systems were healthy again
- [ ] Monitoring you added or tuned afterward

### Lessons learned

- [ ] What you would detect earlier next time (rules, logging, visibility)
- [ ] What surprised you or what you got wrong at first
- [ ] Specific technical things you now understand (not generic statements)
- [ ] Recommended remediation and prevention

---

## 4. Indicators (keep one table)

Only record what is real from your investigation. Mark each as lab-only or real.

| Type               | Value | Context (where seen, why it matters) | Lab-only? | Safe to publish? |
| ------------------ | ----- | ------------------------------------ | --------- | ---------------- |
| file hash          |       |                                      |           |                  |
| file name / path   |       |                                      |           |                  |
| process            |       |                                      |           |                  |
| IP address         |       |                                      |           |                  |
| domain             |       |                                      |           |                  |
| host               |       |                                      |           |                  |
| user               |       |                                      |           |                  |
| timestamp          |       |                                      |           |                  |
| alert ID / rule ID |       |                                      |           |                  |

---

## 5. Redaction checklist (review every screenshot and log before it is published)

- [ ] Real public IP addresses (yours, your ISP's, anyone else's)
- [ ] Real usernames, email addresses, or personal names
- [ ] Hostnames or machine names that identify you or your institution
- [ ] Passwords, API keys, tokens, agent registration keys, certificates
- [ ] Wazuh/Elastic/OpenSearch credentials and dashboard URLs with sessions
- [ ] Cloud account IDs, subscription IDs, access keys
- [ ] File paths that reveal personal information
- [ ] Browser tabs, bookmarks, notifications, or other windows in the screenshot
- [ ] Real malicious URLs or domains (they are shown defanged on the site, never live links)
- [ ] Anything covered by a course, employer, or NDA restriction

Redact permanently on a copy (crop or solid box). Blur alone can be reversible.
Never overwrite the raw original.

---

## 6. When the project is finished (within 48 hours, while it is fresh)

- [ ] Write a 5-line summary: what happened, what I detected, how I investigated, impact, response and result
- [ ] Fill any gaps in the log while you still remember them
- [ ] List screenshots with alt-text descriptions (what a screen-reader user should know)
- [ ] Note the final outcome in your own words
- [ ] Note any skills you actually used (only things you did)
- [ ] Note tools you actually used (only tools you actually used)
- [ ] Confirm the redaction pass is complete
- [ ] Decide if there is a public repository (only link it if code really is public)

---

## 7. What NOT to do

- Do not stage or "recreate" evidence after the fact.
- Do not invent, round, or fill in timestamps, hashes, IPs, or results you did not record.
- Do not publish malware samples.
- Do not claim a skill or tool you did not use.
- Do not delete negative results. "I checked X and found nothing" is real evidence.
