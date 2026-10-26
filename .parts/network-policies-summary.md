# Lesson 04 (network-policies): author summary

Date: 2026-10-22. Slug: `network-policies`. Lesson file: `lessons/0004-network-policies.html`.

## Files written

All of these are new files. No shared files (assets/, GLOSSARY.md, RESOURCES.md, NOTES.md, MISSION.md, reference/, other lessons or examples) were edited.

| File | Purpose |
|---|---|
| `lessons/0004-network-policies.html` | The lesson: default allow-all, the need for an enforcing CNI (EKS VPC CNI / Calico / Cilium) with an `aws-node` check, anatomy (podSelector / namespaceSelector / both / ipBlock, ingress vs egress, policyTypes default), additive allow-lists and the both-ends rule, the AND vs OR YAML trap, an 8-step demo, industry practice, an EKS warning box, a 6-question quiz, "Go further", an ask reminder, 8 sources, and the pager (prev 0003 → reference sheet, no next). |
| `examples/network-policies/00-namespace.yaml` | Namespace `demo` (idempotent, same as the sibling lessons). |
| `examples/network-policies/01-apps.yaml` | `backend` Deployment (nginxinc/nginx-unprivileged:1.27-alpine, :8080) + Service `backend` 8080→8080; `frontend` Deployment (curlimages/curl:8.11.1, `sleep infinity`). |
| `examples/network-policies/02-default-deny.yaml` | `default-deny-all`: `podSelector: {}`, Ingress+Egress, no rules. |
| `examples/network-policies/03-allow-frontend-to-backend.yaml` | `backend-allow-from-frontend` (ingress) + `frontend-allow-to-backend` (egress), TCP 8080. |
| `examples/network-policies/04-allow-dns.yaml` | `allow-dns-egress`: every Pod in demo → `kube-system` AND `k8s-app=kube-dns`, UDP+TCP 53. |
| `examples/network-policies/05-trap-or.yaml` | `trap-or`: same as 04 with an extra `-` (OR). Used only for `kubectl describe`. |
| `.parts/network-policies-resources.md` | 8 annotated sources in RESOURCES-FORMAT style, for the instructor to merge. |
| `.parts/network-policies-glossary.md` | NetworkPolicy, Isolated Pod, Default deny, Enforcing CNI, Ingress/Egress (NetworkPolicy), for the instructor to merge. |
| `.parts/network-policies-summary.md` | This file. |

## What was verified, and how

### Claims checked against official docs (fetched 2026-10-22)

- kubernetes.io "Network Policies":
  - the prerequisite that a policy without an implementing plugin "will have no effect"
  - non-isolated by default; isolation per direction
  - additive union, order-independent, and the both-ends rule
  - the four selector kinds and the AND vs OR example, with the advice to use `kubectl describe`
  - the policyTypes default (Ingress always, Egress if egress rules exist)
  - the default-deny-all YAML
  - the caution that default deny egress also blocks DNS
  - the "What you can't do" list (TLS, Services by name, cluster-wide defaults, explicit deny, logging)
  - page section anchors used in the citations
- docs.aws.amazon.com `cni-network-policy`:
  - L3/L4
  - Linux EC2 nodes only (no Fargate or Windows)
  - unreliable enforcement for Pods without ownerReferences
  - Service port must equal container port
  - IMDS can be blocked; Pod Identity/IRSA Pods don't use IMDS
  - VPC CNI ≥ 1.21
- docs.aws.amazon.com `cni-network-policy-configure`:
  - `{"enableNetworkPolicy": "true"}`
  - standard vs strict mode (new Pods start allow-all in standard mode)
  - 2/2 `aws-node` containers when enabled
  - eBPF enforcement
- kubernetes.io "Debugging DNS Resolution": the Service is `kube-dns`, CoreDNS Pods are labelled `k8s-app=kube-dns`, ports 53/UDP and 53/TCP.
- kubernetes.io "Namespaces": the automatic immutable `kubernetes.io/metadata.name` label, stable since v1.22.
- kubernetes.io "Declare Network Policy": the ephemeral `kubectl run --rm` test-Pod pattern with and without a label.
- Calico docs: "To enforce network policy, you must use a network plugin such as Calico."
- Cilium docs: lists "Kubernetes NetworkPolicy, CiliumNetworkPolicy and CiliumClusterwideNetworkPolicy" and a "Layer 7 Policies → HTTP" section.

### Demo run locally

- **Tools:** kind v0.33.0 (installed into the scratchpad with `go install sigs.k8s.io/kind@latest`), node image v1.37.0, kubectl client 1.36.1, Docker 28.3.0, macOS arm64.
- **Cluster:** a dedicated cluster `netpol-lesson` with its own kubeconfig file in the scratchpad. `~/.kube/config` was not touched.
- **Enforcement:** kind's default kindnet CNI did enforce NetworkPolicy. A curl that had returned 200 timed out once default deny was applied.
- **Sequence run, in order:**
  1. `kubectl apply` of `00` and `01`.
  2. `rollout status`.
  3. `get pods,svc -o wide --show-labels`.
  4. The frontend curl and the `tester` curl, before any policy: both `200`.
  5. Apply `02`, then the frontend curl: `curl: (28) Resolving timed out after 3001 milliseconds`, `000`, exit 28.
  6. Apply `03`, then the frontend curl by name: same resolving timeout. The same curl by ClusterIP `10.96.231.114`: `200`.
  7. Apply `04`, then the frontend curl: `200`.
  8. The unlabelled `tester`: `Connection timed out after 3002 milliseconds`, `pod demo/tester terminated (Error)`.
  9. The `tester` with `--labels=app=frontend`: `200`.
  10. `get networkpolicy`.
  11. `describe networkpolicy allow-dns-egress`: one `To:` block holding both selectors.
  12. Apply `05`, then `describe networkpolicy trap-or`: two `To:` blocks. Then delete `05`.
  13. `get pods -l 'app in (frontend,backend)'`.
  14. Delete `02`, `03` and `04`, then delete `01`.
  15. `kind delete cluster`.
