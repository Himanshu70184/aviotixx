import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight, X, AlertCircle } from 'lucide-react';
import { getBlogs, createBlog, updateBlog, deleteBlog, uploadImage, type Blog } from '../../services/adminApi';

const empty: Partial<Blog> = { title: '', excerpt: '', image: '', readTime: '5 min read', slug: '', order: 0, isActive: true };

export function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Partial<Blog>>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => getBlogs().then(setBlogs).catch(() => setError('Failed to load')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(empty); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (b: Blog) => { setForm(b); setEditId(b._id); setShowForm(true); setError(''); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(f => ({ ...f, image: url }));
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editId) await updateBlog(editId, form);
      else await createBlog(form);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await deleteBlog(id);
    load();
  };

  const handleToggle = async (b: Blog) => {
    await updateBlog(b._id, { isActive: !b.isActive });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1E3A8A]/90">
          <Plus className="w-4 h-4" /> Add Blog
        </button>
      </div>

      {/* Error */}
      {error && !showForm && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-semibold text-gray-900">{editId ? 'Edit Blog' : 'New Blog Post'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
              {[
                { key: 'title', label: 'Title', required: true },
                { key: 'slug', label: 'Slug (URL)', placeholder: 'e.g. best-time-to-visit-india' },
                { key: 'readTime', label: 'Read Time', placeholder: '5 min read' },
              ].map(({ key, label, required, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    value={(form as any)[key] || ''}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required={required}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  value={form.excerpt || ''}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL or Upload</label>
                <input
                  value={form.image || ''}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://... or upload below"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-2"
                />
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                {form.image && <img src={form.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg" />}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={form.order || 0} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
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

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">No blog posts yet. Add one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map(b => (
            <div key={b._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              {b.image && <img src={b.image} alt={b.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{b.title}</p>
                <p className="text-xs text-gray-500 truncate">{b.excerpt}</p>
                <p className="text-xs text-gray-400 mt-0.5">{b.readTime} · Order: {b.order}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggle(b)} title={b.isActive ? 'Deactivate' : 'Activate'}>
                  {b.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                </button>
                <button onClick={() => openEdit(b)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(b._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
