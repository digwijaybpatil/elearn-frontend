# 📘 Elearn Frontend (React)

This is the **frontend application** for the **Elearn Portal**, built using **React.js**.  
It displays courses, allows adding new courses, and communicates with the backend API deployed on an Azure VM.

This document explains **local setup**, **production deployment**, **Nginx configuration**, and **CI/CD using GitHub Actions**.

---

# 🚀 1. Local Development Setup

## ✅ 1.1 Prerequisites

Install the following:

- **Node.js (LTS version 18+)** → https://nodejs.org  
- **npm** or **yarn**  
- **Git**  
- **VS Code** (recommended)

---

# 📂 2. Clone the Repository

```sh
git clone https://github.com/<your-org>/elearn-frontend.git
cd elearn-frontend
```

---

# ⚙️ 3. Configure Backend API Endpoint

Update the API URL for Axios calls:

### `src/pages/Home.js`
```js
axios.get('http://<BACKEND-IP>:5000/api/Course')
```

### `src/pages/AddNewCourse.js`
```js
axios.post('http://<BACKEND-IP>:5000/api/Course', courseData)
```

🔥 Replace **<BACKEND-IP**> with your backend server IP  
Example:
```
http://74.225.194.138:5000/api/Course
```

---

# 📦 4. Install Dependencies

```sh
npm install
```

---

# 🏗️ 5. Build the React App (Production)

```sh
npm run build
```

This generates:

```
build/
 ├── index.html
 ├── static/
 ├── js/
 ├── css/
```

---

# 🖥️ 6. Azure VM Deployment (Production Setup)

## ☁️ 6.1 SSH into VM

```sh
ssh -i ~/.ssh/vm-ssh-private-key azureuser@<FRONTEND_VM_IP>
```

---

## 📁 6.2 Create Directory Structure

```sh
sudo mkdir -p /var/www/frontend/current
sudo mkdir -p /var/www/frontend/temp
sudo chown -R azureuser:azureuser /var/www/frontend/
```

---

## 🌐 6.3 Install Nginx

```sh
sudo apt update
sudo apt install nginx -y
```

Start + enable Nginx:

```sh
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## ⚙️ 6.4 Configure Nginx

```sh
sudo nano /etc/nginx/sites-available/frontend
```

Paste:

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/frontend/current;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

Enable config:

```sh
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Your frontend will be available at:

```
http://<FRONTEND_VM_IP>
```

---

# 🤖 7. GitHub Actions Deployment (CI/CD)

### `.github/workflows/deploy-frontend.yml`

```yaml
name: Deploy React App to Azure VM

on:
  push:
    branches: ["main"]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build React App
        run: npm run build

      - name: Upload build folder to Azure VM (TEMP LOCATION)
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.AZURE_VM_IP }}
          username: ${{ secrets.AZURE_VM_USER }}
          key: ${{ secrets.AZURE_SSH_PRIVATE_KEY }}
          source: "build/*"
          target: "/var/www/frontend/temp/"

      - name: Finalize deployment on VM
        uses: appleboy/ssh-action@v1.1.0
        with:
          host: ${{ secrets.AZURE_VM_IP }}
          username: ${{ secrets.AZURE_VM_USER }}
          key: ${{ secrets.AZURE_SSH_PRIVATE_KEY }}
          script: |
            sudo rm -rf /var/www/frontend/current/*
            sudo cp -r /var/www/frontend/temp/* /var/www/frontend/current/
            sudo rm -rf /var/www/frontend/temp
            sudo systemctl restart nginx
```

---

# 🔐 8. GitHub Secrets

| Secret Name | Description |
|-------------|-------------|
| `AZURE_VM_IP` | Public IP of frontend VM |
| `AZURE_VM_USER` | SSH username (azureuser) |
| `AZURE_SSH_PRIVATE_KEY` | Private SSH key |

---

# 🧪 9. Test Deployment

Access frontend:

```
http://<FRONTEND_VM_IP>
```

Test API integration:

- Add a new course  
- View courses  
- Check backend connectivity  

---

# 🛠️ 10. Troubleshooting

### ❌ Blank Page
- Incorrect API URL  
- Build folder not deployed  
- Missing Nginx rewrite  

### ❌ 404 on refresh
Ensure:

```nginx
try_files $uri /index.html;
```

### ❌ API errors
- Backend down  
- Firewall closed  
- Wrong backend URL  
- CORS issues  

---

# 📁 11. Project Structure

```
elearn-frontend
 ├── src/
 │   ├── pages/
 │   ├── components/
 │   ├── services/
 │   ├── App.js
 │   └── index.js
 ├── public/
 ├── build/
 ├── package.json
 ├── .env
 └── README.md
```

---

# 🎯 12. Optional Enhancements

- Move API URL to `.env.production`
- Add HTTPS with Let's Encrypt
- Enable gzip compression in Nginx
- Add monitoring (Grafana/Prometheus)
- Add rolling deployments
