import React, { useState } from 'react';

function App() {
  // 1. Kullanıcının formdan gireceği ev özelliklerini State üzerinde tutuyoruz
  const [formData, setFormData] = useState({
    GrLivArea: 1500,       // Metrekare
    TotRmsAbvGrd: 6,       // Toplam Oda Sayısı
    YearBuilt: 2000,       // Yapım Yılı
    LotFrontage: 60,       // Cephe Genişliği
    OverallQual: 6,        // Genel Kalite (1-10)
    Neighborhood: 'CollgCr' // Mahalle
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Kaggle veri setindeki en popüler ve kritik mahallelerin listesi
  const neighborhoods = [
    'CollgCr', 'Veenker', 'Crawfor', 'NoRidge', 'Mitchel', 'Somerst',
    'NWAmes', 'OldTown', 'BrkSide', 'Sawyer', 'NridgHt', 'NAmes',
    'IDOTRR', 'MeadowV', 'Edwards', 'Timber', 'Gilbert', 'StoneBr'
  ];

  // Form elemanları değiştikçe state'i güncelleyen fonksiyon
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 2. BACKEND (PYCHARM FLASK API) İLE KONUŞMA ADIMI
  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // PyCharm'da 5000 portunda çalışan Flask API'mize POST isteği atıyoruz
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setPrediction(data.predicted_price);
      } else {
        setError(data.error || 'Tahmin yapılırken bir hata oluştu.');
      }
    } catch (err) {
      setError('Backend sunucusuna bağlanılamadı. PyCharm\'da app.py\'nin çalıştığından emin olun!');
    } finally {
      setLoading(false);
    }
  };

  // 3. ŞIK INLINE CSS TASARIM OBJELERİ
  const styles = {
    container: { fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#f8fafc', padding: '20px' },
    card: { backgroundColor: '#1e293b', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', width: '100%', maxWidth: '600px', border: '1px solid #334155' },
    title: { fontSize: '28px', fontWeight: '700', marginBottom: '10px', textAlign: 'center', color: '#38bdf8' },
    subtitle: { fontSize: '14px', color: '#94a3b8', marginBottom: '30px', textAlign: 'center' },
    formGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#cbd5e1' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#f8fafc', fontSize: '15px', outline: 'none' },
    button: { gridColumn: 'span 2', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#0284c7', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s', marginTop: '10px' },
    resultCard: { marginTop: '30px', padding: '20px', borderRadius: '12px', backgroundColor: '#059669', textAlign: 'center', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' },
    errorCard: { marginTop: '30px', padding: '20px', borderRadius: '12px', backgroundColor: '#dc2626', textAlign: 'center' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>HouseAI</h1>
        <p style={styles.subtitle}>Yapay Zeka Destekli Gayrimenkul Değerleme Motoru (XGBoost v1.0)</p>

        <form onSubmit={handlePredict} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Metrekare (GrLivArea):</label>
            <input type="number" name="GrLivArea" value={formData.GrLivArea} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Toplam Oda Sayısı:</label>
            <input type="number" name="TotRmsAbvGrd" value={formData.TotRmsAbvGrd} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Yapım Yılı (YearBuilt):</label>
            <input type="number" name="YearBuilt" value={formData.YearBuilt} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Cephe Genişliği (LotFrontage):</label>
            <input type="number" name="LotFrontage" value={formData.LotFrontage} onChange={handleChange} style={styles.input} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Genel Kalite Puanı (1-10):</label>
            <select name="OverallQual" value={formData.OverallQual} onChange={handleChange} style={styles.input}>
              {[1,2,3,4,5,6,7,8,9,10].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Bulunduğu Mahalle:</label>
            <select name="Neighborhood" value={formData.Neighborhood} onChange={handleChange} style={styles.input}>
              {neighborhoods.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} style={{...styles.button, backgroundColor: loading ? '#475569' : '#0284c7'}}>
            {loading ? 'Yapay Zeka Hesaplıyor...' : 'Değerini Hesapla'}
          </button>
        </form>

        {/* Sonuç Alanı */}
        {prediction && (
          <div style={styles.resultCard}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '500' }}>Tahmini Gayrimenkul Değeri</h3>
            <p style={{ margin: '10px 0 0 0', fontSize: '32px', fontWeight: '700' }}>
              ${prediction.toLocaleString('en-US')}
            </p>
          </div>
        )}

        {/* Hata Alanı */}
        {error && (
          <div style={styles.errorCard}>
            <p style={{ margin: 0, fontWeight: '600' }}>{error}</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;