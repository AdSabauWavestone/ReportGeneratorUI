# 🧾 Report Generator UI

---

## 🚀 Tech Stack

- ⚡ Vite
- ⚛️ React
- 🧠 React Compiler
- 🧭 React Router
- 🌍 i18n (react-i18next)
- 🐻 Zustand (state management)
- 🎨 CSS Modules
- 🔌 Fetch API (custom API layer)
- 📄 JSON-based report templates

---

## 📁 Project Structure

```
src/
  app/
  components/
  pages/
  store/
  services/
  i18n/
  resources/
  utils/
  styles/
  types/
```

---

## 🧰 Setup Guide (WSL + NVM)

### Install NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

---

### Install Node

```bash
nvm install 22
nvm use 22
nvm alias default 22
```

---

### Install dependencies

```bash
npm install
```

---

### Run the app

```bash
npm run dev
```

Open:

http://localhost:3000

---

## 🌍 Internationalization

All user-facing strings must use translation keys.

Example:

```tsx
const { t } = useTranslation();
<h1>{t("app.title")}</h1>;
```

---

## 📄 Report Templates

Located in:

```
src/resources/reportTemplates.json
```

Recursive format:

```json
{
  "Sanierungsplan für Finanzinstitute": {
    "content": "",
    "Inhaltsverzeichnis": {
      "content": "...",
      "1. Section": {
        "content": "..."
      }
    }
  }
}
```

---

## 🧠 State Management

Using Zustand.

```
src/store/
```

---

## 🔌 API Layer

```
src/services/http/
```

Includes:

- apiClient
- apiError
- apiMessages

---

## 🎨 Styling

CSS Modules + variables:

```
src/styles/variables.css
```

---

## ⚠️ Rules

- No hardcoded strings
- No Tailwind
- Use JSON templates
- Keep clean architecture

---

## 🧪 Build

```bash
npm run build
npm run preview
```

---

## 🆘 Troubleshooting

```bash
node -v
npm -v
pwd
```
