# Network Tests

Bu klasör, OTT/IPTV uygulamasının çeşitli ağ koşulları altında nasıl performans gösterdiğini test eden gerçek testleri içerir.

## Dosyalar

### `network-conditions.spec.js`
Gerçek, çalışan Playwright testleri:
- **RT-801**: Slow 3G üzerinde video oynatma
- **RT-802**: Bağlantı kaybı ve kurtarma
- **RT-803**: Yüksek gecikme yönetimi
- Bant genişliği dalgalanması testleri
- Paket kaybı simülasyonu
- İndirme hızı ölçümü

## Test Edilen Ağ Profilleri

| Profil | Download | Upload | Latency |
|--------|----------|--------|---------|
| Fast 4G | 10 Mbps | 5 Mbps | 50ms |
| Slow 4G | 3 Mbps | 1.5 Mbps | 100ms |
| Slow 3G | 1 Mbps | 0.5 Mbps | 200ms |
| Offline | - | - | - |

## Testleri Çalıştırma

```bash
# Tüm ağ testleri
npm run test:network

# Belirli bir test
npx playwright test network-tests/network-conditions.spec.js

# Headed modda (tarayıcıyı görerek)
npx playwright test network-tests/network-conditions.spec.js --headed
```

## Ne Test Edilir?

1. **Video Başlatma**: Düşük bant genişliğinde video başlatma süresi
2. **Buffering Oranı**: Farklı ağ koşullarında buffering yüzdesi
3. **Adaptive Bitrate**: Kalite adaptasyonunun çalışması
4. **Bağlantı Kurtarma**: Bağlantı kesilip tekrar geldiğinde otomatik devam
5. **UI Duyarlılığı**: Yüksek gecikmede arayüz yanıt verme
6. **Bant Genişliği Değişimi**: Dinamik ağ değişimlerine adaptasyon

## Gerçek Testler

✅ Bu testler **gerçektir** ve çalışır
✅ Chrome DevTools Protocol (CDP) kullanarak ağ koşullarını simüle eder
✅ Performans metriklerini ölçer ve raporlar
✅ Beklenen davranışları doğrular
