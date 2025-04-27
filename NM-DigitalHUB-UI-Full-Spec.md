# אפיון מלא לפיתוח מערכת NM-DigitalHUB-UI

---

## 1. מטרת המערכת

פיתוח ממשק ניהול מודרני לניהול מכשירי Apple (MDM) באמצעות חיבור ל-API של MicroMDM, כולל:

- התחברות באמצעות API Token  
- ניהול מכשירים (רשימה, סטטוס, פרטים)  
- ניהול פרופילים (התקנה, הסרה)  
- שליחת פקודות (Lock, Wipe וכו’)  
- קבלת התראות (Push Notifications)  
- ניהול משתמשים והרשאות (admin / user)  
- תמיכה במצב כהה/בהיר (Dark Mode / Light Mode)  
- תיעוד API מובנה  
- קובץ Postman לייבוא ואימות  

---

## 2. טכנולוגיות נדרשות

| תחום                  | טכנולוגיה                                        |
|-----------------------|----------------------------------------------------|
| Frontend              | React 18                                           |
| ניהול ראוטינג         | React Router v6                                    |
| בניית פרויקט         | Vite                                               |
| קריאות HTTP/HTTPS     | Axios                                              |
| סטייל בסיסי          | CSS Modules או Styled Components                   |
| Authentication        | API Token + session ב־localStorage                 |
| מצב כהה/בהיר          | CSS variables + attribute `data-theme`              |
| Reverse Proxy & SSL   | Nginx + Let’s Encrypt או תעודה ידנית               |
| קונפיגורציה           | `install.sh` + `nginx.conf`                        |
| תיעוד                 | Markdown (`README.md`, `API_Documentation.md`)     |

---

## 3. מבנה תיקיות וקבצים

```
NM-DigitalHUB-UI/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── LoadingScreen.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Devices.jsx
│   │   ├── Profiles.jsx
│   │   ├── Notifications.jsx
│   │   └── UserManagement.jsx
│   ├── api/
│   │   └── micromdm.js
│   ├── App.jsx
│   ├── config.js
│   └── main.jsx
├── docs/
│   ├── API_Flow_Diagram.png
│   ├── API_Flow_Diagram.pdf
│   └── thumbnail_api_diagram.png
├── users.json
├── package.json
├── vite.config.js
├── README.md
├── API_Documentation.md
├── NM-DigitalHUB-API-Collection.json
├── LICENSE
├── install.sh
└── nginx.conf
```

---

## 4. תיאור פונקציונלי של כל רכיב

| קובץ / רכיב                           | תיאור                                                                 |
|---------------------------------------|------------------------------------------------------------------------|
| **App.jsx**                           | רכיב ROOT, מנהל את ה-Routes (Loading, Login, Dashboard)               |
| **LoadingScreen.jsx**                 | מסך טעינה עם לוגו וספינר                                                |
| **Login.jsx**                         | עמוד התחברות (Username, Password, API Token, כפתור Login)              |
| **Dashboard.jsx**                     | דשבורד ראשי עם סיידבר, כרטיסי סטטיסטיקה וניהול תצוגה                  |
| **Devices.jsx**                       | טבלה של מכשירים (UDID, Model, OS Version) + קריאה ל-GET `/v1/devices` |
| **Profiles.jsx**                      | ניהול פרופילים (התקנה/הסרה) via POST `/v1/profiles`                   |
| **Notifications.jsx**                 | הצגת היסטוריית Push Notifications                                       |
| **UserManagement.jsx**                | ממשק לניהול משתמשים (CRUD) – רק עבור תפקיד admin                       |
| **micromdm.js** (src/api)             | axios instance + קריאות API (getDevices, sendCommand, installProfile)   |
| **config.js**                         | קביעת `API_URL` ו־`API_TOKEN` מתוך localStorage                        |
| **users.json**                        | קובץ בסיסי של משתמשים (admin, user)                                    |
| **install.sh**                        | סקריפט התקנה: `npm install` + `npm run build`                         |
| **nginx.conf**                        | קונפיגורציה ל-Nginx, העברת `/ui/` ל־build                              |
| **README.md**                         | תיעוד כללי: התקנה, הפעלה, תכונות                                      |
| **API_Documentation.md**              | תיעוד מפורט של כל הקריאות ל-API                                       |
| **NM-DigitalHUB-API-Collection.json** | קובץ Postman Collection עם דוגמאות מלאות                              |
| **LICENSE**                           | MIT License                                                            |

