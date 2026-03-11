import { useEffect, useState } from 'react';
import { Loader2, Save, CheckCircle } from 'lucide-react';
import { getSettings, updateSettings, type SiteSettings } from '../../services/adminApi';

const defaultSettings: SiteSettings = {
  seo: { title: '', description: '', keywords: '' },
  contact: { phoneDisplay: '', phoneTel: '', email: '', address: '' },
};

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSettings()
      .then(s => setSettings({ ...defaultSettings, ...s, seo: { ...defaultSettings.seo, ...(s.seo || {}) }, contact: { ...defaultSettings.contact, ...(s.contact || {}) } }))
      .catch(() => setError('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      await updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const setContact = (key: keyof SiteSettings['contact'], value: string) =>
    setSettings(s => ({ ...s, contact: { ...s.contact, [key]: value } }));
  const setSeo = (key: keyof SiteSettings['seo'], value: string) =>
    setSettings(s => ({ ...s, seo: { ...s.seo, [key]: value } }));

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
          <CheckCircle className="w-4 h-4" /> Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📞 Contact Information
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Display</label>
                <input value={settings.contact.phoneDisplay} onChange={e => setContact('phoneDisplay', e.target.value)}
                  placeholder="1-800-123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <p className="text-xs text-gray-400 mt-0.5">Shown on website</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (tel: link)</label>
                <input value={settings.contact.phoneTel} onChange={e => setContact('phoneTel', e.target.value)}
                  placeholder="+18001234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <p className="text-xs text-gray-400 mt-0.5">Used for click-to-call</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={settings.contact.email} onChange={e => setContact('email', e.target.value)}
                placeholder="support@aviotixx.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input value={settings.contact.address} onChange={e => setContact('address', e.target.value)}
                placeholder="123 Main St, New York, NY 10001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">🔍 SEO Settings</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
              <input value={settings.seo.title} onChange={e => setSeo('title', e.target.value)}
                placeholder="Aviotixx - Best Flights to India"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea value={settings.seo.description} onChange={e => setSeo('description', e.target.value)}
                rows={3} placeholder="Book cheap flights from USA to India..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
              <input value={settings.seo.keywords} onChange={e => setSeo('keywords', e.target.value)}
                placeholder="cheap flights india, usa to india flights..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-[#1E3A8A] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#1E3A8A]/90 disabled:opacity-60 transition-all">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Settings</>}
        </button>
      </form>
    </div>
  );
}
