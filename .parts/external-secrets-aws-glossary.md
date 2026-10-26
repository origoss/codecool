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