- **Lesson HTML checks:** a Python script confirmed balanced tags, that each quiz `data-answer` index points at the intended option, and equal word counts per question (7/8/8/7/7/6).

## Outputs that are not verbatim from a run

The lesson does not mark these as unverified (per the brief), so they are listed here.

1. **`kubectl get pods -n kube-system -l k8s-app=aws-node` (2/2 Running).** Written from the EKS docs' example format, with invented Pod names and ages. It was never run against EKS. The label selector `k8s-app=aws-node` is assumed rather than doc-verified; the AWS docs use `kubectl get pods -n kube-system | grep 'aws-node\|amazon'`.
2. **Step 1 apply output: `namespace/demo unchanged`.** The local run printed `namespace/demo created` on the fresh cluster. I changed it because `demo` already exists on EKS from lesson 01. The `get pods` output (AGE 74s) came from a later call in the same session.
3. **Step 4, `kubectl -n demo get svc backend -o jsonpath='{.spec.clusterIP}'`.** This exact command was not run; the IP `10.96.231.114` came from `get svc -o wide`. On EKS the ClusterIP will be in the cluster's service CIDR, not 10.96.x.
4. **Step 7, one `kubectl describe networkpolicy allow-dns-egress trap-or` call.** Locally the two policies were described in separate calls; the combined output was assembled from them, with `Created on` lines trimmed.
5. **Step 8, a single `kubectl delete -f 02 -f 03 -f 04 -f 01`.** Locally this ran as two delete calls; the merged output lines are the real ones, concatenated.
6. **The `kubectl run` banner.** "All commands and output from this session will be recorded in container logs…" was printed for the `tester` runs and is trimmed to `...` in the lesson.
7. **Quiz scenarios not run:** Q2 (`team: ops` OR trap on ingress), Q3 (a non-enforcing CNI), Q4 (two policies with different port/peer pairs), Q5 (missing frontend egress), Q6 (L7). Their explanations follow the docs' semantics. Q5 matches what was observed: before `04` existed, the egress was blocked.
8. **Cilium claims.** The fetched Cilium page did not explicitly state "supports standard NetworkPolicy" or "L7 via CiliumNetworkPolicy"; it only lists the resource types and an L7/HTTP section. The lesson and the resources fragment phrase this as Cilium's "own policy type" / L7. Worth a quick look by the instructor.

## Open issues

1. **EKS test-Pod reliability.** The AWS docs say enforcement "might not work reliably" for standalone Pods without ownerReferences, and the ephemeral `kubectl run tester` Pod is standalone. On EKS a test that should fail could pass. The apps are Deployments for this reason, and the tester waits `sleep 5` to get past the standard-mode allow-all window at Pod startup. **The instructor should dry-run steps 2 and 6 on the real EKS cluster before the session.** If the tester is flaky, switch the tester to a Job (Jobs set ownerReferences) or enable strict mode.
2. **Order and blast radius.** `default-deny-all` selects every Pod in `demo` and cuts off anything else running there (lesson 01–03 demo Pods, and an ESO-synced app if it lives in `demo`). Lesson 04 must run last. Step 8 cleans up.
3. **Lesson links not checked.** `0002-rbac.html`, `0003-external-secrets-aws.html` and `../reference/secrets-security-reference.html` did not exist when I wrote the lesson, so the links are unchecked.
4. **Image pulls on EKS.** `curlimages/curl:8.11.1` and `nginxinc/nginx-unprivileged:1.27-alpine` come from Docker Hub, which needs internet access and is subject to Docker Hub rate limits. Pre-pull the images or mirror them to ECR if the nodes are private.
5. **CIDRs differ on EKS.** The ClusterIP and the Pod IPs in the expected outputs are kind's (10.96.x / 10.244.x). On EKS, Pod IPs are VPC addresses, so students' output will differ; the expected-output summaries say so only for the ClusterIP.
6. **Lesson 03 (ESO) default-deny caveat.** The warning box says Pod Identity/IRSA Pods don't use IMDS and that other destinations need egress allows. Whether the EKS Pod Identity Agent endpoint (a link-local address on the node) needs an explicit allow under VPC CNI is not verified. It is not claimed in the lesson; it only matters if someone default-denies the ESO namespace.

## Side effects outside my files

- **kind binary:** built into `/private/tmp/claude-501/-Users-eja-teach-codecool/9b44673d-74f5-496e-8614-211e40c60471/scratchpad/kindbin/kind` with `go install`. This also filled the Go module/build cache (`~/go/pkg/mod`, the Go build cache).
- **Cluster:** created and then deleted the kind cluster `netpol-lesson`. Its kubeconfig file is at `/private/tmp/claude-501/-Users-eja-teach-codecool/9b44673d-74f5-496e-8614-211e40c60471/scratchpad/netpol.kubeconfig`; the cluster is gone, but the file was left behind.
- **Other clusters:** the existing kind clusters `iac-vs-iad`, `kind` and `rbac-lesson`, and the `kind-kind` context in `~/.kube/config`, were not touched.
- **Images:** the `kindest/node:v1.37.0` image may now be in the local Docker image cache (possibly already present). The curl and nginx images were pulled inside the kind node and were removed with the cluster.
- **Network:** fetched the official doc pages listed above. Nothing was published or committed, and no artifacts were created.
