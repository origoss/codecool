# Lesson 0002-rbac: author summary

## Files written

| File | Content |
|---|---|
| `lessons/0002-rbac.html` | The lesson. Sections: authn vs authz; subjects; rules (verbs × resources × apiGroups); the four RBAC objects, including a RoleBinding that points at a ClusterRole; deny by default, allow only; a 9-step demo; best practices; humans on EKS via access entries; a 6-question quiz; read-next and ask-your-instructor blocks; 12 numbered sources; prev/next links (0001 and 0003); a link to the reference sheet. |
| `examples/rbac/00-namespace.yaml` | Namespace `demo`. Same as lesson 01's file, so applying it again changes nothing. |
| `examples/rbac/01-serviceaccount.yaml` | ServiceAccount `config-reader` with `automountServiceAccountToken: false`. |
| `examples/rbac/02-role.yaml` | Role `configmap-reader`: `get` and `list` on `configmaps`, apiGroup `""`. |
| `examples/rbac/03-rolebinding.yaml` | RoleBinding `config-reader-configmap-reader`, which gives that Role to `config-reader`. |
| `examples/rbac/04-viewer.yaml` | ServiceAccount `viewer` plus RoleBinding `viewer-view`, which points at the built-in ClusterRole `view`. |
| `examples/rbac/05-pod.yaml` | One-shot Pod `rbac-client`. Image `registry.k8s.io/kubectl:v1.37.0`, runs as `config-reader`, Pod-level `automountServiceAccountToken: true`, command `kubectl get configmaps,secrets`. |
| `.parts/rbac-resources.md` | Sources, in RESOURCES-FORMAT style, with a Gaps section. |
| `.parts/rbac-glossary.md` | 11 terms: authn, authz, RBAC, subject, ServiceAccount, rule, Role/ClusterRole, RoleBinding/ClusterRoleBinding, default deny, impersonation, EKS access entry. |
| `.parts/rbac-summary.md` | This file. |

I did not edit any shared file (assets, NOTES, GLOSSARY, RESOURCES, reference) or any other lesson's files.

## How I verified

**Docs.** I checked every claim against the official pages with WebFetch, and checked every `#anchor` in a citation by grepping the fetched HTML for its `id`. Three anchors were wrong and are now fixed:
- `#minimize-wildcard-permissions` does not exist. The wildcard advice is under `#least-privilege`.
- The `automountServiceAccountToken` advice sits under `#hardening`.
- "One ServiceAccount per workload" now cites RBAC `#service-account-permissions`.

Pages used:
- Kubernetes: RBAC, Authorization, Authenticating, RBAC Good Practices, Configure Service Accounts, Service Accounts concept, `kubectl auth can-i`.
- AWS: EKS access entries, Create access entries, Access policy permissions.

**Cluster.** `go run sigs.k8s.io/kind@latest` (kind v0.33.0) created a dedicated cluster `rbac-lesson`: Kubernetes v1.37.0, the same minor version as the EKS default in `infra/variables.tf`, with kubectl client 1.36.1. I used a separate kubeconfig in the scratchpad so I would not collide with other authors on `kind-kind`. To make the outputs match lesson 01, I applied lesson 01's `examples/configmap-vs-secret/01-configmap.yaml` (read only, never edited) and created `secret/db-credentials` with `username=app` and `password=s3cr3t-pa55`.

**Verified for real** (command run, output captured):
- `can-i list configmaps` before any binding → `no`, exit code 1.
- After the Role and binding: list configmaps in `demo` → `yes`; delete configmaps → `no`; get configmaps in `default` → `no`; get or list secrets in `demo` → `no`.
- `kubectl get configmaps --as=…config-reader` → `app-config` and `kube-root-ca.crt`.
- `kubectl get secret db-credentials --as=…config-reader` → the exact Forbidden text shown in the lesson.
- `kubectl auth can-i --list` (the lesson shows it trimmed).
- `kubectl get rolebinding -o wide` column layout.
- `kubectl create role … --dry-run=client -o yaml`. The output is not shown in the lesson; it is only mentioned in a note.
- Viewer: list pods in `demo` → `yes`; in `default` → `no`; list secrets → `no`.
- `kubectl patch` on `roleRef` → `field is immutable`, exact text.
- Pod `rbac-client` logs: the ConfigMaps list plus the Forbidden error for secrets. The Pod ends in `Error`.
- The same Pod with `automountServiceAccountToken: false` → `The connection to the server localhost:8080 was refused`. Quiz question 6 is based on this run.
- `kubectl get secrets -n demo -o yaml` as admin shows the base64 `data`.
- Built-in ClusterRoleBinding `cluster-admin` → group `system:masters`. Not used in the lesson.

