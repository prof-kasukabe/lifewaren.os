export const getComplexAIInsight = (category: string, data: any) => {
  if (category === 'finance') {
    const progress = (data.paidAmount / data.totalAmount) * 100;
    if (progress >= 100) return "🎯 TARGET TERCAPAI: Modal terkumpul. Alokasikan 30% ke aset produktif baru untuk pertumbuhan eksponensial.";
    if (progress < 25) return "⚠️ STARTUP PHASE: Kecepatan rendah. Fokuskan pendapatan pada 'Priority Tasks' untuk menutupi selisih.";
    return "📊 ANALISIS TREND: Kecepatan menabung stabil. Pertahankan disiplin ini.";
  }
  
  if (category === 'habit') {
    if (!data || data.length === 0) return "Belum ada data habit.";
    const ratio = data.filter((h: any) => h.completed).length / data.length;
    if (ratio === 1) return "🔥 PEAK PERFORMANCE: Semua habit terpenuhi. Tambahkan habit baru besok.";
    if (ratio < 0.3) return "⚠️ LOW ENERGY: Fokus pada 1 habit 'Anchor' untuk membangun momentum.";
    return "📈 PROGRESSIVE: Anda berada di jalur yang benar.";
  }
  
  return "Sistem sedang mengolah data.";
};