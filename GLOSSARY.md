# Config, Secrets & Security Glossary

Canonical vocabulary for the 2h Codecool session: configuration, Secrets, RBAC, External Secrets Operator and NetworkPolicy.

## Terms

**Lesson**: One self-contained HTML study unit teaching a single skill: description, snippets with results, quiz.
_Avoid_: "module", "chapter".

**Reference sheet**: A compressed, printable summary that lessons point to and students return to.
_Avoid_: "cheat sheet" in file names.

### 01 ConfigMap vs Secret

**ConfigMap**: A Kubernetes object holding non-confidential key-value settings (max 1 MiB) that Pods consume as environment variables or mounted files.
_Avoid_: "config file" (it is an API object, not a file).

**Secret**: A Kubernetes object for a small amount of sensitive data (password, token, key; max 1 MiB). Values are base64-encoded, not encrypted.
_Avoid_: "encrypted secret" when you only mean a Kubernetes Secret.

**base64**: A reversible encoding that turns any bytes into text so they fit into YAML/JSON. Anyone can decode it; it gives no confidentiality.
_Avoid_: "encryption", "hashing".

**Secret type**: The `type` field of a Secret (`Opaque`, `kubernetes.io/dockerconfigjson`, `kubernetes.io/tls`, ...) that declares the expected keys; the API server checks required keys for built-in types.
_Avoid_: "Secret kind" (`kind` is always `Secret`).

**Immutable (ConfigMap/Secret)**: `immutable: true` forbids any later change to the data; cannot be reverted, only deleted and recreated.
_Avoid_: "read-only" (that is a volume mount option).

**subPath mount**: A volume mount that places a single file or subfolder at a path; it never receives ConfigMap/Secret updates.
_Avoid_: "single-file mount" without mentioning the no-refresh caveat.

**Encryption at rest**: The API server encrypting objects before writing them to etcd, so disks and backups hold ciphertext. Does not stop anyone allowed to `get` via the API.
_Avoid_: "Secrets are encrypted" without saying where.

**Envelope encryption**: Data is encrypted with a data encryption key (DEK); the DEK is encrypted with a key encryption key (KEK) held in a KMS. EKS 1.28+ does this by default with AWS KMS.
_Avoid_: "KMS encryption" as a vague synonym.

### 02 RBAC

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

**Default deny (RBAC)**: The rule that a request no rule allows is refused (HTTP 403); RBAC has no deny rules, so permissions only add up.
_Avoid_: implicit deny, whitelist.

**Impersonation**: Sending a request as another user or ServiceAccount with `kubectl --as`, allowed only to holders of the `impersonate` verb.
_Avoid_: sudo, run as.

**EKS access entry**: An EKS object that maps one IAM principal to Kubernetes permissions, via an access policy or Kubernetes group names.
_Avoid_: aws-auth mapping (the legacy mechanism).

### 03 AWS Secrets Manager + ESO

**AWS Secrets Manager**: AWS service that stores encrypted, versioned secret values (often JSON key/value), with IAM access control and CloudTrail audit.
_Avoid_: "AWS vault", "Parameter Store" (a different service).

**External Secrets Operator (ESO)**: Kubernetes controller that copies values from an external secret store into Kubernetes Secrets and keeps them in sync.
_Avoid_: "external secret" for the operator itself; "ESO" alone before it was introduced.

**SecretStore**: Namespaced ESO object that says how to reach a provider (service, region, credentials).
_Avoid_: "secret provider", "store config".

**ClusterSecretStore**: Cluster-scoped SecretStore that ExternalSecrets in any (allowed) namespace may reference.
_Avoid_: "global store".

**ExternalSecret**: Namespaced ESO object that says what to fetch, how often (refreshInterval), and which Kubernetes Secret to write.
_Avoid_: "external Secret" (ambiguous with the target Secret).

**Target Secret**: The ordinary Kubernetes Secret an ExternalSecret creates and owns.
_Avoid_: "synced secret", "ESO secret".

**refreshInterval**: How often ESO re-reads the provider for an ExternalSecret; `0` means fetch once.
_Avoid_: "sync period", "TTL".

**EKS Pod Identity**: EKS feature that maps a ServiceAccount to an IAM role via an association; an agent on each node hands Pods temporary credentials.
_Avoid_: "pod role", "IRSA" (a different mechanism).

**Pod Identity association**: The EKS object linking cluster + namespace + ServiceAccount to one IAM role.
_Avoid_: "binding" (that word belongs to RBAC).

**IRSA (IAM Roles for Service Accounts)**: Older mechanism: ServiceAccount annotated with a role ARN; the SDK exchanges a projected OIDC token via AssumeRoleWithWebIdentity.
_Avoid_: "Pod Identity" for IRSA.

**Static access keys**: Long-lived IAM user access key ID + secret key. Avoid for workloads.
_Avoid_: "API token".

### 04 NetworkPolicy

**NetworkPolicy**: A namespaced Kubernetes object that allows traffic to or from selected Pods at the IP/port level (L3/L4); enforced only by a CNI that implements it.
_Avoid_: "firewall rule" (it has no deny rules and no order).

**Isolated Pod**: A Pod selected by at least one NetworkPolicy for a direction (ingress or egress); in that direction only the union of the policies' allow rules gets through.
_Avoid_: "locked Pod", "blocked Pod".

**Default deny (NetworkPolicy)**: A NetworkPolicy with `podSelector: {}` and no rules, which isolates every Pod in its namespace; allow policies are then added on top.
_Avoid_: "deny rule" (NetworkPolicy has none).

**Enforcing CNI**: The network plugin that turns NetworkPolicy objects into packet filtering (on EKS: VPC CNI with network policy enabled; elsewhere e.g. Calico, Cilium).
_Avoid_: "policy controller" when you mean the whole plugin.

**Ingress / Egress (NetworkPolicy)**: Traffic into a selected Pod (`ingress.from`) / out of a selected Pod (`egress.to`). A connection needs both the source's egress and the destination's ingress to allow it.
_Avoid_: confusing with the Ingress API object (HTTP routing into the cluster).

### 05 DaemonSets

**DaemonSet**: A workload controller that runs one copy of a Pod on every eligible node, adding Pods as nodes join and removing them as nodes leave.
_Avoid_: "daemon deployment", "node deployment".

**Taint**: A mark on a node that repels Pods; only Pods with a matching toleration may be scheduled (or stay) there.
_Avoid_: "node block".

**Toleration**: A Pod setting that allows it onto a node with a matching taint; it permits, it does not attract.
_Avoid_: "taint exception".

**nodeSelector**: A Pod-template field listing node labels; the Pod (or DaemonSet Pod) runs only on nodes that carry all of them.
_Avoid_: "node filter".
