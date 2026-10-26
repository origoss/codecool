## Knowledge

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