---

## 5. הגדרות קונפיגורציה (Frontend)

| פרמטר          | ערך דוגמה                                 |
|----------------|-------------------------------------------|
| **API_URL**    | `https://mdm.nm-digitalhub.com`           |
| **BASE_PATH**  | `/ui/`                                    |
| **API_TOKEN**  | `localStorage.getItem('api_token')`       |
| **Dark Mode**  | CSS variable toggled ע”י `data-theme`     |

---

## 6. פרטי שרת MicroMDM (פריסה והרצה)

### 6.1. סביבה ופריסה

- **דומיין ציבורי**: `mdm.nm-digitalhub.com`  
- **פורט פנימי**: `7082` (Micromdm serve listening)  
- **כתובת פנימית**: `127.0.0.1:7082`  
- **SSL / TLS**:  
  - HTTPS בדומיין → Let’s Encrypt  
  - **APNS Push Certificate**:  
    - תעודה: `/etc/micromdm/certs/push-cert.pem`  
    - מפתח פרטי: `/etc/micromdm/certs/PushCertificatePrivateKey.key`  
- **Base Directory**: `/etc/micromdm/`  
  - `config.yaml`  
  - תיקיית `certs/`  
  - קובץ DB: `micromdm.db`

### 6.2. קובץ `config.yaml` (דוגמה)

```yaml
# /etc/micromdm/config.yaml
server_url: "https://mdm.nm-digitalhub.com"
http_addr: "127.0.0.1:7082"

# API token (ל-mdmctl ולשליטה)
api_key: "YOUR_API_TOKEN"

# SQLite DB (ברירת מחדל)
db: "/etc/micromdm/micromdm.db"

# שורש אחסון קבצים
file_repo: "/var/db/micromdm/filerepo"

# APNS (Push)
push:
  certificate: "/etc/micromdm/certs/push-cert.pem"
  key:         "/etc/micromdm/certs/PushCertificatePrivateKey.key"

# DEP Sync (אם קיים)
depsync:
  token: "/etc/micromdm/deptoken.jwt"
```

### 6.3. systemd Service

```ini
# /etc/systemd/system/micromdm.service
[Unit]
Description=MicroMDM Server
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/vhosts/nm-digitalhub.com/mdm.nm-digitalhub.com
ExecStart=/var/www/vhosts/nm-digitalhub.com/mdm.nm-digitalhub.com/micromdm/build/linux/micromdm \
  serve \
  -config-path /etc/micromdm \
  -server-url https://mdm.nm-digitalhub.com \
  -http-addr 127.0.0.1:7082
Restart=always
RestartSec=5
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

**להפעלה:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable micromdm
sudo systemctl start micromdm
sudo systemctl status micromdm
```

---

## 7. אבני דרך בפיתוח

| שלב | תיאור                                                         |
|------|---------------------------------------------------------------|
| 1    | יצירת שלד תיקיות (`public/`, `src/`, `docs/`)                |
| 2    | פיתוח **LoadingScreen.jsx** (עמוד טעינה עם לוגו וספינר)       |
| 3    | פיתוח **Login.jsx** + אימות Token                             |
| 4    | פיתוח **Dashboard.jsx** + מבנה ראשי                           |
| 5    | חיבור ל-API (**micromdm.js**)                                  |
| 6    | פיתוח **Devices.jsx** ו-**Profiles.jsx**                       |
| 7    | פיתוח **Notifications.jsx** (Push Notifications)              |
| 8    | פיתוח **UserManagement.jsx** (Admin only)                     |
| 9    | כתיבת **install.sh** + **nginx.conf**                         |
| 10   | יצירת Postman Collection & תיעוד **API_Documentation.md**     |
| 11   | בדיקות אינטגרציה, טעינת Server ו-UI                           |

