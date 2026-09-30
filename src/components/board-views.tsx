"use client";

import { useMemo, useState } from "react";
import { BarChart3, CalendarDays, CheckCircle2, CircleAlert, List, Table2 } from "lucide-react";
import type { Task } from "@/lib/mock-data";
import type { Board } from "@/lib/workspace-store";

type ViewProps = {
  board: Board;
  columns: Board["columns"];
  language: "ru" | "en";
  onOpenTask: (columnId: string, task: Task) => void;
};

export function BoardTableView({ board, columns, language, onOpenTask }: ViewProps) {
  const [sort, setSort] = useState<"title" | "priority" | "due">("due");
  const rows = useMemo(() => columns.flatMap(column => column.tasks.map(task => ({ task, column }))), [board]);
  const priorityWeight: Record<Task["priority"], number> = { High: 0, Medium: 1, Low: 2 };

  const sorted = [...rows].sort((a, b) => {
    if (sort === "title") return a.task.title.localeCompare(b.task.title);
    if (sort === "priority") return priorityWeight[a.task.priority] - priorityWeight[b.task.priority];
    return (a.task.due || "9999-99-99").localeCompare(b.task.due || "9999-99-99");
  });

  return (
    <div className="mx-auto max-w-[1500px] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{language === "ru" ? "Таблица задач" : "Task table"}</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">{language === "ru" ? "Все карточки доски в компактном списке." : "Every card on this board in one compact list."}</p>
        </div>
        <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
          {language === "ru" ? "Сортировать" : "Sort"}
          <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="rounded-xl border border-white/8 bg-[#111819] px-3 py-2 text-xs text-white outline-none">
            <option value="due">{language === "ru" ? "По сроку" : "Due date"}</option>
            <option value="priority">{language === "ru" ? "По приоритету" : "Priority"}</option>
            <option value="title">{language === "ru" ? "По названию" : "Title"}</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/8 bg-black/10">
        <table className="w-full min-w-[820px] text-left">
          <thead className="border-b border-white/8 text-[10px] uppercase tracking-[.14em] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">{language === "ru" ? "Карточка" : "Card"}</th>
              <th className="px-4 py-3">{language === "ru" ? "Список" : "List"}</th>
              <th className="px-4 py-3">{language === "ru" ? "Приоритет" : "Priority"}</th>
              <th className="px-4 py-3">{language === "ru" ? "Участник" : "Member"}</th>
              <th className="px-4 py-3">{language === "ru" ? "Срок" : "Due"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {sorted.map(({ task, column }) => (
              <tr key={task.id} onClick={() => onOpenTask(column.id, task)} className="cursor-pointer hover:bg-white/[.025]">
                <td className="px-4 py-4">
                  <div className="font-medium">{task.title}</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {task.labels.map(label => <span key={label} className="rounded-md bg-white/5 px-1.5 py-1 text-[9px] text-[var(--muted)]">{label}</span>)}
                  </div>
                </td>
                <td className="px-4 py-4 text-xs text-[var(--muted)]">{column.title}</td>
                <td className="px-4 py-4 text-xs">
                  {task.priority === "High" ? (language === "ru" ? "Высокий" : "High") : task.priority === "Medium" ? (language === "ru" ? "Средний" : "Medium") : (language === "ru" ? "Низкий" : "Low")}
                </td>
                <td className="px-4 py-4 text-xs text-[var(--muted)]">{task.assignee || (language === "ru" ? "Не назначен" : "Unassigned")}</td>
                <td className="px-4 py-4 text-xs text-[var(--muted)]">{task.due || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!sorted.length && <div className="p-10 text-center text-sm text-[var(--muted)]">{language === "ru" ? "На доске пока нет карточек." : "There are no cards on this board yet."}</div>}
      </div>
    </div>
  );
}

export function BoardCalendarView({ board, columns, language, onOpenTask }: ViewProps) {
  const [cursor, setCursor] = useState(() => new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString(language === "ru" ? "ru-RU" : "en-US", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month, 1).getDay();
  const mondayOffset = (firstDay + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();

  const tasks = columns.flatMap(column => column.tasks.map(task => ({ task, column })));
  const byDay = new Map<number, { task: Task; column: Board["columns"][number] }[]>();

  tasks.forEach(({ task, column }) => {
    if (!task.due) return;
    let due = task.due;
    const lower = due.toLowerCase();
    if (lower === "today" || lower === "сегодня") due = new Date().toISOString().slice(0, 10);
    if (lower === "tomorrow" || lower === "завтра") {
      const next = new Date();
      next.setDate(next.getDate() + 1);
      due = next.toISOString().slice(0, 10);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) return;
    const date = new Date(due + "T00:00:00");
    if (date.getFullYear() !== year || date.getMonth() !== month) return;
    const day = date.getDate();
    byDay.set(day, [...(byDay.get(day) || []), { task, column }]);
  });

  return (
    <div className="mx-auto max-w-[1500px] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold capitalize">{monthLabel}</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">{language === "ru" ? "Сроки карточек этой доски." : "Due dates for cards on this board."}</p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-white/[.025] p-1">
          <button type="button" onClick={() => setCursor(new Date(year, month - 1, 1))} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/5">‹</button>
          <button type="button" onClick={() => setCursor(new Date())} className="rounded-lg px-3 py-1.5 text-xs text-[var(--muted)] hover:text-white">{language === "ru" ? "Сегодня" : "Today"}</button>
          <button type="button" onClick={() => setCursor(new Date(year, month + 1, 1))} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/5">›</button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/8 bg-black/10">
        <div className="grid grid-cols-7 border-b border-white/8">
          {(language === "ru" ? ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]).map(day => <div key={day} className="px-2 py-3 text-center text-[10px] uppercase tracking-[.12em] text-[var(--muted)]">{day}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: mondayOffset }).map((_, index) => <div key={"empty-" + index} className="min-h-32 border-b border-r border-white/5 bg-white/[.008]" />)}
          {Array.from({ length: days }, (_, index) => index + 1).map(day => (
            <div key={day} className="min-h-32 border-b border-r border-white/5 p-2">
              <div className="text-xs font-medium text-[var(--muted)]">{day}</div>
              <div className="mt-2 grid gap-1">
                {(byDay.get(day) || []).map(({ task, column }) => <button type="button" key={task.id} onClick={() => onOpenTask(column.id, task)} className="truncate rounded-lg border border-white/7 bg-white/[.03] px-2 py-1.5 text-left text-[10px] hover:border-[var(--accent)]/30"><span className="font-medium">{task.title}</span><span className="ml-1 text-[var(--muted)]">· {column.title}</span></button>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BoardDashboardView({ board, columns, language }: { board: Board; columns: Board["columns"]; language: "ru" | "en" }) {
  const all = columns.flatMap(column => column.tasks);
  const byPriority = {
    High: all.filter(task => task.priority === "High").length,
    Medium: all.filter(task => task.priority === "Medium").length,
    Low: all.filter(task => task.priority === "Low").length,
  };
  const blocked = all.filter(task => task.blocked).length;
  const withDue = all.filter(task => task.due).length;
  const doneColumn = board.columns.find(column => column.id === "done") || board.columns[board.columns.length - 1];
  const done = doneColumn?.tasks.length || 0;
  const progress = all.length ? Math.round((done / all.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1500px] p-4 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">{language === "ru" ? "Аналитика доски" : "Board analytics"}</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">{language === "ru" ? "Живой срез по карточкам этой доски." : "A live snapshot of this board's cards."}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title={language === "ru" ? "Всего карточек" : "Total cards"} value={all.length} icon={List} />
        <Metric title={language === "ru" ? "Готово" : "Done"} value={done} icon={CheckCircle2} />
        <Metric title={language === "ru" ? "Блокеры" : "Blocked"} value={blocked} icon={CircleAlert} />
        <Metric title={language === "ru" ? "Со сроком" : "With due date"} value={withDue} icon={CalendarDays} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/8 bg-black/10 p-5">
          <div className="flex items-center gap-2"><BarChart3 size={17} className="text-[var(--accent)]" /><h3 className="font-medium">{language === "ru" ? "По спискам" : "By list"}</h3></div>
          <div className="mt-4 grid gap-3">
            {columns.map(column => <div key={column.id}>
              <div className="flex items-center justify-between text-xs"><span>{column.title}</span><span className="text-[var(--muted)]">{column.tasks.length}</span></div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/6"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: (all.length ? (column.tasks.length / all.length) * 100 : 0) + "%" }} /></div>
            </div>)}
          </div>
        </section>

        <section className="rounded-3xl border border-white/8 bg-black/10 p-5">
          <div className="flex items-center gap-2"><Table2 size={17} className="text-[var(--accent)]" /><h3 className="font-medium">{language === "ru" ? "Приоритеты" : "Priorities"}</h3></div>
          <div className="mt-4 grid gap-3">
            {(["High","Medium","Low"] as const).map(priority => <div key={priority} className="flex items-center gap-3">
              <span className="w-20 text-xs text-[var(--muted)]">{language === "ru" ? (priority === "High" ? "Высокий" : priority === "Medium" ? "Средний" : "Низкий") : priority}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/6"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: (all.length ? (byPriority[priority] / all.length) * 100 : 0) + "%" }} /></div>
              <span className="w-6 text-right text-xs">{byPriority[priority]}</span>
            </div>)}
          </div>
          <div className="mt-6 rounded-2xl border border-white/7 bg-white/[.02] p-4"><div className="flex items-center justify-between text-xs"><span>{language === "ru" ? "Общий прогресс" : "Overall progress"}</span><strong>{progress}%</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/6"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: progress + "%" }} /></div></div>
        </section>
      </div>
    </div>
  );
}

function Metric({ title, value, icon: Icon }: { title: string; value: number; icon: typeof List }) {
  return <div className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><div className="flex items-center justify-between text-xs text-[var(--muted)]"><span>{title}</span><Icon size={15} className="text-[var(--accent)]" /></div><div className="mt-3 text-2xl font-semibold">{value}</div></div>;
}

export function BoardViewIcon({ view }: { view: "board" | "table" | "calendar" | "dashboard" }) {
  const Icon = view === "board" ? List : view === "table" ? Table2 : view === "calendar" ? CalendarDays : BarChart3;
  return <Icon size={14} />;
}
