# Deploying Ask my portfolio

The static site deploys as before: `deploy.yml` copies `dist/` to `/var/www/nathanzimmerman.com`. The
Ask my portfolio API is one extra container on the same VM, following Know Ball's
[ADR 0006](https://github.com/natezimm/know-ball/blob/main/docs/adr/0006-one-image-pulled-by-the-vm.md):
`.github/workflows/ask.yml` builds the index and an image in CI, pushes it to GHCR as
`ghcr.io/natezimm/nathanzimmerman-ask`, and the VM pulls it. The host's nginx forwards
`https://nathanzimmerman.com/api/ask` to the container on `127.0.0.1:8095`, so the API is same-origin
and needs no CORS.

| File                    | On the VM                                   | What it is                                                                                                     |
| ----------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `deploy/compose.yaml`   | `~/portfolio-ask/compose.yaml`              | The container, with a 256 MB memory cap, read-only filesystem and no privileges. CI copies it on every deploy. |
| (none)                  | `~/portfolio-ask/.env`                      | The key and the kill switch. Created by the first deploy, edited by hand, never committed.                     |
| `deploy/nginx-ask.conf` | inside the nathanzimmerman.com server block | The `location` that forwards `/api/ask`. Installed once by hand.                                               |

## What runs when

- **Every push to `main`** that touches the API, its docs or the project data rebuilds the index,
  pushes a new image and deploys it.
- **Every night at 09:17 UTC** the workflow compares the commits the live index was built from
  (`/api/ask/meta`) with the head of each repository, and rebuilds and redeploys only if one moved.
  So a change to a sibling's docs reaches the site within a day, with no PR and no manual step. If
  the run fails, GitHub emails you like any failed workflow, and the old index keeps serving.
- **Run workflow** on the Actions tab does a full rebuild and deploy at any time.

The deploy uses the same `GCP_HOST`, `GCP_USER`, `GCP_SSH_KEY` and `GCP_KNOWN_HOSTS` secrets as the
site's deploy. It logs in to GHCR with the job's own short-lived token, kept in
`~/.docker-portfolio-ask` so it never collides with another app's deploy.

## One-time setup

1. **Merge to `main`.** The first deploy creates `~/portfolio-ask/.env` with `ASK_ENABLED=false` and
   an empty key, starts the container and checks `http://127.0.0.1:8095/api/ask/health` on the VM.
   Nothing calls Anthropic while the switch is off.
2. **Install the nginx location.** Paste `deploy/nginx-ask.conf` into the HTTPS `server` block for
   `nathanzimmerman.com` (in `/etc/nginx/sites-available/`), above `location /`, then:

   ```sh
   sudo nginx -t && sudo systemctl reload nginx
   curl -f https://nathanzimmerman.com/api/ask/health
   ```

   Until this is done the deploy passes with a warning that the public endpoint does not answer.

3. **Add the key, when launching.** Create a dedicated Anthropic workspace, load $10 of prepaid
   credit with auto-reload off, and make a key in that workspace only. Then on the VM:

   ```sh
   cd ~/portfolio-ask
   chmod 600 .env
   nano .env            # set ANTHROPIC_API_KEY=... and, to launch, ASK_ENABLED=true
   docker compose up -d
   ```

   The key never goes in GitHub, the image or a `VITE_` variable.

## Pausing it

Set `ASK_ENABLED=false` in `~/portfolio-ask/.env` and run `docker compose up -d` (a few seconds).
Every model call is refused, `/api/ask/meta` reports `enabled: false`, and the section shows that
Ask is paused. `docker compose stop` has the same visible effect. To cut spending off entirely,
revoke the key in the Anthropic Console.

## Checking on it

```sh
cd ~/portfolio-ask
docker compose ps
docker compose logs --tail 50 ask     # one line per question: outcome, score, tokens, time; never the question
docker stats --no-stream portfolio-ask-ask-1
```

## Memory

Measured locally with this image under the same 256 MB cap, read-only filesystem and dropped
capabilities, with Anthropic replaced by a local stub: 98 MB right after start, 121 MB after 51
questions. The siblings' containers on the VM add up to about 600 MB, so this takes the VM to about
720 MB of 2 GB. If the container ever hits the cap, Docker restarts only it, and the section shows
the paused state meanwhile.
