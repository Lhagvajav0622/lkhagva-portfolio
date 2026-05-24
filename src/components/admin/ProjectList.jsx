import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { deleteProject, reorderProjects } from '../../hooks/useProjects'
import './ProjectList.css'

const STATUS_COLOR = { published: '#00c853', draft: '#ff9100' }

export default function ProjectList({ projects, onEdit, onAdd }) {
  const [deleting, setDeleting] = useState(null)

  const onDragEnd = result => {
    if (!result.destination) return
    const ids = [...projects].map(p => p.id)
    const [moved] = ids.splice(result.source.index, 1)
    ids.splice(result.destination.index, 0, moved)
    reorderProjects(ids)
  }

  const handleDelete = async id => {
    if (!confirm('Delete this project?')) return
    setDeleting(id)
    await deleteProject(id)
    setDeleting(null)
  }

  return (
    <div className="pl">
      <div className="pl-header">
        <div>
          <h2 className="pl-title">Projects</h2>
          <p className="pl-sub">{projects.length} total (drag to reorder)</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={onAdd}>+ New Project</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="projects">
          {(provided, snapshot) => (
            <div
              className={`pl-list${snapshot.isDraggingOver ? ' dragging-over' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {projects.length === 0 && (
                <div className="pl-empty">
                  <p>No projects yet.</p>
                  <button className="admin-btn admin-btn--primary" onClick={onAdd}>Create your first project</button>
                </div>
              )}

              {projects.map((p, index) => (
                <Draggable key={p.id} draggableId={p.id} index={index}>
                  {(drag, dragSnap) => (
                    <div
                      className={`pl-item${dragSnap.isDragging ? ' dragging' : ''}`}
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                    >
                      {/* Drag handle */}
                      <div className="pl-handle" {...drag.dragHandleProps}>⠿</div>

                      {/* Thumb */}
                      <div className="pl-thumb">
                        {p.image
                          ? <img src={p.image} alt={p.title} />
                          : <div className="pl-thumb-fallback" style={{ background: p.color || '#ddd' }} />
                        }
                      </div>

                      {/* Info */}
                      <div className="pl-info">
                        <h3 className="pl-item-title">{p.title}</h3>
                        <div className="pl-item-meta">
                          <span className="pl-layout-badge">{p.layout || 'standard'}</span>
                          {p.tags?.slice(0, 2).map(t => <span key={t} className="pl-tag">{t}</span>)}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="pl-status">
                        <span className="pl-status-dot" style={{ background: STATUS_COLOR[p.status] || '#ccc' }} />
                        <span className="pl-status-text">{p.status || 'draft'}</span>
                      </div>

                      {/* Actions */}
                      <div className="pl-actions">
                        <button className="admin-btn admin-btn--sm" onClick={() => onEdit(p)}>Edit</button>
                        <button
                          className="admin-btn admin-btn--sm admin-btn--danger"
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                        >
                          {deleting === p.id ? '…' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
