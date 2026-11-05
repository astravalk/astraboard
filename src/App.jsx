import { useState, useMemo } from 'react';
import { 
  Search, Plus, MoreVertical, Clock, 
  CheckCircle2, Layout, Moon, Sun, 
  Trash2, X, AlertTriangle, CalendarDays, UserCircle2
} from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'Pendiente', color: '#64748b', bgDark: 'rgba(100, 116, 139, 0.1)' },
  { id: 'inProgress', title: 'En Proceso', color: '#3b82f6', bgDark: 'rgba(59, 130, 246, 0.1)' },
  { id: 'review', title: 'En Revisión', color: '#f59e0b', bgDark: 'rgba(245, 158, 11, 0.1)' },
  { id: 'done', title: 'Completado', color: '#10b981', bgDark: 'rgba(16, 185, 129, 0.1)' }
];

const INITIAL_TASKS = [
  { 
    id: 'T-1', 
    title: 'Implementar control de asistencia', 
    description: 'Desarrollar módulo para registrar la asistencia diaria y programar el contador de rachas.', 
    status: 'inProgress', priority: 'critical', type: 'feature', 
    assignee: 'Astra', creator: 'Admin', createdAt: '16 Oct 2026', deadline: '2026-10-20' 
  },
  { 
    id: 'T-2', 
    title: 'Añadir exportación de datos a CSV', 
    description: 'Integrar SheetJS para permitir a los oficiales descargar los registros del dashboard.', 
    status: 'todo', priority: 'high', type: 'feature', 
    assignee: 'Astra', creator: 'Sistema', createdAt: '15 Oct 2026', deadline: '2026-10-25' 
  },
  { 
    id: 'T-3', 
    title: 'Configurar roles (RBAC)', 
    description: 'Definir reglas de lectura y escritura en Firebase para Oficiales y Miembros del clan Papapudles.', 
    status: 'review', priority: 'high', type: 'enhancement', 
    assignee: 'Astra', creator: 'Admin', createdAt: '10 Oct 2026', deadline: '2026-10-18' 
  },
  { 
    id: 'T-4', 
    title: 'Módulo de Clan Wars', 
    description: 'Crear vista para planificar estrategias de las Guerras de Clanes y asignar partys según la Resonancia.', 
    status: 'todo', priority: 'high', type: 'feature', 
    assignee: 'Astra', creator: 'Oficial', createdAt: '16 Oct 2026', deadline: '2026-10-22' 
  },
  { 
    id: 'T-5', 
    title: 'Sistema de penalizaciones', 
    description: 'Automatizar el descuento de puntos para los miembros de Papapudles que falten a la guerra sin avisar.', 
    status: 'inProgress', priority: 'medium', type: 'enhancement', 
    assignee: 'Astra', creator: 'Admin', createdAt: '14 Oct 2026', deadline: '2026-10-19' 
  },
  { 
    id: 'T-6', 
    title: 'Efectos de audio Web API', 
    description: 'Sintetizar sonidos para confirmar acciones en la interfaz de usuario.', 
    status: 'done', priority: 'low', type: 'feature', 
    assignee: 'Astra', creator: 'Sistema', createdAt: '01 Oct 2026', deadline: '2026-10-05' 
  },
  { 
    id: 'T-7', 
    title: 'Auditoría de baneos secundarios', 
    description: 'Redactar apelación formal para Blizzard sobre el bloqueo de cuentas secundarias y adjuntar logs de falsos positivos.', 
    status: 'review', priority: 'critical', type: 'bug', 
    assignee: 'Astra', creator: 'Admin', createdAt: '15 Oct 2026', deadline: '2026-10-17' 
  },
  { 
    id: 'T-8', 
    title: 'Sincronizar AniList GraphQL', 
    description: 'Conectar el tracker personal de anime con la API de AniList para mantener el catálogo actualizado en tiempo real.', 
    status: 'todo', priority: 'low', type: 'feature', 
    assignee: 'Astra', creator: 'Sistema', createdAt: '16 Oct 2026', deadline: '2026-11-01' 
  },
  { 
    id: 'T-9', 
    title: 'Parser de osu!mania skin.ini', 
    description: 'Crear herramienta web para visualizar y editar colores/anchos de columnas (4K) directamente desde el navegador.', 
    status: 'done', priority: 'medium', type: 'enhancement', 
    assignee: 'Astra', creator: 'Admin', createdAt: '10 Oct 2026', deadline: '2026-10-15' 
  }
];

