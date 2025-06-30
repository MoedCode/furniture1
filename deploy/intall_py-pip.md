Here’s how to get **Python 3.11** (matching your local) and the latest **pip** on Ubuntu 24.04:

---

## 1. Install Python 3.11

Ubuntu 24.04’s default **python3** is 3.10, so we’ll add the **deadsnakes** PPA to install 3.11:

```bash
sudo apt update
sudo apt install -y software-properties-common

# Add the deadsnakes repository
sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt update

# Install Python 3.11 and the venv/distutils packages
sudo apt install -y python3.11 python3.11-venv python3.11-distutils
```

## 2. Make `python` point to Python 3.11 (optional)

If you want the command `python` to invoke 3.11, register it via `update-alternatives`:

```bash
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.11 1
# You can switch between versions with:
sudo update-alternatives --config python
```

## 3. Install the latest pip for Python 3.11

The Ubuntu `python3-pip` package will give you pip for the system’s default Python (3.10), so to get pip 25.x for 3.11:

```bash
# Download the official get-pip script
curl -fsSL https://bootstrap.pypa.io/get-pip.py -o get-pip.py

# Install pip into the system (or use --user for a user‐local install)
sudo python3.11 get-pip.py

# Verify
python3.11 --version     # should say Python 3.11.x
pip3.11 --version        # should say pip 25.x from ...python3.11...
```

If you’d rather install pip just for your non-root user:

```bash
python3.11 get-pip.py --user
# Then adjust your PATH if needed:
export PATH="$HOME/.local/bin:$PATH"
```

## 4. (Optional) Symlink `pip` to `pip3.11`

```bash
sudo update-alternatives --install /usr/bin/pip pip /usr/bin/pip3.11 1
# Switch if you have multiple pip versions:
sudo update-alternatives --config pip
```

---

After that, running:

```bash
python --version
pip --version
```

should output something like:

```
Python 3.11.12
pip 25.x.x from /usr/local/lib/python3.11/site-packages/pip (python 3.11)
```

matching your local setup.
