# Service level objectives

Each public site has one SLO, measured by its Cloud Monitoring uptime check from three regions every
five minutes: **a five-minute window is good when the check passed in it**, and the site must be good
in 99.5% of windows over a rolling 28 days.

| Site            | Checked                       | Target | Error budget (28 days)   |
| --------------- | ----------------------------- | ------ | ------------------------ |
| Portfolio       | `/`                           | 99.5%  | about 3 hours 20 minutes |
| Know Ball       | `/health` (database included) | 99.5%  | about 3 hours 20 minutes |
| Wheelhouse demo | `/health` (database included) | 99.5%  | about 3 hours 20 minutes |

A family's Wheelhouse instance is watched by the same down, certificate and calendar alerts, but has no
published target.

## Why 99.5%

All of them run on one small VM with no failover, and a release restarts containers. Releases take
seconds, a VM restart a few minutes, and an OS upgrade with a reboot perhaps fifteen. 99.5% leaves room
for a bad month of those and still notices a site that is down for an afternoon. 99.9% (40 minutes)
would be a promise one VM can't keep.

## What the alerts mean

| Alert                                    | Fires when                                                              | What to do                                                                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| _Site_ is down                           | The check fails from more than one region for 5 minutes                 | The site's runbook. Usually: is the VM up, is nginx up, is the container up                                            |
| _Site_ certificate expires soon          | Under 14 days left on the HTTPS certificate                             | certbot's renewal stopped: `sudo certbot renew --dry-run` on the VM says why                                           |
| _Site_ is not healthy                    | `/health` answers but without its healthy text for 15 minutes           | For Wheelhouse, the calendar is behind Google: see its runbook                                                         |
| _Site_ is spending its error budget fast | Over an hour, failures would use the month's budget in under three days | The site is flaky rather than down: look for restarts (`docker compose ps`), memory (`free -m`, swap) and slow answers |

The down alert covers a site that is plainly off. The burn-rate alert catches one that keeps failing
now and then, which the down alert's five-minute window misses.

## Where to look

**Monitoring → SLOs** in the console shows each service's budget left. The public status page
(`status-page/`) shows the same sites from GitHub's side, without the alerts.
