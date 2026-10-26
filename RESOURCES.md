# Config, Secrets & Security Resources

## Knowledge

### 01 ConfigMap vs Secret

- [Kubernetes docs: ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
  Official concept page. Use for: what a ConfigMap is, the four ways a Pod consumes one, the 1 MiB limit, mounted-file refresh vs env vars vs subPath, immutable ConfigMaps.
- [Kubernetes docs: Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
  Official concept page with the "stored unencrypted in etcd" caution. Use for: Secret types (Opaque, dockerconfigjson, tls, ...), data vs stringData, 1 MiB limit, refresh behaviour, immutable Secrets, tmpfs and node-level protections.
- [Kubernetes docs: Good practices for Kubernetes Secrets](https://kubernetes.io/docs/concepts/security/secrets-good-practices/)
  Short checklist for admins and developers. Use for: encryption at rest, least-privilege (list/watch = read all), "base64 is not encryption", never share/commit Secret manifests. Primary source recommended in lesson 01.
- [Kubernetes docs: Encrypting Confidential Data at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/)
  Task page for EncryptionConfiguration and providers. Use for: why the default `identity` provider means plain text in etcd.
- [Kubernetes docs: Managing Secrets using kubectl](https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-kubectl/)
  Use for: `kubectl create secret generic`, quoting special characters, decoding, shell-history caution.
- [Amazon EKS User Guide: Default envelope encryption for all Kubernetes API data](https://docs.aws.amazon.com/eks/latest/userguide/envelope-encryption.html)
  Use for: EKS 1.28+ default KMS v2 envelope encryption (DEK/KEK), AWS owned key vs customer managed key, what happens if a CMK is disabled/deleted.

- [The Twelve-Factor App](https://12factor.net/)
  Methodology for cloud-ready apps. Use for: factors III (Config), IV (Backing services), V (Build, release, run) — the why behind ConfigMaps/Secrets.

### 02 RBAC

- [Kubernetes: Using RBAC Authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
  Primary reference for Role/ClusterRole/RoleBinding/ClusterRoleBinding, subjects, roleRef immutability, user-facing roles (view/edit/admin/cluster-admin), ServiceAccount permission strategies. Use for: any RBAC object or default-role question. **Primary source recommended in the lesson.**
- [Kubernetes: Role Based Access Control Good Practices](https://kubernetes.io/docs/concepts/security/rbac-good-practices/)
  Least privilege, wildcards, cluster-admin, list/watch on Secrets, automountServiceAccountToken, privilege-escalation risks (workload creation, escalate/bind/impersonate). Use for: best-practice and risk callouts.
- [Kubernetes: Authorization](https://kubernetes.io/docs/reference/access-authn-authz/authorization/)
  Authn-before-authz, request attributes, default deny (HTTP 403), HTTP method -> verb mapping, "list on secrets reveals data". Use for: how a request is decided.
- [Kubernetes: Authenticating](https://kubernetes.io/docs/reference/access-authn-authz/authentication/)
  Two user categories, no User objects, impersonation. Use for: who a "user" is.
- [kubectl auth can-i](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_auth/kubectl_auth_can-i/)
  Flags (--list, --as, -n, -q) and examples incl. --as=system:serviceaccount:ns:name. Use for: checking permissions.
- [Kubernetes: Configure Service Accounts for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)
  default ServiceAccount, opting out of token automount (Pod spec wins over SA). Use for: workload identity in Pods.
- [Amazon EKS: Grant IAM users access with access entries](https://docs.aws.amazon.com/eks/latest/userguide/access-entries.html)
  IAM principal -> Kubernetes permissions via access policies or Kubernetes groups; replaces aws-auth ConfigMap. Use for: how humans get in on EKS.
- [Amazon EKS: Create access entries](https://docs.aws.amazon.com/eks/latest/userguide/creating-access-entries.html)
  CLI syntax, --kubernetes-groups, auto-generated usernames, EKS does not validate that RBAC for the group exists.
- [Amazon EKS: Review access policy permissions](https://docs.aws.amazon.com/eks/latest/userguide/access-policy-permissions.html)
  Exact rules of AmazonEKSViewPolicy / EditPolicy / AdminPolicy / ClusterAdminPolicy (allow-only, like RBAC). Note: AmazonEKSAdminViewPolicy DOES include Secrets.

### 03 AWS Secrets Manager + ESO

- [External Secrets Operator: AWS authentication](https://external-secrets.io/latest/provider/aws-access/)
  Official ESO page for every AWS login method, incl. the EKS Pod Identity setup (no `auth` block in the SecretStore). Use for: choosing and debugging how ESO authenticates to AWS. Primary source of lesson 03.
- [External Secrets Operator: Overview](https://external-secrets.io/latest/introduction/overview/)
  Controller, SecretStore vs ClusterSecretStore vs ExternalSecret, security notes on the controller's privileges. Use for: explaining ESO architecture.
- [External Secrets Operator: ExternalSecret API](https://external-secrets.io/latest/api/externalsecret/)
  refreshInterval, refreshPolicy, target.creationPolicy / deletionPolicy, status conditions. Use for: any ExternalSecret field question.
- [External Secrets Operator: AWS Secrets Manager provider](https://external-secrets.io/latest/provider/aws-secrets-manager/)
  SecretStore/ExternalSecret examples, `property` with gjson paths, IAM policy example. Use for: AWS-specific ExternalSecret syntax.
- [External Secrets Operator: FAQ](https://external-secrets.io/latest/introduction/faq/)
  Force-sync annotation, refresh policies. Use for: "why hasn't my secret updated yet?".
- [Amazon EKS: EKS Pod Identity](https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html)
  Benefits, agent (169.254.170.23), restrictions (no Fargate). Use for: what Pod Identity is and where it works.
- [Amazon EKS: How EKS Pod Identity works](https://docs.aws.amazon.com/eks/latest/userguide/pod-id-how-it-works.html)
  Injected env vars, AssumeRoleForPodIdentity flow. Use for: demoing/debugging credentials inside a Pod.
- [Amazon EKS: Pod Identity role trust policy](https://docs.aws.amazon.com/eks/latest/userguide/pod-id-role.html) and [session tags](https://docs.aws.amazon.com/eks/latest/userguide/pod-id-abac.html)
  Trust policy for pods.eks.amazonaws.com with sts:AssumeRole + sts:TagSession, tag keys for conditions/ABAC. Use for: writing the IAM role.
- [Amazon EKS: Comparing EKS Pod Identity and IRSA](https://docs.aws.amazon.com/eks/latest/userguide/service-accounts.html)
  AWS's comparison table and recommendation for Pod Identity. Use for: the Pod Identity vs IRSA discussion.
- [Amazon EKS: IAM roles for service accounts](https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html)
  IRSA via OIDC provider and AssumeRoleWithWebIdentity. Use for: clusters outside EKS or legacy setups.
- [Amazon EKS: Restrict Pod traffic with network policies (VPC CNI)](https://docs.aws.amazon.com/eks/latest/userguide/cni-network-policy-configure.html)
  `enableNetworkPolicy` add-on config, version and kernel prerequisites. Use for: the infra behind lesson 04.
- [AWS Secrets Manager: Create a secret](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html)
  Console and CLI creation of JSON key/value secrets. Use for: creating demo secrets.
- [AWS Secrets Manager pricing](https://aws.amazon.com/secrets-manager/pricing/) / [Amazon EKS pricing](https://aws.amazon.com/eks/pricing/)
  $0.40/secret/month + $0.05/10k calls; EKS $0.10/cluster/hour. Use for: cost warnings.
- [Kubernetes: Secrets, "Using Secrets as files from a Pod"](https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod)
  Mounted Secrets update eventually; subPath mounts do not. Use for: rotation behaviour in Pods.
- [GitHub Docs: Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
  Rotate first; rewritten history still lives in clones and forks. Use for: "why not in Git".
- [terraform-aws-modules/eks](https://registry.terraform.io/modules/terraform-aws-modules/eks/aws/21.29.0) and [terraform-aws-modules/vpc](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/6.7.3)
  Modules used in infra/. Use for: changing the demo cluster.

### 04 NetworkPolicy

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

- [Kubernetes Network Policy Recipes](https://github.com/ahmetb/kubernetes-network-policy-recipes)
  Ready-made NetworkPolicy examples with use cases and try-it steps. Use for: starting points. Caveat: recipe 14 as published also blocks in-cluster egress (tested 2026-10-22); add `namespaceSelector: {}`.
- [Tigera Academy: Calico course CCO-L1](https://apps.academy.tigera.io/learning/course/course-v1:tigera+CCO-L1+CCO-L1-2021/home)
  Free hands-on Calico networking and network policy course. Use for: practice after lesson 04.

### 05 DaemonSets

- [Kubernetes: DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)
  Concept page: scheduling, automatic tolerations, update behaviour, alternatives. **Primary source recommended in the lesson.**
- [Kubernetes: Perform a Rolling Update on a DaemonSet](https://kubernetes.io/docs/tasks/manage-daemon/update-daemon-set/)
  RollingUpdate vs OnDelete, maxUnavailable, maxSurge. Use for: upgrade questions.
- [Kubernetes: Pod Priority and Preemption](https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/)
  Built-in system-node-critical / system-cluster-critical classes. Use for: making agents survive full nodes.

## Wisdom (Communities)

- [Kubernetes Slack](https://slack.k8s.io/) — #kubernetes-novice, #sig-auth, #sig-network. Use for: real-world questions after the session.
- [External Secrets Operator Slack (#external-secrets on Kubernetes Slack)](https://external-secrets.io/latest/) — maintainers answer provider/auth questions.

## Gaps

- (02 RBAC) - No official doc states "one ServiceAccount per workload" verbatim; closest is RBAC "ServiceAccount permissions" ranking an application-specific SA as best practice.
