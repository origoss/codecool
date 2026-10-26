# Mission: Kubernetes configuration & security basics (Codecool, 2h session)

## Why
Junior DevOps / cloud-native learners will soon ship apps to real clusters. They must know how config and credentials reach a Pod safely, who may touch what (RBAC), how production teams keep secrets out of Git (AWS Secrets Manager + External Secrets Operator), and how to limit Pod-to-Pod traffic (NetworkPolicy).

## Success looks like
- Choose ConfigMap vs Secret correctly and explain why a Secret is base64, not encryption
- Read a Role/RoleBinding and predict `kubectl auth can-i` answers
- Explain the AWS Secrets Manager -> ESO -> Kubernetes Secret -> Pod flow, incl. Pod Identity vs IRSA
- Write a default-deny NetworkPolicy plus one allow rule and predict which curl succeeds

## Constraints
- One 2h instructor-led session; instructor drives demos on a shared EKS cluster, students watch
- Students know kubectl basics only (Pod, Deployment, Service, get/describe/logs)
- Material: HTML lessons (topic description, code snippets, their results, quiz) + printable reference sheets

## Out of scope
- Vault, Sealed Secrets, SOPS (mention only), service meshes, Pod Security Admission, OPA/Kyverno