**Quiz.** A script checked that all options of each question have the same word count (6 or 7). An HTML tag-balance check passed. Correct answers sit at different positions (2, 1, 3, 1, 0, 2).

## Outputs edited or unverified

**Edited from the real run, so read them as plausible, not captured:**
- AGE values in steps 4 and 8 (12m, 13m, 14m, 15m) are set for the lesson's timeline. The real values were seconds or minutes on a fresh cluster.
- In step 1, `namespace/demo unchanged` assumes lesson 01 already created the namespace. My fresh cluster printed `created`.
- The step 2 output shows `kubectl get rolebinding -o wide`. I captured it with `get role,rolebinding`, so the RoleBinding row is real and the command was narrowed afterwards. AGE changed from 1s to 2s.
- The step 9 secret YAML is trimmed: creationTimestamp, resourceVersion, uid and the list metadata are removed. The values are my test values, not lesson 01's.
- The step 5 `--list` output is trimmed with `...`. EKS will show different or extra built-in lines.

**Not run at all:**
- The `aws eks create-access-entry` command and its JSON output. I built them from the AWS docs' CLI syntax and the auto-generated username format. The account 111122223333 and role `demo-viewers` are placeholders.
- `--as` impersonation on EKS itself. It should work for an instructor with AmazonEKSClusterAdminPolicy, which grants `*` on `*`.
- The "401 Unauthorized" for an authentication failure in the authn/authz table. That comes from general knowledge; I did not quote it from the docs.
- The claim that `can-i` exits 0 for yes. I only observed exit code 1 for no.

## Open issues

1. **Lesson 01 Secret contents.** Lesson 01 seems to create `db-credentials` imperatively; I found no YAML for it. `02-app.yaml` confirms only the key `password`. If lesson 01 uses a different name or keys, steps 4 and 9 need a small text change.
2. **Image pull on EKS.** `05-pod.yaml` pulls `registry.k8s.io/kubectl:v1.37.0`. EKS nodes need outbound access to registry.k8s.io, or the image must be mirrored to ECR. The image contains only the kubectl binary (no shell, no `sleep`), which is why the Pod is one-shot.
3. **Instructor rights.** The demo needs the `impersonate` permission.
4. **Sourcing gap.** No doc says "one ServiceAccount per workload" word for word. The closest is the RBAC docs ranking an "application-specific service account" as best practice, which is what the lesson cites.
5. **Glossary rule.** The glossary entries were written before students have used the terms, which goes against the GLOSSARY-FORMAT rule. The instructor should decide what to merge.
6. **Cosmetic.** The `<pre>` inside quiz question 3's legend gets a "copy" button from `lesson.js`. Harmless.
7. **Missing reference sheet.** `reference/secrets-security-reference.html` does not exist yet, so the lesson's link is dead until the instructor writes it.

## Side effects outside my files

- **Docker Desktop:** it was not running, so I started it with `open -a Docker`. It is still running.
- **kind:** created cluster `rbac-lesson`, then deleted it. Its kubeconfig lived only in the scratchpad. `kind-kind` and `iac-vs-iad` were not touched.
- **Go module cache:** `go run sigs.k8s.io/kind@latest` downloaded kind v0.33.0 into it.
- **Docker images:** `docker pull registry.k8s.io/kubectl:v1.37.0` left that image in local Docker. The v1.34.1 image was pulled only inside the deleted kind node.
- **Scratchpad:** fetched doc HTML and the kubeconfig are in `/private/tmp/claude-501/-Users-eja-teach-codecool/f8ad8a25-acdb-4534-903b-70e6c9825da8/scratchpad`.
- **Browser:** opened `lessons/0002-rbac.html` with `open`.
