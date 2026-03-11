import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { getFaqs, createFaq, updateFaq, deleteFaq, type Faq } from '../../services/adminApi';

const empty: Partial<Faq> = { question: '', answer: '', order: 0, isActive: true };

export function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Partial<Faq>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => getFaqs().then(setFaqs).catch(() => setError('Failed to load')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (f: Faq) => { setForm(f); setEditId(f._id); setShowForm(true); setError(''); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editId) await updateFaq(editId, form);
      else await createFaq(form);
      setShowForm(false); load();
    } catch (err) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    await deleteFaq(id); load();
  };

  const handleToggle = async (f: Faq) => {
    await updateFaq(f._id, { isActive: !f.isActive }); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1E3A8A]/90">
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-gray-900">{editId ? 'Edit FAQ' : 'New FAQ'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input value={form.question || ''} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                  required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <textarea value={form.answer || ''} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                  required rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={form.order || 0} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input type="checkbox" checked={!!form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
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
      ) : faqs.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">No FAQs yet. Add one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map(f => (
            <div key={f._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{f.question}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{f.answer}</p>
                <p className="text-xs text-gray-400 mt-1">Order: {f.order}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(f)}>
                  {f.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                </button>
                <button onClick={() => openEdit(f)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(f._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
