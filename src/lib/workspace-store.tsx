"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { boardColumns, members as initialMembers, type BoardColumn, type Task } from "@/lib/mock-data";
import { getCurrentUser } from "@/lib/auth-store";

export type BoardTemplate = "blank" | "product" | "content" | "personal";

export type Board = {
  id: string;
  title: string;
  description: string;
  columns: BoardColumn[];
  createdAt: string;
  favorite?: boolean;
  background?: string;
};

type Activity = { id: string; text: string; at: string };

type WorkspaceState = {
  boards: Board[];
  members: typeof initialMembers;
  activity: Activity[];
  membersVersion: 1;
};

const LEGACY_KEY = "flowboard-workspace-v3";
function workspaceKey() {
  const user = getCurrentUser();
  return user ? `flowboard-workspace-${user.id}` : LEGACY_KEY;
}

const starterBoard: Board = {
  id: "board-demo",
  title: "Мой первый проект",
  description: "Рабочая доска для первых задач.",
  columns: ["Бэклог", "В работе", "Проверка", "Готово"].map((title, index) => ({
    id: ["backlog", "progress", "review", "done"][index],
    title,
    tasks: index === 0 ? [{ id: "starter-1", title: "Создай первую задачу", priority: "Medium", labels: ["Старт"], description: "Открой карточку и добавь описание, срок и чек-лист." }] : [],
  })),
  createdAt: new Date().toISOString(),
  background: "mint",
  favorite: false,
};

function cloneSampleBoard(): Board {
  return {
    id: "demo-board",
    title: "Редизайн сайта",
    description: "Публичная демонстрация возможностей Flowboard.",
    columns: structuredClone(boardColumns),
    createdAt: new Date().toISOString(),
    background: "mint",
    favorite: false,
  };
}

function readState(): WorkspaceState {
  if (typeof window === "undefined") return { boards: [], members: [], activity: [], membersVersion: 1 };
  const user = getCurrentUser();
  if (!user) return { boards: [], members: [], activity: [], membersVersion: 1 };
  const raw = window.localStorage.getItem(workspaceKey());
  if (!raw) return { boards: [], members: [], activity: [], membersVersion: 1 };
  try { return JSON.parse(raw) as WorkspaceState; } catch { return { boards: [], members: [], activity: [], membersVersion: 1 }; }
}

