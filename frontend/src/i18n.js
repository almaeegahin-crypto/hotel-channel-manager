import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "dashboard": "Dashboard",
      "hotels": "Hotels",
      "rooms": "Rooms",
      "bookings": "Bookings",
      "channels": "Channel Sync",
      "analytics": "Analytics",
      "settings": "Settings",
      "logout": "Logout",
      "search_placeholder": "Search bookings, guests...",
      "welcome": "Ahlan, Ahmed",
      "stats_subtitle": "Here's what's happening across your Iraqi hotels today.",
      "total_revenue": "Total Revenue",
      "occupancy_rate": "Occupancy Rate",
      "active_channels": "Active Channels",
      "recent_bookings": "Recent Bookings",
      "sync_status": "Channel Sync Status",
      "export_report": "Export Report",
      "add_booking": "Add Booking",
      "revenue_over_time": "Revenue Over Time",
      "users": "User Roles"
    }
  },
  ar: {
    translation: {
      "dashboard": "لوحة القيادة",
      "hotels": "الفنادق",
      "rooms": "الغرف",
      "bookings": "الحجوزات",
      "channels": "مزامنة القنوات",
      "analytics": "التحليلات",
      "settings": "الإعدادات",
      "logout": "تسجيل الخروج",
      "search_placeholder": "ابحث عن الحجوزات، الضيوف...",
      "welcome": "أهلاً بك، أحمد",
      "stats_subtitle": "إليك ما يحدث في فنادقك في العراق اليوم.",
      "total_revenue": "إجمالي الإيرادات",
      "occupancy_rate": "نسبة الإشغال",
      "active_channels": "القنوات النشطة",
      "recent_bookings": "الحجوزات الأخيرة",
      "sync_status": "حالة مزامنة القنوات",
      "export_report": "تصدير التقرير",
      "add_booking": "إضافة حجز",
      "revenue_over_time": "الإيرادات بمرور الوقت",
      "users": "أدوار المستخدمين"
    }
  },
  ku: {
    translation: {
      "dashboard": "داشبۆرد",
      "hotels": "ئوتێلەکان",
      "rooms": "ژوورەکان",
      "bookings": "حیجزەکان",
      "channels": "هاوکاتکردنی کەناڵەکان",
      "analytics": "ئەنالیتیک",
      "settings": "ڕێكخستنەکان",
      "logout": "چوونە دەرەوە",
      "search_placeholder": "گەڕان بۆ ئوتێل، میوان...",
      "welcome": "بەخێربێیت، ئەحمەد",
      "stats_subtitle": "ئەوەی لە ئۆتێلەکانی عێراقت روودەدات ئەمڕۆ.",
      "total_revenue": "کۆی داهات",
      "occupancy_rate": "ڕێژەی داگیرکاری",
      "active_channels": "کەناڵە چالاکەکان",
      "recent_bookings": "حیجزە نوێیەکان",
      "sync_status": "بارودۆخی هاوکاتکردنی کەناڵەکان",
      "export_report": "ڕاپۆرت بنێرە",
      "add_booking": "حیجزێک زیاد بکە",
      "revenue_over_time": "داهات لە کاتدا",
      "users": "ڕۆڵی بەکارهێنەران"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
