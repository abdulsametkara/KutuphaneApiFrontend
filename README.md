# 📚 Kütüphane Yönetim Sistemi - Frontend

Bu proje, modern web teknolojileri kullanarak geliştirilmiş kapsamlı bir kütüphane yönetim sistemi frontend uygulamasıdır. [Angular CLI](https://github.com/angular/angular-cli) version 20.1.1 ile oluşturulmuştur.

## 🎯 Proje Hakkında

Bu uygulama, kütüphane işlemlerini dijital ortamda yönetmek için tasarlanmış modern ve kullanıcı dostu bir arayüz sunar. Sistemde kitap, yazar ve kategori yönetimi, kullanıcı kimlik doğrulama, kitap ödünç alma işlemleri ve dosya yönetimi gerçekleştirilebilir.

### 🌟 Ana Özellikler

#### 📖 Kitap Yönetimi

- Kitap ekleme, düzenleme, silme ve listeleme
- Kitap kapak resmi yükleme ve görüntüleme
- Detaylı kitap bilgileri (ISBN, sayfa sayısı, yayın tarihi vb.)
- Kitap stok durumu takibi

#### 📋 Kitap Ödünç Alma Sistemi

- Kitap ödünç verme ve iade işlemleri
- Ödünç alma geçmişi ve raporu
- Gecikme takibi ve uyarı sistemi
- Admin panelinde ödünç alma listesi yönetimi

#### ✍️ Yazar Yönetimi

- Yazar profilleri oluşturma ve yönetimi
- Yazar arama ve filtreleme
- Yazar resmi yükleme
- Yazarların kitap listesi görüntüleme

#### 📂 Kategori Yönetimi

- Kitap kategorilerini organize etme
- Kategori ekleme, düzenleme, silme
- Kategori bazlı kitap filtreleme
- Hiyerarşik kategori yapısı desteği

#### 🔐 Kimlik Doğrulama & Güvenlik

- Güvenli kullanıcı girişi ve kayıt sistemi
- JWT token tabanlı kimlik doğrulama
- Rol tabanlı erişim kontrolü (Admin/User)
- Oturum yönetimi ve güvenli çıkış

#### 🔍 Gelişmiş Arama & Filtreleme

- Çoklu kriterlere göre arama işlevselliği
- Kitap, yazar ve kategori bazlı arama
- Gerçek zamanlı arama sonuçları
- Gelişmiş filtreleme seçenekleri

#### 📁 Dosya Yönetimi

- Kitap kapak resimleri yükleme
- Yazar profil resimleri yükleme
- Güvenli dosya upload sistemi
- Resim önizleme ve düzenleme

#### 🎨 Kullanıcı Deneyimi

- Responsive tasarım (mobil uyumlu)
- Material Design bileşenleri
- Toast bildirimleri (ngx-toastr)
- SweetAlert2 ile etkileşimli uyarılar
- Loading durumları ve progress bar'lar

## Kullanılan Teknolojiler

### Frontend Framework & Kütüphaneler

- **Angular 20.1.0** - Modern SPA framework
- **Angular Material 20.1.2** - UI component kütüphanesi ve Material Design
- **Angular Router** - Sayfa yönlendirme ve lazy loading
- **Angular Forms** - Reactive forms ve validasyon
- **RxJS 7.8.0** - Reactive programlama ve asenkron işlemler

### Güvenlik & Kimlik Doğrulama

- **JWT (JSON Web Token)** - Token tabanlı kimlik doğrulama
- **jwt-decode 4.0.0** - JWT token parsing ve validation
- **Guards & Interceptors** - Route koruması ve HTTP yakalama

### UI/UX & Kullanıcı Deneyimi

- **ngx-toastr 19.0.0** - Toast bildirimleri ve uyarılar
- **SweetAlert2 11.22.2** - Etkileşimli modal ve confirmation dialog'ları
- **Angular Material** - Responsive ve accessible UI bileşenleri
- **Material Icons** - Tutarlı icon sistemi

### Dosya & Veri Yönetimi

- **Angular HTTP Client** - RESTful API iletişimi
- **File Upload Service** - Güvenli dosya yükleme sistemi
- **Form Data Handling** - Multipart form data işleme

### Geliştirme Araçları & DevOps

- **TypeScript 5.8.2** - Tip güvenli programlama dili
- **Angular CLI 20.1.1** - Proje yönetimi ve build araçları
- **Karma & Jasmine** - Unit test framework'leri
- **Prettier** - Kod formatlama ve stil standartları
- **Angular Build** - Optimized production builds

## 🏗️ Proje Yapısı

```
src/
├── app/
│   ├── core/                      # Temel işlevsellik ve shared services
│   │   ├── guards/               # Route korumaları (AuthGuard, AdminGuard)
│   │   ├── interceptors/         # HTTP interceptors (Token, Error handling)
│   │   ├── models/              # TypeScript interface'leri ve veri modelleri
│   │   │   ├── user.model.ts    # Kullanıcı veri modeli
│   │   │   ├── book.model.ts    # Kitap veri modeli
│   │   │   ├── author.model.ts  # Yazar veri modeli
│   │   │   ├── category.model.ts # Kategori veri modeli
│   │   │   └── book-loan.model.ts # Kitap ödünç alma modeli
│   │   ├── services/            # API servisleri ve business logic
│   │   │   ├── auth.service.ts      # Kimlik doğrulama servisi
│   │   │   ├── book.service.ts      # Kitap CRUD işlemleri
│   │   │   ├── author.service.ts    # Yazar CRUD işlemleri
│   │   │   ├── category.service.ts  # Kategori CRUD işlemleri
│   │   │   ├── book-loan.service.ts # Kitap ödünç alma servisi
│   │   │   └── upload.service.ts    # Dosya yükleme servisi
│   │   └── styles/              # Global CSS ve tema dosyaları
│   │
│   ├── features/                # Feature modülleri (Lazy Loading)
│   │   ├── auth/               # Kimlik doğrulama modülü
│   │   │   ├── login/          # Giriş sayfası
│   │   │   └── register/       # Kayıt sayfası
│   │   │
│   │   ├── dashboard/          # Ana kontrol paneli
│   │   │   └── dashboard.component.ts
│   │   │
│   │   ├── books/              # Kitap yönetimi modülü
│   │   │   ├── book-list/      # Kitap listesi
│   │   │   ├── book-form/      # Kitap ekleme formu
│   │   │   ├── book-update/    # Kitap güncelleme
│   │   │   ├── book-search/    # Kitap arama
│   │   │   └── book-loan-list/ # Kitap ödünç alma listesi
│   │   │
│   │   ├── authors/            # Yazar yönetimi modülü
│   │   │   ├── author-list/    # Yazar listesi
│   │   │   ├── author-form/    # Yazar ekleme formu
│   │   │   ├── author-update/  # Yazar güncelleme
│   │   │   └── author-search/  # Yazar arama
│   │   │
│   │   ├── categories/         # Kategori yönetimi modülü
│   │   │   ├── category-list/     # Kategori listesi
│   │   │   ├── category-form/     # Kategori ekleme formu
│   │   │   ├── category-update/   # Kategori güncelleme
│   │   │   └── category-search/   # Kategori arama
│   │   │
│   │   └── files/              # Dosya yönetimi modülü
│   │       └── file-upload/    # Dosya yükleme bileşenleri
│   │
│   ├── shared/                 # Paylaşılan bileşenler ve utilities
│   │   └── components/         # Reusable UI bileşenleri
│   │
│   ├── app.config.ts          # Uygulama ana konfigürasyonu
│   ├── app.routes.ts          # Route tanımlamaları ve lazy loading
│   └── app.component.ts       # Root component
│
├── environments/              # Ortam yapılandırmaları
│   ├── environment.ts         # Development environment
│   └── environment.prod.ts    # Production environment
│
├── styles.css                # Global CSS dosyası
├── index.html                # Ana HTML dosyası
└── main.ts                   # Uygulama başlangıç noktası
```

### 📁 Modül Mimarisi

- **Lazy Loading**: Tüm feature modülleri lazy loading ile yüklenir
- **Standalone Components**: Angular'ın yeni standalone component yapısı kullanılır  
- **Service-Based Architecture**: İş mantığı servis katmanında ayrıştırılır
- **Model-Driven Development**: TypeScript interface'leri ile tip güvenliği sağlanır

## 📚 Öğrenilen ve Kullanılan Kavramlar

### Angular İleri Düzey Konuları

- **Lazy Loading**: Modüllerin ihtiyaç duyuldukça yüklenmesi
- **Guards**: Route korumaları ve yetkilendirme
- **Interceptors**: HTTP isteklerini yakalama ve işleme
- **Reactive Forms**: Form yönetimi ve validasyon
- **Services & Dependency Injection**: Servis tabanlı mimari

### Modern Web Development Pratikleri

- **Component-Based Architecture**: Yeniden kullanılabilir bileşen yapısı
- **TypeScript**: Tip güvenli programlama
- **RxJS**: Asenkron veri işleme ve Reactive Programming
- **Material Design**: Modern UI/UX prensipleri
- **JWT Authentication**: Token tabanlı güvenlik

### API Entegrasyonu

- **RESTful API**: Backend servisleriyle iletişim
- **HTTP Client**: Angular HTTP servisleri
- **Error Handling**: Hata yönetimi ve kullanıcı bilgilendirme

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v18+)
- Angular CLI (v20.1.1+)
- Git

