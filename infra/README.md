# Infrastructure

Terraform for the GCP project the apps run in: the VM, its static address and web firewall rules,
and the monitoring that watches every app from outside the VM. Nothing here is applied by CI; CI only
checks that it is formatted and valid.

| File            | What it holds                                                                 |
| --------------- | ----------------------------------------------------------------------------- |
| `compute.tf`    | The VM, its static address, and the HTTP and HTTPS firewall rules             |
| `imports.tf`    | Import blocks that adopt those as they already are                            |
| `monitoring.tf` | Uptime checks, down, certificate and health alerts, SLOs and burn-rate alerts |
| `slos.md`       | The targets, why they are what they are, and what an alert asks of you        |
| `status-page/`  | Config for a public Upptime status page                                       |

Real values (project, VM name, domains, alert email) go in `terraform.tfvars` and `backend.hcl`,
which are git-ignored. The examples beside them show the shape.

## First run

From Cloud Shell or a machine with `gcloud auth application-default login`:

```sh
cd infra
cp terraform.tfvars.example terraform.tfvars   # fill in
cp backend.hcl.example backend.hcl             # make the bucket it names first
terraform init -backend-config=backend.hcl
terraform plan
```

The first plan imports the VM, its address and the two firewall rules. **Read it before applying.**
It should show those as imported with no changes, or in-place updates you agree with, and create only
monitoring resources. If it wants to replace or destroy the VM or its address, stop: the VM differs
from `compute.tf` somewhere `ignore_changes` doesn't cover, so fix `compute.tf` to match the VM rather
than letting Terraform change it. Both have `prevent_destroy`, so an apply refuses to delete them anyway.

Then `terraform apply`. Google emails the alert address once to confirm the channel.

### Wheelhouse's own script

`wheelhouse/deploy/monitoring.sh` made checks and alerts for the Wheelhouse domains before this.
Once these are applied, delete the script's ones under **Monitoring → Uptime checks** and
**Monitoring → Alerting** (they are named "Wheelhouse <domain> ..."), or you get two emails per outage.
Terraform's `healthy_contains` setting stands in for the script's calendar check.

## Changing things

Edit, `terraform plan`, read it, `terraform apply`. The state is in the bucket with versioning, so an
older one can be restored. A new site is one more entry in `sites`.

## Cost

Everything here is in Google's free allowances: uptime checks and alert policies for a handful of
sites, custom services and SLOs, and a state bucket of a few kilobytes. The VM is the only thing billed,
as it already is.
