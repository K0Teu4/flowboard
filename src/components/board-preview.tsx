"use client";

import { useState } from "react";
import { CalendarClock, CheckSquare2, MessageCircle, MoreHorizontal, Paperclip, Plus, ShieldAlert } from "lucide-react";
import { boardColumns, type Task } from "@/lib/mock-data";

const priorityClass: Record<Task["priority"], string> = {
  Low: "bg-white/6 text-[var(--muted)]",
  Medium: "bg-[rgba(242,191,105,.11)] text-[var(--warning)]",
  High: "bg-[rgba(255,113,113,.11)] text-[var(--danger)]",
};

export function BoardPreview() {
  const [columns, setColumns] = useState(boardColumns);
  const [dragged, setDragged] = useState<{ taskId: string; from: string } | null>(null);

  function move(toColumn: string) {
    if (!dragged || dragged.from === toColumn) return;
    let moving: Task | undefined;
    const next = columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        if (column.id === dragged.from && task.id === dragged.taskId) {
          moving = task;
          return false;
        }
        return true;
      }),
    }));
    if (!moving) return;
    const result = next.map((column) =>
      column.id === toColumn ? { ...column, tasks: [...column.tasks, moving!] } : column,
    );
    setColumns(result);
    setDragged(null);
  }

  return (
    <div className="mt-5 overflow-x-auto pb-1 scrollbar-thin">
      <div className="grid min-w-[980px] grid-cols-4 gap-3">
        {columns.map((column) => (
          <section
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => move(column.id)}
            className="min-h-[420px] rounded-2xl bg-white/[.025] p-2.5"
          >
            <div className="flex items-center justify-between px-1 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{column.title}</span>
                <span className="grid h-5 min-w-5 place-items-center rounded-md bg-white/5 px-1 text-[10px] text-[var(--muted)]">{column.tasks.length}</span>
              </div>
              <button aria-label={`More actions for ${column.title}`} className="grid h-7 w-7 place-items-center rounded-lg text-[var(--muted)] hover:bg-white/5">
                <MoreHorizontal size={15} />
              </button>
            </div>
            <div className="space-y-2">
              {column.tasks.map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={() => setDragged({ taskId: task.id, from: column.id })}
                  className="card transition-soft cursor-grab rounded-xl p-3 active:cursor-grabbing"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`rounded-md px-1.5 py-1 text-[9px] font-medium ${priorityClass[task.priority]}`}>{task.priority}</span>
                    {task.blocked && <ShieldAlert size={14} className="text-[var(--danger)]" />}
                  </div>
                  <div className="mt-2 text-sm font-medium leading-5">{task.title}</div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {task.labels.map((label) => <span key={label} className="rounded-md border border-white/8 bg-white/[.025] px-1.5 py-1 text-[9px] text-[var(--muted)]">{label}</span>)}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-[var(--muted)]">
                    <div className="flex items-center gap-2.5">
                      {task.checklist && <span className="flex items-center gap-1"><CheckSquare2 size={12} />{task.checklist}</span>}
                      {task.comments ? <span className="flex items-center gap-1"><MessageCircle size={12} />{task.comments}</span> : null}
                      {task.attachments ? <span className="flex items-center gap-1"><Paperclip size={12} />{task.attachments}</span> : null}
                    </div>
                    {task.due && <span className="flex items-center gap-1"><CalendarClock size={12} />{task.due}</span>}
                  </div>
                </article>
              ))}
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/8 py-2.5 text-xs text-[var(--muted)] hover:bg-white/[.025] hover:text-white"><Plus size={14} /> Add card</button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
