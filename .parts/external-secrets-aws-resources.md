# Resources from lesson 0003 (external-secrets-aws)

## Knowledge

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
