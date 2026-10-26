# Config, Secrets & Security on Kubernetes

Study material for one 2-hour, instructor-led session for engineers starting out in DevOps and cloud native. The instructor demos on a shared EKS cluster; each lesson page holds the background, every command with its result, best practices and a self-check quiz.

| # | Lesson | Time |
|---|---|---|
| 00 | [Anatomy of a Kubernetes YAML: fields, labels, selectors](lessons/0000-yaml-anatomy.html) | 15' |
| 01 | [ConfigMap vs Secret](lessons/0001-configmap-vs-secret.html) | 20' |
| 02 | [Kubernetes RBAC](lessons/0002-rbac.html) | 30' |
| 03 | [AWS Secrets Manager + External Secrets Operator](lessons/0003-external-secrets-aws.html) | 45' |
| 04 | [NetworkPolicy](lessons/0004-network-policies.html) | 20' |
| 05 | [DaemonSets: one Pod on every node](lessons/0005-daemonsets.html) | 20' |
| -- | Recap and Q&A | 5' |

Printable [reference sheet](reference/secrets-security-reference.html): commands, YAML skeletons and best practices from all four lessons.

Demo cluster: OpenTofu code in [infra/](infra/README.md) (instructor applies before the session, destroys after). Runnable manifests in [examples/](examples/).

Also here: [RESOURCES.md](RESOURCES.md) (sources behind every lesson) and [GLOSSARY.md](GLOSSARY.md) (vocabulary).