const getStyles = (isDark) => {
  const colors = {
    bgApp: isDark ? '#020106' : '#F8FAFC',
    bgBoard: isDark ? '#0b0716' : '#F1F5F9',
    bgCard: isDark ? '#140d26' : '#FFFFFF',
    border: isDark ? 'rgba(139, 92, 246, 0.2)' : '#E2E8F0',
    borderHover: isDark ? 'rgba(139, 92, 246, 0.8)' : '#8B5CF6',
    textMain: isDark ? '#E2E8F0' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    primary: '#8B5CF6',
    overlay: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.4)'
  };

  return {
    colors,
    container: { height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: colors.bgApp, color: colors.textMain, fontFamily: '"Inter", system-ui, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: colors.bgApp, borderBottom: `1px solid ${colors.border}`, zIndex: 10 },
    brand: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.5em', fontWeight: 800 },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', backgroundColor: colors.bgApp },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: colors.bgBoard, borderRadius: '8px', border: `1px solid ${colors.border}`, padding: '0 12px', width: '300px' },
    searchInput: { flex: 1, padding: '10px', backgroundColor: 'transparent', border: 'none', color: colors.textMain, outline: 'none', fontSize: '0.9em' },
    btnPrimary: { padding: '10px 20px', borderRadius: '8px', backgroundColor: colors.primary, color: '#FFFFFF', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s' },
    board: { flex: 1, display: 'flex', gap: '24px', padding: '0 32px 32px 32px', overflowX: 'auto', backgroundColor: colors.bgApp },
    column: { minWidth: '340px', width: '340px', display: 'flex', flexDirection: 'column', backgroundColor: colors.bgBoard, borderRadius: '12px', border: `1px solid ${colors.border}`, maxHeight: '100%' },
    columnHeader: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, fontWeight: '600' },
    columnCount: { padding: '2px 8px', borderRadius: '12px', fontSize: '0.8em', backgroundColor: colors.bgApp, color: colors.textMuted },
    taskList: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, minHeight: '150px' },
    card: { backgroundColor: colors.bgCard, padding: '16px', borderRadius: '8px', border: `1px solid ${colors.border}`, cursor: 'grab', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', transition: 'border-color 0.3s ease, transform 0.2s ease' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardTitle: { fontSize: '0.95em', fontWeight: '600', color: colors.textMain, lineHeight: '1.4' },
    cardId: { fontSize: '0.75em', color: colors.textMuted, fontWeight: '600' },
    cardDesc: { fontSize: '0.85em', color: colors.textMuted, lineHeight: '1.5' },
    cardMeta: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75em', color: colors.textMuted, marginTop: '4px' },
    badgeGroup: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '0.7em', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: `1px dashed ${colors.border}`, paddingTop: '12px' },
    avatar: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: colors.primary, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75em', fontWeight: '700' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    modalContent: { width: '100%', maxWidth: '500px', backgroundColor: colors.bgCard, borderRadius: '12px', border: `1px solid ${colors.border}`, padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
    input: { padding: '12px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgBoard, color: colors.textMain, outline: 'none', fontFamily: 'inherit', cursor: 'text' },
    select: { padding: '12px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.bgBoard, color: colors.textMain, outline: 'none', fontFamily: 'inherit' }
  };
};

