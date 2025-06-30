

---

# 🔧 Step 1: Install Python 3.12 and pip in Ubuntu 24.04 container

You're on Ubuntu 24.04, which supports Python 3.12 from official repos:

```bash
apt update && apt install -y python3.12 python3-pip
```

After that, verify:

```bash
python3.12 --version
pip --version
```

---

## 🔧 Step 2: Create a symbolic link so `python` and `python3` point to Python 3.12

```bash
ln -s /usr/bin/python3.12 /usr/bin/python
ln -s /usr/bin/python3.12 /usr/bin/python3
```

Now test again:

```bash
python --version
python3 --version
```

You should see:

```bash
Python 3.12.x
```

---

## ✅ Next Step (once Python works):

From **your host**, copy the project into the container:

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

---

If you want, I can generate a full bash script to **automate all steps inside the container** — just say the word.
✅ You're almost there — here’s what your output means and what to do next:

---

# 🔎 What might happened?

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