---

## 8. Roadmap פיתוח עתידי

| שלב | יעד                     | תיאור                                                         |
|-----|-------------------------|---------------------------------------------------------------|
| 1   | מערכת הרשאות משודרגת   | תפקידים נוספים, קבוצות, הרשאות כתיבה/קריאה בלבד               |
| 2   | MFA (דו-שלבי)          | שילוב Google Authenticator או SMS                            |
| 3   | ניהול קבוצות מכשירים  | שיוך מכשירים לקבוצות והחלת פרופילים מרוכזים                   |
| 4   | דוחות PDF              | ייצוא דוחות מכשירים/פקודות ב-PDF                            |
| 5   | תזמון פקודות          | שליחת פקודות בזמנים קבועים מראש                             |
| 6   | UI מתקדם למשתמשים     | ממשק גרפי לניהול משתמשים (CRUD מלא)                         |
| 7   | אינטגרציה חיצונית     | חיבור ל-Active Directory, Google Workspace ועוד               |

---

## 9. הוראות ל-Production Build

```bash
# התקנת תלויות
npm install

# יצירת Build
npm run build

# העתקת תיקיית dist/ אל:
sudo cp -r dist/ /var/www/vhosts/nm-digitalhub.com/mdm.nm-digitalhub.com/ui/

# בדיקת והטענת קונפיגורציית Nginx
sudo systemctl reload nginx
```

---

## 10. דגש חשוב לאורך הפיתוח

- כל קריאת API חייבת לכלול **Authorization Header**  
- יש לתמוך ב**loading states** להצגת ספינרים בזמן קריאות  
- ניהול **session**: במידה ואין token → Redirect ל-Login  
- שמירה מאובטחת של קבצים בשרת (`/etc/micromdm/`, `/var/db/micromdm/`)  

---

## 11. UI Mockups (אלטרנטיבה ל-תמונות)

### 11.1 Loading Screen

```
+-------------------------------------------------+
|                                                 |
|                 [ NM-DigitalHUB Logo ]          |
|                                                 |
|                   Loading…                      |
|                                                 |
+-------------------------------------------------+
```

### 11.2 Login Screen

```
+----------------------------+
|        NM-DigitalHUB       |
|                            |
|  Username   [__________]   |
|  Password   [__________]   |
|  API Token  [__________]   |
|                            |
|      [   Login Button   ]  |
+----------------------------+
```

### 11.3 Dashboard Layout

```
+-------------------------------------------------------------+
| [≡] NM-DigitalHUB     Dark/Light Toggle    Logout (⏻)       |
+------+------------------------------------------------------+
| Side | Dashboard  Devices  Profiles  Notifications  Users   |
| bar  |                                                      |
|      | • Total Devices: 12                                  |
|      | • Connected: 8                                       |
|      | • Pending Commands: 5                                |
|      |                                                      |
+------+------------------------------------------------------+
```

### 11.4 Devices Screen (Table View)

```
+-------------------------------------------------+
| UDID                | Model       | OS Version  |
+-------------------------------------------------+
| ABC123              | iPhone 12   | iOS 17.4     |
| XYZ789              | iPad Pro    | iPadOS 17.4  |
+-------------------------------------------------+
```

### 11.5 CSS Variables (Dark/Light)

```css
:root {
  --bg: #f5f5f5;
  --bg-alt: #ffffff;
  --card: #ffffff;
  --text: #333333;
  --border: #dddddd;
  --accent: #007bff;
}

[data-theme="dark"] {
  --bg: #1e1e1e;
  --bg-alt: #2e2e2e;
  --card: #2e2e2e;
  --text: #f1f1f1;
  --border: #444444;
  --accent: #66aaff;
}
```

---

*המסמך מוכן להעלאה ל-HackMD.io*  
