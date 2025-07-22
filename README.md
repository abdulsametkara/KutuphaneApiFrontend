# 📚 Kütüphane Yönetim Sistemi - Frontend

Bu proje, modern web teknolojileri kullanarak geliştirilmiş kapsamlı bir kütüphane yönetim sistemi frontend uygulamasıdır. [Angular CLI](https://github.com/angular/angular-cli) version 20.1.1 ile oluşturulmuştur.

## 🎯 Proje Hakkında

Bu uygulama, kütüphane işlemlerini dijital ortamda yönetmek için tasarlanmış modern ve kullanıcı dostu bir arayüz sunar. Sistemde kitap, yazar ve kategori yönetimi, kullanıcı kimlik doğrulama ve yetkilendirme işlemleri gerçekleştirilebilir.

### 🌟 Ana Özellikler

- **📖 Kitap Yönetimi**: Kitap ekleme, düzenleme, silme ve arama işlemleri
- **✍️ Yazar Yönetimi**: Yazar profilleri oluşturma ve yönetimi
- **📂 Kategori Yönetimi**: Kitap kategorilerini organize etme
- **🔐 Kimlik Doğrulama**: Güvenli kullanıcı girişi ve kayıt sistemi
- **👨‍💼 Yetkilendirme**: Admin ve normal kullanıcı rolleri
- **🔍 Gelişmiş Arama**: Çoklu kriterlere göre arama işlevselliği

## 🚀 Kullanılan Teknolojiler

### Frontend Framework & Kütüphaneler
- **Angular 20.1.0** - Modern SPA framework
- **Angular Material 20.1.2** - UI component kütüphanesi
- **Angular Router** - Sayfa yönlendirme yönetimi
- **Angular Forms** - Form yönetimi ve validasyon
- **RxJS 7.8.0** - Reactive programlama kütüphanesi

### Güvenlik & Kimlik Doğrulama
- **JWT (JSON Web Token)** - Token tabanlı kimlik doğrulama
- **jwt-decode 4.0.0** - JWT token çözümleme

### UI/UX & Bildirimler
- **ngx-toastr 19.0.0** - Toast bildirimleri
- **Angular Material** - Modern UI bileşenleri

### Geliştirme Araçları
- **TypeScript 5.8.2** - Tip güvenli programlama
- **Angular CLI 20.1.1** - Proje yönetimi ve build araçları
- **Karma & Jasmine** - Unit test framework'leri
- **Prettier** - Kod formatlama

## 🏗️ Proje Yapısı

```
src/
├── app/
│   ├── core/                 # Temel işlevsellik
│   │   ├── guards/          # Route korumaları
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/         # Veri modelleri
│   │   └── services/       # API servisleri
│   ├── features/           # Özellik modülleri
│   │   ├── auth/           # Kimlik doğrulama
│   │   ├── books/          # Kitap yönetimi
│   │   ├── authors/        # Yazar yönetimi
│   │   ├── categories/     # Kategori yönetimi
│   │   └── dashboard/      # Ana kontrol paneli
│   ├── shared/             # Paylaşılan bileşenler
│   └── environments/       # Ortam yapılandırmaları
```

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

### Code Generation
```bash
# Yeni component oluşturma

```

## 🔐 API Entegrasyonu

Bu frontend uygulaması, kütüphane yönetim sistemi backend API'si ile iletişim kurar:

- **API Base URL**: `https://localhost:7275/api`
- **Authentication**: JWT Token tabanlı
- **Content Type**: JSON

## 🎨 UI/UX Özellikleri

- **Material Design**: Modern ve tutarlı tasarım dili
- **Responsive Design**: Mobil uyumlu arayüz
- **Toast Notifications**: Kullanıcı dostu bildirimler
- **Loading States**: Yükleme durumu göstergeleri
- **Form Validation**: Gerçek zamanlı form doğrulama

## 🛡️ Güvenlik Özellikleri

- **JWT Authentication**: Güvenli kimlik doğrulama
- **Route Guards**: Sayfa erişim kontrolü
- **Role-based Authorization**: Rol tabanlı yetkilendirme
- **HTTP Interceptors**: İstek/yanıt yakalama ve işleme


## 📄 Lisans

Bu proje özel bir projedir ve ticari kullanım için izin gereklidir.

---

*Bu proje, modern web development teknikleri ve Angular framework'ünün gücünü bir araya getirerek geliştirilmiştir.*
