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
