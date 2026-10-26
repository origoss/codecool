**NetworkPolicy**: A namespaced Kubernetes object that allows traffic to or from selected Pods at the IP/port level (L3/L4); enforced only by a CNI that implements it.
_Avoid_: "firewall rule" (it has no deny rules and no order).

**Isolated Pod**: A Pod selected by at least one NetworkPolicy for a direction (ingress or egress); in that direction only the union of the policies' allow rules gets through.
_Avoid_: "locked Pod", "blocked Pod".

**Default deny**: A NetworkPolicy with `podSelector: {}` and no rules, which isolates every Pod in its namespace; allow policies are then added on top.
_Avoid_: "deny rule" (NetworkPolicy has none).

**Enforcing CNI**: The network plugin that turns NetworkPolicy objects into packet filtering (on EKS: VPC CNI with network policy enabled; elsewhere e.g. Calico, Cilium).
_Avoid_: "policy controller" when you mean the whole plugin.

**Ingress / Egress (NetworkPolicy)**: Traffic into a selected Pod (`ingress.from`) / out of a selected Pod (`egress.to`). A connection needs both the source's egress and the destination's ingress to allow it.
_Avoid_: confusing with the Ingress API object (HTTP routing into the cluster).
