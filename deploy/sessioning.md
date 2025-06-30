Absolutely—here’s the guide with **tmux first**, followed by `nohup`, then `screen`:

---

## 🖥️ Option 1: `tmux` (Great for Session Management)

1. **Start a session**

   ```bash
   tmux new -s mysession
   ```
1. **extend session length**
```bash
tmux set-option history-limit 100000
```
2. **Run your command**

   ```bash
   python your_script.py
   ```
3. **Detach (leave running)**

   * Press <kbd>Ctrl</kbd>+<kbd>B</kbd>, then <kbd>D</kbd>
4. **Reattach later**

   ```bash
   tmux attach -t mysession
   ```
5. **Kill session when done**

   ```bash
   tmux kill-session -t mysession
   ```

---

## 🚀 Option 2: `nohup` (Simple & Common)

```bash
nohup python your_script.py > output.log 2>&1 &
```

* 🔒 **Keeps alive** when you log out
* ▶️ Redirect output & errors: `> output.log 2>&1`
* 🔄 Run in background: `&`

📝 *Check progress:*

```bash
tail -f output.log
```

---

## 🎥 Option 3: `screen` (Classic Alternative)

```bash
screen -S myprocess
# → run your_script.py inside
# → detach with Ctrl+A then D
```

* 🔍 **List sessions:**

  ```bash
  screen -ls
  ```
* 🛑 **Terminate a session:**

  ```bash
  screen -X -S <session_id> quit
  ```

---

# 🔎 Checking Your Background Jobs

### 🕵️ tmux

```bash
tmux ls
```

Lists active tmux sessions (e.g. `mysession: 1 windows …`).

### 🕵️ screen

```bash
screen -ls
```

Shows your detached screen sessions.

### 🕵️ nohup processes

```bash
ps aux | grep nohup
```

Or search by command name:

```bash
ps aux | grep python
```

### 🕵️ Shell jobs

If you started with `&` in the current shell:

```bash
jobs
```

---

Feel free to let me know if you’d like any further tweaks!