const WorkspaceContext = createContext<null | {
  state: WorkspaceState;
  createBoard: (title: string, description?: string, template?: BoardTemplate, language?: "ru" | "en") => Board;
  renameBoard: (boardId: string, title: string) => void;
  duplicateBoard: (boardId: string) => Board | null;
  reorderColumns: (boardId: string, fromIndex: number, toIndex: number) => void;
  toggleFavorite: (boardId: string) => void;
  setBackground: (boardId: string, background: string) => void;
  deleteBoard: (boardId: string) => void;
  addColumn: (boardId: string, title: string) => void;
  renameColumn: (boardId: string, columnId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addTask: (boardId: string, columnId: string, task?: Partial<Task>) => void;
  updateTask: (boardId: string, taskId: string, patch: Partial<Task>) => void;
  deleteTask: (boardId: string, taskId: string) => void;
  moveTask: (boardId: string, taskId: string, fromColumnId: string, toColumnId: string) => void;
  moveTaskToIndex: (boardId: string, taskId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void;
  addComment: (boardId: string, taskId: string, body: string) => void;
  addChecklistItem: (boardId: string, taskId: string, text: string) => void;
  toggleChecklistItem: (boardId: string, taskId: string, itemId: string) => void;
  deleteChecklistItem: (boardId: string, taskId: string, itemId: string) => void;
  resetWorkspace: () => void;
  seedStarterBoard: () => Board;
}>(null);

function now() { return new Date().toISOString(); }

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>({ boards: [], members: [], activity: [], membersVersion: 1 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const reload = () => setState(readState());
    reload();
    setHydrated(true);
    window.addEventListener("flowboard-auth-changed", reload);
    return () => window.removeEventListener("flowboard-auth-changed", reload);
  }, []);
  useEffect(() => { if (hydrated) window.localStorage.setItem(workspaceKey(), JSON.stringify(state)); }, [hydrated, state]);

  const withActivity = (next: WorkspaceState, text: string): WorkspaceState => ({
    ...next,
    activity: [{ id: crypto.randomUUID(), text, at: now() }, ...next.activity].slice(0, 80),
  });

  const api = useMemo(() => ({
    state,
    createBoard(title: string, description = "", template: BoardTemplate = "blank", language: "ru" | "en" = "ru") {
      const names = language === "ru" ? {
        blank: ["Бэклог", "В работе", "Проверка", "Готово"],
        product: ["Идеи", "План", "В работе", "Проверка", "Готово"],
        content: ["Идеи", "Подготовка", "В работе", "На согласовании", "Опубликовано"],
        personal: ["Входящие", "Сегодня", "В процессе", "Готово"],
      } : {
        blank: ["Backlog", "In progress", "Review", "Done"],
        product: ["Ideas", "Planned", "In progress", "Review", "Done"],
        content: ["Ideas", "Preparing", "In progress", "Approval", "Published"],
        personal: ["Inbox", "Today", "In progress", "Done"],
      };
      const seedTasks: Record<Exclude<BoardTemplate, "blank">, string[]> = language === "ru" ? {
        product: ["Сформулировать цель проекта", "Собрать требования", "Подготовить первый релиз"],
        content: ["Собрать темы", "Подготовить черновик", "Проверить материалы"],
        personal: ["Разобрать входящие", "Выбрать главное на сегодня"],
      } : {
        product: ["Define the project goal", "Collect requirements", "Prepare the first release"],
        content: ["Collect topics", "Prepare a draft", "Review materials"],
        personal: ["Process your inbox", "Choose today’s priorities"],
      };
      const columnNames = names[template];
      const columns = columnNames.map((name, index) => ({
        id: `${crypto.randomUUID()}-${index}`,
        title: name,
        tasks: index === 0 && template !== "blank" ? seedTasks[template].map((taskTitle, taskIndex) => ({ id: crypto.randomUUID(), title: taskTitle, priority: taskIndex === 0 ? ("High" as Task["priority"]) : ("Medium" as Task["priority"]), labels: [template === "product" ? (language === "ru" ? "Продукт" : "Product") : template === "content" ? (language === "ru" ? "Контент" : "Content") : (language === "ru" ? "Личное" : "Personal")] })) : [],
      }));
      const board: Board = { id: crypto.randomUUID(), title, description, columns, createdAt: now(), background: "mint", favorite: false };
      setState(prev => withActivity({ ...prev, boards: [...prev.boards, board] }, `Создана доска «${title}»`));
      return board;
    },
    renameBoard(boardId: string, title: string) {
      const clean = title.trim();
      if (!clean) return;
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, title: clean } : b) }, `Переименована доска в «${clean}»`));
    },
    duplicateBoard(boardId: string) {
      const original = state.boards.find(b => b.id === boardId);
      if (!original) return null;
      const clone: Board = {
        ...structuredClone(original),
        id: crypto.randomUUID(),
        title: original.title + " — копия",
        createdAt: now(),
        favorite: false,
        columns: original.columns.map(column => ({
          ...column,
          id: crypto.randomUUID(),
          tasks: column.tasks.map(task => ({ ...task, id: crypto.randomUUID() })),
        })),
      };
      setState(prev => withActivity({ ...prev, boards: [...prev.boards, clone] }, "Создана копия доски «" + clone.title + "»"));
      return clone;
    },
    reorderColumns(boardId: string, fromIndex: number, toIndex: number) {
      setState(prev => withActivity({
        ...prev,
        boards: prev.boards.map(board => {
          if (board.id !== boardId || fromIndex === toIndex) return board;
          const columns = [...board.columns];
          const [moving] = columns.splice(fromIndex, 1);
          if (!moving) return board;
          columns.splice(Math.max(0, Math.min(toIndex, columns.length)), 0, moving);
          return { ...board, columns };
        }),
      }, "Изменён порядок списков"));
    },
    toggleFavorite(boardId: string) {
      setState(prev => ({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, favorite: !b.favorite } : b) }));
    },
    setBackground(boardId: string, background: string) {
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, background } : b) }, "Изменён фон доски"));
    },
    deleteBoard(boardId: string) {
      setState(prev => withActivity({ ...prev, boards: prev.boards.filter(b => b.id !== boardId) }, "Доска удалена"));
    },
    addColumn(boardId: string, title: string) {
      const column: BoardColumn = { id: crypto.randomUUID(), title, tasks: [] };
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: [...b.columns, column] } : b) }, `Добавлена колонка «${title}»`));
    },
    renameColumn(boardId: string, columnId: string, title: string) {
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.map(c => c.id === columnId ? { ...c, title } : c) } : b) }, `Колонка переименована в «${title}»`));
    },
    deleteColumn(boardId: string, columnId: string) {
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.filter(c => c.id !== columnId) } : b) }, "Колонка удалена"));
    },
    addTask(boardId: string, columnId: string, task: Partial<Task> = {}) {
      const nextTask: Task = { id: crypto.randomUUID(), title: task.title?.trim() || "Новая задача", priority: task.priority || "Medium", labels: task.labels || [], commentItems: [], checklistItems: [], comments: 0, ...task } as Task;
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.map(c => c.id === columnId ? { ...c, tasks: [...c.tasks, nextTask] } : c) } : b) }, `Добавлена задача «${nextTask.title}»`));
    },
    updateTask(boardId: string, taskId: string, patch: Partial<Task>) {
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.map(c => ({ ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, ...patch } : t) })) } : b) }, patch.title ? `Обновлена задача «${patch.title}»` : "Обновлена задача"));
    },
    deleteTask(boardId: string, taskId: string) {
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.map(c => ({ ...c, tasks: c.tasks.filter(t => t.id !== taskId) })) } : b) }, "Задача удалена"));
    },
    moveTask(boardId: string, taskId: string, fromColumnId: string, toColumnId: string) {
      let moving: Task | undefined;
      setState(prev => {
        let boards = prev.boards.map(b => {
          if (b.id !== boardId) return b;
          const columns = b.columns.map(c => {
            if (c.id === fromColumnId) {
              moving = c.tasks.find(t => t.id === taskId);
              return { ...c, tasks: c.tasks.filter(t => t.id !== taskId) };
            }
            return c;
          }).map(c => c.id === toColumnId && moving ? { ...c, tasks: [...c.tasks, moving] } : c);
          return { ...b, columns };
        });
        return moving ? withActivity({ ...prev, boards }, `Задача «${moving.title}» перемещена`) : prev;
      });
    },
    moveTaskToIndex(boardId: string, taskId: string, fromColumnId: string, toColumnId: string, toIndex: number) {
      setState(prev => {
        const board = prev.boards.find(item => item.id === boardId);
        const source = board?.columns.find(item => item.id === fromColumnId);
        const moving = source?.tasks.find(item => item.id === taskId);
        if (!board || !source || !moving) return prev;

        const nextColumns = board.columns.map(column => ({ ...column, tasks: [...column.tasks] }));
        const sourceIndex = nextColumns.find(item => item.id === fromColumnId)?.tasks.findIndex(item => item.id === taskId) ?? -1;
        if (sourceIndex < 0) return prev;

        nextColumns.find(item => item.id === fromColumnId)!.tasks.splice(sourceIndex, 1);
        const target = nextColumns.find(item => item.id === toColumnId);
        if (!target) return prev;
        const adjustedIndex = fromColumnId === toColumnId && sourceIndex < toIndex ? toIndex - 1 : toIndex;
        target.tasks.splice(Math.max(0, Math.min(adjustedIndex, target.tasks.length)), 0, moving);

        return withActivity(
          { ...prev, boards: prev.boards.map(item => item.id === boardId ? { ...item, columns: nextColumns } : item) },
          `Задача «${moving.title}» перемещена`,
        );
      });
    },
    addComment(boardId: string, taskId: string, body: string) {
      const comment = body.trim();
      if (!comment) return;
      const author = getCurrentUser()?.name || "Dmitry";
      const item = { id: crypto.randomUUID(), author, body: comment, createdAt: now() };
      setState(prev => withActivity({
        ...prev,
        boards: prev.boards.map(b => b.id === boardId ? {
          ...b,
          columns: b.columns.map(c => ({ ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, commentItems: [...(t.commentItems || []), item], comments: (t.comments || 0) + 1 } : t) })),
        } : b),
      }, "Добавлен комментарий к задаче"));
    },
    addChecklistItem(boardId: string, taskId: string, text: string) {
      const clean = text.trim();
      if (!clean) return;
      const item = { id: crypto.randomUUID(), text: clean, done: false };
      setState(prev => withActivity({
        ...prev,
        boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.map(c => ({ ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, checklistItems: [...(t.checklistItems || []), item], checklist: `${(t.checklistItems || []).filter(i => i.done).length}/${(t.checklistItems || []).length + 1}` } : t) })) } : b),
      }, `Добавлен пункт «${clean}»`));
    },
    toggleChecklistItem(boardId: string, taskId: string, itemId: string) {
      setState(prev => withActivity({
        ...prev,
        boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.map(c => ({ ...c, tasks: c.tasks.map(t => {
          if (t.id !== taskId) return t;
          const items = (t.checklistItems || []).map(item => item.id === itemId ? { ...item, done: !item.done } : item);
          return { ...t, checklistItems: items, checklist: items.length ? `${items.filter(i => i.done).length}/${items.length}` : undefined };
        }) })) } : b),
      }, "Обновлён чек-лист"));
    },
    deleteChecklistItem(boardId: string, taskId: string, itemId: string) {
      setState(prev => withActivity({
        ...prev,
        boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.map(c => ({ ...c, tasks: c.tasks.map(t => {
          if (t.id !== taskId) return t;
          const items = (t.checklistItems || []).filter(item => item.id !== itemId);
          return { ...t, checklistItems: items, checklist: items.length ? `${items.filter(i => i.done).length}/${items.length}` : undefined };
        }) })) } : b),
      }, "Удалён пункт чек-листа"));
    },
    resetWorkspace() {
      window.localStorage.removeItem(workspaceKey());
      setState({ boards: [], members: [], activity: [], membersVersion: 1 });
    },
    seedStarterBoard() {
      setState(prev => withActivity({ ...prev, boards: [starterBoard, ...prev.boards] }, `Создана доска «${starterBoard.title}»`));
      return starterBoard;
    },
  }), [state]);

  return <WorkspaceContext.Provider value={api}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return value;
}

export function getDemoBoard() { return cloneSampleBoard(); }
