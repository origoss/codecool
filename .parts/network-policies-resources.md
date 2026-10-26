## Knowledge

### NetworkPolicy (lesson 04)

Links verified 2026-10-22 (Kubernetes docs current as of v1.37).

- [Docs: "Network Policies" (Kubernetes)](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
  The canonical concept page: two sorts of isolation, additive union, both-ends rule, the four selector kinds with the AND/OR YAML example, default-deny YAML, DNS caution, "What you can't do". **Recommended read** for the NetworkPolicy lesson.
- [Docs: "Declare Network Policy" (Kubernetes)](https://kubernetes.io/docs/tasks/administer-cluster/declare-network-policy/)
  Short task: test reachability with an ephemeral busybox Pod with and without a label. Use for: the ephemeral test-Pod pattern.
- [Docs: "Limit Pod traffic with Kubernetes network policies" (Amazon EKS)](https://docs.aws.amazon.com/eks/latest/userguide/cni-network-policy.html)
  VPC CNI support matrix and Considerations: Linux EC2 nodes only (no Fargate/Windows), standalone Pods without ownerReferences may not be enforced reliably, Service port must equal container port, IMDS gets blocked. Use for: every EKS-specific caveat.
- [Docs: "Restrict Pod network traffic with Kubernetes network policies" (Amazon EKS)](https://docs.aws.amazon.com/eks/latest/userguide/cni-network-policy-configure.html)
  How to turn it on (`enableNetworkPolicy: "true"`), standard vs strict mode at Pod startup, verifying 2/2 `aws-node` containers. Use for: infra setup and the "is it enforced?" check.
- [Docs: "Debugging DNS Resolution" (Kubernetes)](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
  CoreDNS Service is still named `kube-dns`, Pods labelled `k8s-app=kube-dns`, ports 53/UDP+TCP. Use for: writing the DNS egress allow rule.
- [Docs: "Namespaces", automatic labelling (Kubernetes)](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
  Immutable `kubernetes.io/metadata.name` label on every namespace (stable since v1.22). Use for: selecting a namespace by name in a namespaceSelector.
- [Docs: "Get started with Kubernetes network policy" (Calico)](https://docs.tigera.io/calico/latest/network-policy/get-started/kubernetes-policy/kubernetes-network-policy)
  Calico as an enforcing CNI outside EKS. Use for: "which CNI enforces this?" questions.
- [Docs: "Overview of Network Policy" (Cilium)](https://docs.cilium.io/en/stable/security/policy/)
  Cilium enforces standard NetworkPolicy plus its own CiliumNetworkPolicy with L7 (HTTP) rules. Use for: the "NetworkPolicy is L3/L4 only, what then?" follow-up.
