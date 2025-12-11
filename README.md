# 🚀 Project Setup and Git Workflow Guide

This guide explains how to set up the project in **Visual Studio Code** using **Git CLI**, and how to make, commit, and push code changes to the repository.

---

## 🛠️ Setting Up the Project in VS Code

### 1. Clone the Repository

Clone the project from the Git server using the repository URL:

```bash
git clone git@192.168.51.38:ProjectName.git
```

> Replace `ProjectName.git` with your actual project name.

---

### 2. Open the Project in VS Code

Navigate into the cloned project folder and open it in Visual Studio Code:

```bash
cd ProjectName
code .
```

---

### 3. Install Dependencies

Install all required packages using **npm** or **pnpm**:

```bash
npm install
# OR
pnpm install
```

> **Note for pnpm users:** If some scripts are not executed correctly, run:

```bash
pnpm approve-builds
```

- Use the **space bar** to select all packages.
- Press **Y** to confirm and approve.

### 4. Run the project

After installing all required packages using **npm** or **pnpm** run the project using the below command:

```bash
npm run dev # or npm start
# OR
pnpm dev
```

---

## ✍️ Making Changes, Committing, and Pushing

### 1. Set Git User Configuration (if not set)

Configure your Git identity for commits:

```bash
git config user.name "Your Name"
git config user.email "youremail@example.com"
```

---

### 2. Make Code Changes

Make your desired code or file changes using VS Code.

---

### 3. Stage Changes

Stage the files you want to commit:

```bash
git add .
```

> ⚠️ Only stage the files you intend to commit. Avoid including sensitive configuration files unless necessary.

---

### 4. Commit Changes

Commit with a descriptive message and your name:

```bash
git commit -m "Your commit message - Your Name"
```

---

### 5. Push Changes to Remote

Push the committed changes to the remote repository:

```bash
git push -u origin main
```

---

## ✅ Done!

You’ve successfully set up the project, made changes, and pushed them using Git and VS Code. Happy coding! 💻
