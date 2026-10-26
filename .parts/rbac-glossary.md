**Authentication (authn)**: The API server's check of who sent a request; its result is a username plus groups.
_Avoid_: login, auth (ambiguous).

**Authorization (authz)**: The API server's decision whether that username and its groups may perform the request; in this course, decided by RBAC.
_Avoid_: permissions check, auth (ambiguous).

**RBAC (Role-Based Access Control)**: The Kubernetes authorization mode in which allow-only rules in Roles/ClusterRoles are granted to subjects through bindings.
_Avoid_: access control lists, ACLs.

**Subject**: The receiver of a binding: a User, a Group or a ServiceAccount.
_Avoid_: principal (AWS term; use only for IAM), account.

**ServiceAccount**: A namespaced Kubernetes object that gives Pods an identity; its username is `system:serviceaccount:<namespace>:<name>`.
_Avoid_: service user, SA (in prose; fine in code comments).

**Rule**: One allow entry in a Role: a set of verbs on a set of resources in a set of apiGroups.
_Avoid_: policy, permission (when meaning the YAML entry).

**Role / ClusterRole**: An object listing rules; a Role is valid in one namespace, a ClusterRole is a cluster-wide definition.
_Avoid_: policy.

**RoleBinding / ClusterRoleBinding**: An object granting one Role or ClusterRole (its `roleRef`) to subjects; a RoleBinding grants in its own namespace only, a ClusterRoleBinding grants cluster-wide.
_Avoid_: assignment, role mapping.

**Default deny**: The rule that a request no rule allows is refused (HTTP 403); RBAC has no deny rules, so permissions only add up.
_Avoid_: implicit deny, whitelist.

**Impersonation**: Sending a request as another user or ServiceAccount with `kubectl --as`, allowed only to holders of the `impersonate` verb.
_Avoid_: sudo, run as.

**EKS access entry**: An EKS object that maps one IAM principal to Kubernetes permissions, via an access policy or Kubernetes group names.
_Avoid_: aws-auth mapping (the legacy mechanism).
