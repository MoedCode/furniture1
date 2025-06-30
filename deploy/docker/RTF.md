# Docker Workflow for **alsalam-backend**

This guide covers Docker commands to:

1. **Start** a new container (`alsalam-backend`) from a base image
2. **Commit** that container into an image (`alsalam-backend-image`)
3. **Run** a fresh container (`alsalam-backend-container`) from the image with port exposure
4. **Start**, **stop**, **connect**, and **attach** to your containers
5. **List** images and containers

---

## 1. Start the initial container

```bash
# Launch an interactive container named 'alsalam-backend'
docker run -it --name alsalam-backend ubuntu:24.04 bash
```

You now have a running container called `alsalam-backend`.

---

## 2. Commit the container to an image

```bash
# Create a new image from the current state of 'alsalam-backend'
docker commit alsalam-backend alsalam-backend-image
```

This saves all changes in `alsalam-backend` into the image `alsalam-backend-image`.

---

## 3. Run a new container from the image

```bash
# Stop and remove the old setup container (optional)
docker stop alsalam-backend && docker rm alsalam-backend

# Start a new container named 'alsalam-backend-container' with port mapping
docker run -it -p 8008:8008 --name alsalam-backend-container alsalam-backend-image bash
```

This maps host port **8008** to the container’s **8008** port.

---

## 4. Manage the 'alsalam-backend-container'

### Start the container

```bash
docker start alsalam-backend-container
```

### Stop the container

```bash
docker stop alsalam-backend-container
```

### Remove the container

```bash
docker rm alsalam-backend-container
```

### Connect (open a shell)

```bash
docker exec -it alsalam-backend-container bash
```

### Attach (view main process logs)

```bash
docker attach alsalam-backend-container
```

*Detach safely with `Ctrl+P` then `Ctrl+Q`*

---

## 5. List images and containers

### List all images named `alsalam-backend-image`

```bash
docker images --filter=reference="alsalam-backend-image"
```

### List all containers named `alsalam-backend-container` (running or stopped)

```bash
docker ps -a --filter "name=alsalam-backend-container"
```

---

With these commands, you can spin up, snapshot, manage, and inspect your `alsalam-backend` Docker workflow efficiently!
