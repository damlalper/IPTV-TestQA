# Performance Tests

Bu klasör, OTT/IPTV uygulamasının performansını ölçen gerçek testleri içerir.

## Dosyalar

### `video-performance.spec.js` ✅ GERÇEK TEST
Playwright ile yazılmış performans testleri:
- **RT-701**: Sayfa yükleme performansı (FCP, load time)
- **RT-702**: Video başlatma gecikmesi (10 kanal testi, ortalama, P95)
- **RT-703**: Kanal zap performansı (5 kanal değiştirme)
- **RT-704**: Bellek kullanımı izleme (5 dakika)
- Buffering oranı ölçümü
- Kaynak yükleme performansı

### `lighthouse-config.js` ✅ GERÇEK CONFIG
Lighthouse performans denetimi için yapılandırma:
- Performance budgets
- Resource size limits
- Timing thresholds
- Custom audit passes

### `load-test.js` ✅ GERÇEK K6 SCRIPT
k6 yük testi scripti:
- 50 → 100 kullanıcıya ölçeklendirme
- API endpoint testleri
- Login, channel load, search, VOD testleri
- Custom metrics (login duration, video load)
- Otomatik raporlama

## Performans Hedefleri

| Metrik | Hedef | Test |
|--------|-------|------|
| Video Başlatma (avg) | < 2s | RT-702 |
| Video Başlatma (P95) | < 3s | RT-702 |
| Kanal Zap | < 1s | RT-703 |
| Sayfa Yükleme | < 3s | RT-701 |
| Buffering Oranı | < 5% | RT-704 |
| Bellek Artışı | < 50% | RT-704 |

## Testleri Çalıştırma

### Playwright Performance Tests
```bash
# Tüm performans testleri
npm run test:regression:performance

# Belirli test
npx playwright test performance-tests/video-performance.spec.js

# UI modda
npx playwright test performance-tests/video-performance.spec.js --ui
```

### Lighthouse Audit
```bash
# Lighthouse raporu oluştur
npm run test:lighthouse

# Rapor: performance-tests/lighthouse-report.html
```

### k6 Load Testing
```bash
# k6 yüklü olmalı: https://k6.io/docs/getting-started/installation/

# Yük testini çalıştır
k6 run performance-tests/load-test.js

# Detaylı çıktı
k6 run --out json=performance-tests/load-test-results.json performance-tests/load-test.js
```

## Ölçülen Metrikler

### Video Performansı
- Time to First Frame (TTFF)
- Startup latency (average, P95, P99)
- Channel zap time
- Buffering frequency ve duration
- Video quality adaptation

### Sayfa Performansı
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)

### Sistem Performansı
- Memory usage (initial, peak, growth)
- CPU usage
- Network bandwidth usage
- Resource loading times

### API Performansı (k6)
- Request duration (avg, p95, p99)
- Request failure rate
- Concurrent user handling
- Throughput (requests/sec)

## Gerçek Testler

✅ **video-performance.spec.js**: 6 çalışan Playwright testi
✅ **lighthouse-config.js**: Gerçek Lighthouse konfigürasyonu
✅ **load-test.js**: Gerçek k6 load test scripti
✅ Tüm testler metrik ölçer ve raporlar
✅ Performance regression detection için kullanılabilir