### Kurulum Adımları

1. **Projeyi klonlayın:**
   
   ```bash
   git clone https://github.com/abdulsametkara/KutuphaneApiFrontend.git
   cd KutuphaneApiFrontend
   ```

2. **Bağımlılıkları yükleyin:**
   
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlatın:**
   
   ```bash
   ng serve
   ```

Sunucu çalışmaya başladıktan sonra tarayıcınızda `http://localhost:4200/` adresini ziyaret edin.

## 🔧 Geliştirme Komutları

### Sunucu İşlemleri

```bash
# Geliştirme sunucusu
ng serve

# Üretim modu ile sunucu
ng serve --configuration production
```

### Build İşlemleri

```bash
# Geliştirme build
ng build

# Üretim build
ng build --configuration production

# Watch modunda build
ng build --watch --configuration development
```

### Test İşlemleri

```bash
# Unit testler
ng test

# Test coverage raporu
ng test --code-coverage
```

## 🔗 API Entegrasyonu

Bu frontend uygulaması, ASP.NET Core backend API'si ile RESTful servisler üzerinden iletişim kurar:

### 🔧 API Konfigürasyonu

- **API Base URL**: `https://localhost:7275/api`
- **Authentication**: JWT Bearer Token
- **Content Type**: `application/json`
- **File Upload**: `multipart/form-data`

