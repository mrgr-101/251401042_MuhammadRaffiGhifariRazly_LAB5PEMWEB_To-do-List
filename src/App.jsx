import React, { useState } from 'react';
import { Plus, Eye, Pencil, Trash2, X, Check } from 'lucide-react';

const initialTodos = [
  { id: 1, title: 'Minum Obat', description: 'Minumlah Obatmu.', status: 'in progress', priority: 'high', deadline: '2026-11-28' },
  { id: 2, title: 'Baca Buku', description: 'Baca woi.', status: 'in progress', priority: 'low', deadline: '2026-11-25' },
  { id: 3, title: 'Pr KCB', description: 'Pertemuan 9', status: 'in progress', priority: 'low', deadline: '2026-12-02' },
  { id: 4, title: 'Projek lab pemweb', description: 'Todolist', status: 'todo', priority: 'low', deadline: '2026-11-30' },
];

const emptyForm = { title: '', description: '', status: 'todo', priority: 'low', deadline: '' };
const prettyDate = (date) => date ? new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

export default function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);

  const openAdd = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (todo) => { setSelected(todo); setForm({ ...todo }); setModal('edit'); };
  const openDetail = (todo) => { setSelected(todo); setModal('detail'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const saveTodo = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    if (modal === 'edit') {
      setTodos(current => current.map(todo => todo.id === selected.id ? { ...form, id: selected.id } : todo));
    } else {
      setTodos(current => [{ ...form, id: Date.now() }, ...current]);
    }
    closeModal();
  };

  const deleteTodo = (todo) => {
    if (window.confirm(`Hapus tugas "${todo.title}"?`)) {
      setTodos(current => current.filter(item => item.id !== todo.id));
      if (selected?.id === todo.id) closeModal();
    }
  };

  return (
    <main className="page">
      <section className="intro">
        <div>
          <p className="eyebrow">MY TASKS</p>
          <h1>To-Do List</h1>
        </div>
        <button className="primary-btn" onClick={openAdd}><Plus size={17} /> Tambah Tugas</button>
      </section>

      <section className="stats">
        <div className="stat-card"><span>Total Tugas</span><strong>{todos.length}</strong><small>Semua aktivitas</small></div>
        <div className="stat-card"><span>In Progress</span><strong>{todos.filter(t => t.status === 'in progress').length}</strong><small>Sedang dikerjakan</small></div>
        <div className="stat-card"><span>Selesai</span><strong>{todos.filter(t => t.status === 'done').length}</strong><small>Tugas terselesaikan</small></div>
      </section>

      <section className="list-panel">
        <div className="panel-heading">
          <div><h2>Daftar Tugas</h2><p>Daftar pekerjaan yang perlu kamu selesaikan.</p></div>
          <span className="task-count">{todos.length} tugas</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Judul</th><th>Status</th><th>Prioritas</th><th>Deadline</th><th>Aksi</th></tr></thead>
            <tbody>
              {todos.map(todo => (
                <tr key={todo.id}>
                  <td><button className="title-link" onClick={() => openDetail(todo)}>{todo.title}</button><small className="description-preview">{todo.description}</small></td>
                  <td><span className={`status status-${todo.status.replace(' ', '-')}`}>{todo.status}</span></td>
                  <td><span className={`priority priority-${todo.priority}`}>{todo.priority}</span></td>
                  <td className="date-cell">{prettyDate(todo.deadline)}</td>
                  <td><div className="actions">
                    <button className="icon-btn view" aria-label="Lihat detail" title="Lihat detail" onClick={() => openDetail(todo)}><Eye size={16}/></button>
                    <button className="icon-btn edit" aria-label="Edit tugas" title="Edit tugas" onClick={() => openEdit(todo)}><Pencil size={16}/></button>
                    <button className="icon-btn delete" aria-label="Hapus tugas" title="Hapus tugas" onClick={() => deleteTodo(todo)}><Trash2 size={16}/></button>
                  </div></td>
                </tr>
              ))}
              {todos.length === 0 && <tr><td colSpan="5" className="empty">Belum ada tugas. Tambahkan tugas pertamamu.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {modal && <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
        <section className="modal">
          <div className="modal-head">
            <div><p className="eyebrow">TASK MANAGEMENT</p><h2>{modal === 'add' ? 'Tambah Tugas' : modal === 'edit' ? 'Update Tugas' : 'Detail Tugas'}</h2></div>
            <button className="close-btn" onClick={closeModal}><X size={19}/></button>
          </div>
          {modal === 'detail' ? (
            <div className="detail-content">
              <div><label>Judul</label><strong>{selected.title}</strong></div>
              <div><label>Deskripsi</label><p>{selected.description || '-'}</p></div>
              <div className="detail-grid">
                <div><label>Status</label><span className={`status status-${selected.status.replace(' ', '-')}`}>{selected.status}</span></div>
                <div><label>Prioritas</label><span className={`priority priority-${selected.priority}`}>{selected.priority}</span></div>
                <div><label>Deadline</label><strong>{prettyDate(selected.deadline)}</strong></div>
              </div>
              <div className="modal-actions"><button className="secondary-btn" onClick={closeModal}>Tutup</button><button className="primary-btn" onClick={() => openEdit(selected)}><Pencil size={15}/> Edit Tugas</button></div>
            </div>
          ) : (
            <form onSubmit={saveTodo}>
              <label htmlFor="title">Judul</label>
              <input id="title" required autoFocus placeholder="Masukkan judul tugas" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/>
              <label htmlFor="description">Deskripsi</label>
              <textarea id="description" rows="3" placeholder="Tulis deskripsi singkat..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/>
              <div className="form-grid">
                <div><label htmlFor="status">Status</label><select id="status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="todo">todo</option><option value="in progress">in progress</option><option value="done">done</option></select></div>
                <div><label htmlFor="priority">Prioritas</label><select id="priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option value="low">low</option><option value="medium">medium</option><option value="high">high</option></select></div>
              </div>
              <label htmlFor="deadline">Deadline</label>
              <input id="deadline" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}/>
              <div className="modal-actions"><button type="button" className="secondary-btn" onClick={closeModal}>Batal</button><button type="submit" className="primary-btn"><Check size={16}/>{modal === 'add' ? 'Tambah' : 'Simpan'}</button></div>
            </form>
          )}
        </section>
      </div>}
    </main>
  );
}