const getPriorityColor = (priority, isDark) => {
  const map = {
    critical: { bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', text: '#ef4444', icon: AlertTriangle },
    high: { bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7', text: '#f59e0b', icon: AlertTriangle },
    medium: { bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#dbeafe', text: '#3b82f6', icon: Clock },
    low: { bg: isDark ? 'rgba(100, 116, 139, 0.15)' : '#f1f5f9', text: '#64748b', icon: CheckCircle2 }
  };
  return map[priority];
};

const getTypeColor = (type, isDark) => {
  const map = {
    feature: { bg: isDark ? 'rgba(139, 92, 246, 0.15)' : '#ede9fe', text: '#8b5cf6' },
    bug: { bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', text: '#ef4444' },
    enhancement: { bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#d1fae5', text: '#10b981' }
  };
  return map[type];
};

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', description: '', priority: 'medium', type: 'feature', assignee: 'Astra', deadline: '' 
  });

  const styles = useMemo(() => getStyles(isDark), [isDark]);

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    const lowerQuery = searchQuery.toLowerCase();
    return tasks.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) || 
      t.description.toLowerCase().includes(lowerQuery) ||
      t.id.toLowerCase().includes(lowerQuery) ||
      t.assignee.toLowerCase().includes(lowerQuery)
    );
  }, [tasks, searchQuery]);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.4'; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const today = new Date().toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });

    const task = {
      id: `T-${tasks.length + 1}`,
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      type: newTask.type,
      assignee: newTask.assignee,
      creator: 'Demo User',
      createdAt: today,
      deadline: newTask.deadline || 'Sin fecha'
    };

    setTasks([task, ...tasks]);
    setIsModalOpen(false);
    setNewTask({ title: '', description: '', priority: 'medium', type: 'feature', assignee: 'Astra', deadline: '' });
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <Layout color={styles.colors.primary} size={28} />
          <span>Astra<span style={{color: styles.colors.primary}}>Board</span></span>
        </div>
        <button onClick={() => setIsDark(!isDark)} style={{padding: '8px', borderRadius: '50%', backgroundColor: styles.colors.bgBoard, border: `1px solid ${styles.colors.border}`, color: styles.colors.textMain, cursor: 'pointer', transition: 'background 0.2s'}}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <Search size={18} color={styles.colors.textMuted} />
          <input 
            type="text" 
            placeholder="Buscar en tareas o descripciones..." 
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button style={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Nueva Tarea
        </button>
      </div>

      <main style={styles.board}>
        {COLUMNS.map(column => {
          const columnTasks = filteredTasks.filter(t => t.status === column.id);

          return (
            <div 
              key={column.id} 
              style={styles.column}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div style={styles.columnHeader}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: column.color}} />
                  {column.title}
                </div>
                <span style={styles.columnCount}>{columnTasks.length}</span>
              </div>

              <div style={styles.taskList}>
                {columnTasks.map(task => {
                  const pStyle = getPriorityColor(task.priority, isDark);
                  const tStyle = getTypeColor(task.type, isDark);
                  const PriorityIcon = pStyle.icon;

                  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'done';

                  return (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      style={styles.card}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = styles.colors.borderHover;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = styles.colors.border;
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={styles.cardHeader}>
                        <div style={styles.badgeGroup}>
                          <span style={{...styles.badge, backgroundColor: tStyle.bg, color: tStyle.text}}>{task.type}</span>
                          <span style={{...styles.badge, backgroundColor: pStyle.bg, color: pStyle.text, display: 'flex', alignItems: 'center', gap: '4px'}}>
                            <PriorityIcon size={10} /> {task.priority}
                          </span>
                        </div>
                        <button onClick={() => handleDeleteTask(task.id)} style={{background: 'transparent', border: 'none', color: styles.colors.textMuted, cursor: 'pointer', padding: '2px'}}>
                          <Trash2 size={16} style={{transition: 'color 0.2s'}} onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'} onMouseOut={(e) => e.currentTarget.style.color = styles.colors.textMuted} />
                        </button>
                      </div>
                      
                      <div>
                        <h3 style={styles.cardTitle}>{task.title}</h3>
                        {task.description && <p style={styles.cardDesc}>{task.description}</p>}
                      </div>

                      <div style={styles.cardMeta}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                          <UserCircle2 size={14} /> <span>Añadido por <b>{task.creator}</b> el {task.createdAt}</span>
                        </div>
                      </div>

                      <div style={styles.cardFooter}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <div style={styles.avatar}>{task.assignee.substring(0, 2).toUpperCase()}</div>
                          <span style={{fontSize: '0.8em', fontWeight: '600', color: styles.colors.textMain}}>{task.assignee}</span>
                        </div>
                        
                        {task.deadline !== 'Sin fecha' && (
                          <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75em', fontWeight: '600', color: isOverdue ? '#ef4444' : styles.colors.textMuted, padding: '4px 8px', borderRadius: '4px', backgroundColor: isOverdue ? (isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2') : 'transparent'}}>
                            <CalendarDays size={14} />
                            {task.deadline}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{fontSize: '1.5em', fontWeight: '700'}}>Crear Nueva Tarea</h2>
              <button onClick={() => setIsModalOpen(false)} style={{background: 'transparent', border: 'none', color: styles.colors.textMuted, cursor: 'pointer'}}><X size={24} style={{transition: 'color 0.2s'}} onMouseOver={(e) => e.currentTarget.style.color = styles.colors.textMain} onMouseOut={(e) => e.currentTarget.style.color = styles.colors.textMuted} /></button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div style={styles.formGroup}>
                <label style={{fontSize: '0.9em', fontWeight: '600'}}>Título</label>
                <input 
                  type="text" 
                  required
                  style={styles.input} 
                  placeholder="Ej. Modificar roles en Discord"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={{fontSize: '0.9em', fontWeight: '600'}}>Descripción</label>
                <textarea 
                  rows={3}
                  style={{...styles.input, resize: 'none'}} 
                  placeholder="Detalla los requerimientos de la tarea..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>

              <div style={{display: 'flex', gap: '16px', marginBottom: '16px'}}>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={{fontSize: '0.9em', fontWeight: '600'}}>Responsable</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    placeholder="Ej. Astra"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  />
                </div>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={{fontSize: '0.9em', fontWeight: '600'}}>Fecha Límite</label>
                  <input 
                    type="date" 
                    min="2024-01-01"
                    max="2030-12-31"
                    onClick={(e) => e.target.showPicker ? e.target.showPicker() : null}
                    style={{...styles.input, cursor: 'pointer'}} 
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  />
                </div>
              </div>

              <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={{fontSize: '0.9em', fontWeight: '600'}}>Prioridad</label>
                  <select style={styles.select} value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="low">Baja (Low)</option>
                    <option value="medium">Media (Medium)</option>
                    <option value="high">Alta (High)</option>
                    <option value="critical">Crítica (Critical)</option>
                  </select>
                </div>
                <div style={{...styles.formGroup, flex: 1}}>
                  <label style={{fontSize: '0.9em', fontWeight: '600'}}>Tipo</label>
                  <select style={styles.select} value={newTask.type} onChange={(e) => setNewTask({...newTask, type: e.target.value})}>
                    <option value="feature">Feature (Mejora)</option>
                    <option value="bug">Bug (Error)</option>
                    <option value="enhancement">Enhancement (Ajuste)</option>
                  </select>
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px'}}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{padding: '10px 20px', borderRadius: '8px', border: `1px solid ${styles.colors.border}`, backgroundColor: 'transparent', color: styles.colors.textMain, fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s'}} onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.colors.bgBoard} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Cancelar
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}