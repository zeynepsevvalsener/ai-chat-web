Thought for a couple of seconds

```markdown
# Canlı Destek Chat Uygulaması (Lokal Çalışma)

Bu proje, React tabanlı bir frontend ile Firebase ve bir Node.js API Gateway kullanarak LLM destekli canlı sohbeti **sadece yerel** olarak çalıştırmanızı sağlar.

---

## Özellikler

- **Gerçek zamanlı sohbet**: Firestore üzerinden anlık kullanıcı–bot mesajlaşması  
- **LLM entegrasyonu**: Gateway’in OpenAI veya başka bir LLM servisine proxy yapması  
- **Kolay lokal setup**: Tek komutla frontend ve gateway ayağa kalkar  

---

## Önkoşullar

- Node.js (v16+)  
- npm veya yarn  
- Firebase projesi ve Firestore ayarları  
- OpenAI API anahtarı (veya benzer bir LLM servisi)

---

## Proje Yapısı

```
/
├── api-gateway/          # Express + http-proxy-middleware
│   ├── gateway.js
│   └── .env              # Gateway’e ait ortam değişkenleri
└── web/                  # React (Vite) + TailwindCSS
    ├── src/
    │   └── ChatScreen.tsx
    └── .env              # Frontend ortam değişkenleri
```

---

## Ortam Değişkenleri

### 1. API Gateway (`api-gateway/.env`)

```ini
PORT=8088
SERVICE_B_URL=https://api.openai.com/v1/chat/completions
OPENAI_API_KEY=sk-… (kendi anahtarınız)
```

- **PORT**: Gateway’in dinleyeceği port (örneğin `8088`)  
- **SERVICE_B_URL**: LLM servisinin tam URL’si  
- **OPENAI_API_KEY**: OpenAI veya kullandığınız servise ait API anahtarı  

### 2. Frontend (`web/.env`)

```ini
VITE_FIREBASE_API_KEY=…
VITE_FIREBASE_AUTH_DOMAIN=…
VITE_FIREBASE_PROJECT_ID=…
VITE_FIREBASE_STORAGE_BUCKET=…
VITE_FIREBASE_MESSAGING_SENDER_ID=…
VITE_FIREBASE_APP_ID=…
REACT_APP_API_BASE=http://localhost:8088
```

- **VITE_***: Firebase konfigürasyonunuz  
- **REACT_APP_API_BASE**: Gateway’inize istek göndereceğiniz base URL (lokalde `http://localhost:8088`)

---

## Kurulum & Çalıştırma

### 1. API Gateway

```bash
cd api-gateway
npm install
npm start
```

- Bu komut Gateway’i `http://localhost:8088`’de başlatır.
- Konsolda `[Gateway] POST /api/chat` gibi log’lar görmelisiniz.

### 2. Frontend

```bash
cd web
npm install
npm run dev
```

- Vite geliştirme sunucusu tipik olarak `http://localhost:5173`’de çalışır.
- Tarayıcıyı açıp `http://localhost:5173` adresine gidin.

---

## Kullanım

1. Tarayıcıda `http://localhost:5173`’ü açın.  
2. **Mesaj yaz** alanına bir şeyler yazıp “Gönder” butonuna basın.  
3. Gateway üzerinden LLM servisine istek gidip cevap Firestore’a yazılacak ve sohbet ekranınıza yansıyacak.

---

## Hata Ayıklama

- **İstek Gitmiyorsa**:  
  - Frontend Network sekmesinden URL ve status kodunu kontrol edin.  
  - `REACT_APP_API_BASE` doğru ayarlı mı bakın.

- **Gateway’e Ulaşmıyorsa**:  
  - Terminalde Gateway log’larını kontrol edin (`npm start` çalıştırdığınız pencere).  
  - CORS veya port çakışması yoksa `http://localhost:8088`’e doğrudan GET isteği atıp yanıt almayı deneyin.

- **LLM’den Hata Dönüyorsa**:  
  - `SERVICE_B_URL` ve `OPENAI_API_KEY` değerlerini kontrol edin.  
  - Gateway kodunda `createProxyMiddleware` yapılandırmanızı gözden geçirin.

---

Her iki servis de lokal olarak çalıştığından, yukarıdaki adımları takip ettikten sonra canlı sohbet deneyimini hemen test edebilirsiniz. Kolay gelsin!