### 📡 API Endpoint'leri

#### 🔐 Authentication

- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/register` - Kullanıcı kaydı
- `GET /auth/profile` - Kullanıcı profili

#### 📖 Book Management

- `GET /books` - Tüm kitapları listele
- `GET /books/{id}` - Kitap detayı
- `POST /books` - Yeni kitap ekle
- `PUT /books/{id}` - Kitap güncelle
- `DELETE /books/{id}` - Kitap sil
- `GET /books/search` - Kitap arama

#### 📋 Book Loan Management

- `GET /book-loans` - Ödünç alma listesi
- `POST /book-loans` - Kitap ödünç ver
- `PUT /book-loans/{id}/return` - Kitap iade
- `GET /book-loans/user/{userId}` - Kullanıcının ödünç aldığı kitaplar

#### ✍️ Author Management

- `GET /authors` - Yazar listesi
- `GET /authors/{id}` - Yazar detayı
- `POST /authors` - Yeni yazar ekle
- `PUT /authors/{id}` - Yazar güncelle
- `DELETE /authors/{id}` - Yazar sil

#### 📂 Category Management

- `GET /categories` - Kategori listesi
- `POST /categories` - Yeni kategori ekle
- `PUT /categories/{id}` - Kategori güncelle
- `DELETE /categories/{id}` - Kategori sil

#### 📁 File Upload

- `POST /files/upload` - Dosya yükleme (resimler)
- `GET /files/{fileName}` - Dosya indirme/görüntüleme

## 🎨 UI/UX Özellikleri

### 🎯 Tasarım Prensipleri

- **Material Design 3**: Google'ın modern tasarım dili
- **Responsive Design**: Tüm cihaz boyutlarında uyumlu
- **Accessibility (A11Y)**: Erişilebilir kullanıcı arayüzü
- **Consistent Theme**: Tutarlı renk paleti ve tipografi

### 🔔 Kullanıcı Bildirimler

- **Toast Notifications**: Başarı/hata mesajları (ngx-toastr)
- **SweetAlert2 Modals**: Etkileşimli onay dialog'ları
- **Loading Indicators**: Asenkron işlemler için loading spinner'lar
- **Progress Bars**: Dosya yükleme progress göstergeleri

### 📱 Form & Validation

- **Reactive Forms**: Angular reactive forms kullanımı
- **Real-time Validation**: Gerçek zamanlı form doğrulama
- **Custom Validators**: Özel validasyon kuralları
- **Error Handling**: Kullanıcı dostu hata mesajları

## 🛡️ Güvenlik Özellikleri

### 🔐 Kimlik Doğrulama & Yetkilendirme

- **JWT Authentication**: Token tabanlı güvenli giriş sistemi
- **Role-based Access Control**: Admin/User rol yetkilendirmesi
- **Protected Routes**: Yetkisiz erişim koruması
- **Session Management**: Güvenli oturum yönetimi

### 🔒 HTTP Güvenlik

- **HTTP Interceptors**: Otomatik token ekleme ve hata yakalama
- **CORS Handling**: Cross-origin resource sharing yönetimi
- **Input Sanitization**: XSS saldırı koruması
- **File Upload Security**: Güvenli dosya yükleme validasyonu

### 🛂 Route Koruması

- **Auth Guard**: Giriş yapmış kullanıcı kontrolü
- **Admin Guard**: Admin yetkisi kontrolü
- **Automatic Redirect**: Yetkisiz erişimde otomatik yönlendirme

## 📄 Lisans

Bu proje özel bir projedir ve ticari kullanım için izin gereklidir.

---
