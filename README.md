# Node.js HW 01 - Contacts

Basit bir Node.js script projesi. Rehberdeki komutlarla `src/db/db.json` dosyasındaki kişileri listeleyebilir, sayabilir, ekleyebilir, toplu üretebilir ve silebilirsin.

## Gereksinimler

- Node.js (LTS önerilir)
- npm

## Kurulum

```bash
npm install
```

## Proje Yapısı

```text
src/
  constants/
    contacts.js
  db/
    db.json
  scripts/
    addOneContact.js
    countContacts.js
    generateContacts.js
    getAllContacts.js
    removeAllContacts.js
    removeLastContact.js
  utils/
    createFakeContact.js
    readContacts.js
    writeContacts.js
```

## Komutlar

### Tüm kişileri getir

```bash
npm run get-all
```

`db.json` içindeki tüm kayıtları terminale yazdırır.

### 5 adet sahte kişi üret

```bash
npm run generate
```

Mevcut kişilere 5 yeni sahte kişi ekler.

### 1 kişi ekle

```bash
npm run add-one
```

Veri tabanına 1 adet yeni sahte kişi ekler.

### Kişi sayısını göster

```bash
npm run count
```

Kayıt sayısını terminale yazdırır.

### Son kişiyi sil

```bash
npm run remove-last
```

Liste boş değilse son kaydı siler.

### Tüm kişileri sil

```bash
npm run remove-all
```

`db.json` içeriğini boş dizi (`[]`) yapar.

## Notlar

- Kişiler `@faker-js/faker` ile üretilir.
- Veriler `src/db/db.json` dosyasına yazılır.
- `generateContacts.js` dosyasında sayı şu an sabit olarak `5` kullanılıyor.
