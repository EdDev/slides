## Build reveal.js image

```bash
sudo podman build --no-cache --rm -t edwardhaas/reveal.js -f Dokerfile.reveal.js .
```
## Run the server

```bash
sudo podman run --rm -ti -v $PWD:/workspace:Z localhost/edwardhaas/reveal.js \
    /bin/bash -c "cd /workspace && npm install && npm start -- --host=0.0.0.0"
```
