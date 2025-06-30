# ***`0x0-`*** **`start a new container load dependence`**

Yes, 100% ✅ — **you can skip building Docker images entirely** and just:

> 🔧 **Create a normal container (Ubuntu-based) manually**, then:
>
> * Install Python and MySQL in it
> * `scp`/`cp` your Django project files into it
> * Install `pip` deps
> * Run migrations & server manually

This is a **valid approach** especially if you're just testing or working on a quick deployment.

---

## ✅ Steps to Create a Simple Ubuntu-based Container with Python + MySQL

### 🔸 Step 1: Start a plain Ubuntu container interactively

```bash
docker run -it --name alsalam-box ubuntu:24.04 bash
```

---

### 🔸 Step 2: Inside the container, install dependencies

Run the following **inside** the container:

```bash
apt update && apt install -y \
  python3.12 python3-pip \
  mysql-server \
  libmysqlclient-dev \
  build-essential \
  default-libmysqlclient-dev \
  libjpeg-dev \
  git vim curl
```


✅ You're almost there — here’s what your output means and what to do next:

---

### 🔎 What happened?

* You successfully created:

  ```bash
  ln -s /usr/bin/python3.12 /usr/bin/python
  ```

  ✅ Now `python` points to Python 3.12 — perfect.

* But the second command failed:

  ```bash
  ln -s /usr/bin/python3.12 /usr/bin/python3
  ```

  because `/usr/bin/python3` **already exists**.

---

### ✅ What should you do?

**No need to worry.** Ubuntu already links `python3` to the correct Python (3.12). You can confirm with:

```bash
python3 --version
```

As long as both work:

```bash
python --version
python3 --version
```

You're good to go.

---

### ✅ Next Steps

Now that:

* MySQL is running ✅
* Python 3.12 and pip are installed ✅
* `python` and `python3` work ✅

👉 Copy your project into the container from the host:

```bash
docker cp ~/Alsalam_Furniture-moving/. alsalam-backend:/app
```

Then inside the container:

```bash
cd /app
pip install --no-cache-dir -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8008
```

Let me know if you want me to generate a shell script to auto-setup everything inside the container.


### ✅ Summary

| What You Get            | How                         |
| ----------------------- | --------------------------- |
| Ubuntu container        | `docker run -it ubuntu`     |
| Python + MySQL manually | Installed inside with `apt` |
| Django project          | Copied via `docker cp`      |
| Persistent container    | Use `docker commit`         |

Let me know if you want me to generate all commands in one block or create a base Dockerfile from the running container later (`docker commit`).

---
# ***`0x1-`*** **`install mysql`**
---
Perfect ✅ — you’re now **inside a fresh Ubuntu 24.04 container** named `alsalam-backend`.
Let’s turn it into your custom Django + MySQL box.

---

## 🔧 Step-by-Step Setup Inside the Container

### ✅ 1. Update packages and install required software

Paste this inside the container:

```bash
apt update && apt install -y \
  python3.12 \
  python3-pip \
  mysql-server \
  default-libmysqlclient-dev \
  libjpeg-dev \
  build-essential \
  curl vim git
```

---

### ✅ 2. Start the MySQL service

```bash
service mysql start
```

You can check it with:

```bash
mysql -u root -e "SELECT VERSION();"
```

---

### ✅ 3. Create a database and user (optional, or do it from Django)

```bash
mysql -u root <<EOF
CREATE DATABASE alsalam CHARACTER SET UTF8MB4 COLLATE utf8mb4_general_ci;
CREATE USER 'alsalam'@'localhost' IDENTIFIED BY 'secretpassword';
GRANT ALL PRIVILEGES ON alsalam.* TO 'alsalam'@'localhost';
FLUSH PRIVILEGES;
EOF
```

---

### ✅ 4. Prepare Django app

You can now **open another terminal** on your host and run:

```bash
docker cp ~/Alsalam_Furniture-moving/. alsalam-backend:/app
```


# ***`0x2- commit to image`***

**1. Commit the existing container to an image**

```bash
# Take your running container “alsalam-backend” and snapshot it as an image
docker commit alsalam-backend alsalam-backend-image
```

**2. Run a new container from that image**

```bash
# Create and drop into a fresh container named “alsalam-backend-container”,
# binding host port 8008 to container port 8008
docker run -it -p 8008:8008 \
  --name alsalam-backend-container \
  alsalam-backend-image bash
```

Inside the new container, activate and launch Django:

```bash
source /venv/bin/activate
python manage.py runserver 0.0.0.0:8008
```

---

**3. Stopping and removing the container**

```bash
# Gracefully stop the server/container
docker stop alsalam-backend-container

# (Optional) Remove it entirely
docker rm alsalam-backend-container
```

---

**4. Starting and reconnecting to the container**

```bash
# Start a stopped container
docker start alsalam-backend-container

# Open a new shell session inside it
docker exec -it alsalam-backend-container bash
```

---

**5. (Alternative) Attaching to its main process**

```bash
# Attach your terminal’s stdin/stdout to the container’s primary process
docker attach alsalam-backend-container
# Detach without stopping: Ctrl + P then Ctrl + Q
```
