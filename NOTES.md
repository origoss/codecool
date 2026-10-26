# Notes

## Instructor preferences
- English, same look as ~/teach/Kubernetes-and-DevOps (assets/course.css + assets/lesson.js copied here)
- Each lesson = topic description + code snippets + their results (expected output blocks) + quiz
- Instructor-led: lessons double as demo script. Students watch, then review page later.
- Industry standards & best practices called out explicitly (".note"/".warn" boxes)

## Agenda (120')
| # | Topic | Time |
|---|---|---|
| 01 | ConfigMap vs Secret | 20' |
| 02 | Kubernetes RBAC | 30' |
| 03 | AWS Secrets Manager + External Secrets Operator (Pod Identity; IRSA compared) | 45' |
| 04 | NetworkPolicy | 20' |
| -- | Recap / Q&A | 5' |

## Demo environment
- Shared EKS, region eu-central-1, provisioned by OpenTofu in ./infra (instructor applies before session)
- EKS VPC CNI with network policy enforcement enabled (enableNetworkPolicy=true)
- ESO installed via Helm, authenticates with EKS Pod Identity
- Demo namespace: `demo` (netpol lesson may add `frontend`/`backend` apps)

## Authoring brief (for every lesson author)
1. Read ~/.claude/skills/teach/SKILL.md (philosophy), assets/course.css, assets/lesson.js, and
   ~/teach/Kubernetes-and-DevOps/lessons/s1-07-pod-deployment-service.html as THE style model. Copy its markup patterns
   (crumbs, win, meta, h2 sections, .cmd/.expect blocks, .note/.warn, cite sups, quiz-q, footer, nav).
2. Never trust memory: verify every claim against official docs (kubernetes.io, aws docs, external-secrets.io).
   Cite with <sup class="cite"><a href="URL">[n]</a></sup>. Write sources to .parts/<slug>-resources.md (RESOURCES-FORMAT.md style); instructor merges.
3. Every command shown gets a realistic expected-output block. If you can verify locally, do (kubectl/helm/tofu exist,
   docker running, no kind binary -- `go run sigs.k8s.io/kind` or skip). Mark unverified outputs nowhere differently,
   but keep them faithful to real tool output formats.
4. Put runnable YAML in examples/<lesson-slug>/ and reference it from the lesson.
5. Quiz: 4-6 questions, all options same word count, retrieval-style (predict output / spot the bug).
6. Link prev/next lessons: 0001-configmap-vs-secret.html, 0002-rbac.html, 0003-external-secrets-aws.html,
   0004-network-policies.html. Reference sheet: ../reference/secrets-security-reference.html.
7. Write new terms to .parts/<slug>-glossary.md (format: **Term**: definition. _Avoid_: ...); instructor merges.
8. Include "Ask your instructor / agent follow-up questions" reminder and one primary source recommendation.
9. Only touch your own files: lessons/<your file>, examples/<slug>/, .parts/<slug>-*, (eso agent: infra/). Never edit shared files.
10. When done, reply with a 5-line summary: files written, what was verified locally, open issues.
