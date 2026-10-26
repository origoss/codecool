# RBAC Resources (lesson 0002-rbac)

## Knowledge

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

## Gaps

- No official doc states "one ServiceAccount per workload" verbatim; closest is RBAC "ServiceAccount permissions" ranking an application-specific SA as best practice.
