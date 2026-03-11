import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight, X, Star } from 'lucide-react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, uploadImage, type Testimonial } from '../../services/adminApi';

const empty: Partial<Testimonial> = { name: '', location: '', image: '', rating: 5, message: '', isActive: true };

export function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Partial<Testimonial>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => getTestimonials().then(setItems).catch(() => setError('Failed to load')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (t: Testimonial) => { setForm(t); setEditId(t._id); setShowForm(true); setError(''); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file); setForm(f => ({ ...f, image: url })); }
    catch { setError('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editId) await updateTestimonial(editId, form);
      else await createTestimonial(form);
      setShowForm(false); load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await deleteTestimonial(id); load();
  };

  const handleToggle = async (t: Testimonial) => {
    await updateTestimonial(t._id, { isActive: !t.isActive }); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1E3A8A]/90">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-gray-900">{editId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
              {[
                { key: 'name', label: 'Customer Name', required: true },
                { key: 'location', label: 'Location', placeholder: 'e.g. New York, NY' },
              ].map(({ key, label, required, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input value={(form as any)[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required={required} placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Message</label>
                <textarea value={form.message || ''} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                      <Star className={`w-6 h-6 ${(form.rating || 5) >= n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL or Upload</label>
                <input value={form.image || ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-2" />
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                {form.image && <img src={form.image} alt="preview" className="mt-2 h-16 w-16 object-cover rounded-full mx-auto" />}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">No testimonials yet. Add one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {items.map(t => (
            <div key={t._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start gap-3 mb-2">
                {t.image && <img src={t.image} alt={t.name} className="w-10 h-10 object-cover rounded-full flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                  <div className="flex mt-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggle(t)}>
                    {t.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                  </button>
                  <button onClick={() => openEdit(t)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(t._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{t.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
