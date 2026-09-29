"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { boardColumns, members as initialMembers, type BoardColumn, type Task } from "@/lib/mock-data";

export type Board = {
  id: string;
  title: string;
  description: string;
  columns: BoardColumn[];
  createdAt: string;
};

type Activity = { id: string; text: string; at: string };

type WorkspaceState = {
  boards: Board[];
  members: typeof initialMembers;
  activity: Activity[];
};

const KEY = "flowboard-workspace-v3";

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
};

function cloneSampleBoard(): Board {
  return {
    id: "demo-board",
    title: "Редизайн сайта",
    description: "Публичная демонстрация возможностей Flowboard.",
    columns: structuredClone(boardColumns),
    createdAt: new Date().toISOString(),
  };
}

function readState(): WorkspaceState {
  if (typeof window === "undefined") return { boards: [], members: initialMembers, activity: [] };
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return { boards: [], members: initialMembers, activity: [] };
  try { return JSON.parse(raw) as WorkspaceState; } catch { return { boards: [], members: initialMembers, activity: [] }; }
}

const WorkspaceContext = createContext<null | {
  state: WorkspaceState;
  createBoard: (title: string, description?: string) => Board;
  renameBoard: (boardId: string, title: string) => void;
  deleteBoard: (boardId: string) => void;
  addColumn: (boardId: string, title: string) => void;
  renameColumn: (boardId: string, columnId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  addTask: (boardId: string, columnId: string, task?: Partial<Task>) => void;
  updateTask: (boardId: string, taskId: string, patch: Partial<Task>) => void;
  deleteTask: (boardId: string, taskId: string) => void;
  moveTask: (boardId: string, taskId: string, fromColumnId: string, toColumnId: string) => void;
  addComment: (boardId: string, taskId: string, body: string) => void;
  resetWorkspace: () => void;
  seedStarterBoard: () => Board;
}>(null);

function now() { return new Date().toISOString(); }

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>({ boards: [], members: initialMembers, activity: [] });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setState(readState()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) window.localStorage.setItem(KEY, JSON.stringify(state)); }, [hydrated, state]);

  const withActivity = (next: WorkspaceState, text: string): WorkspaceState => ({
    ...next,
    activity: [{ id: crypto.randomUUID(), text, at: now() }, ...next.activity].slice(0, 80),
  });

  const api = useMemo(() => ({
    state,
    createBoard(title: string, description = "") {
      const board: Board = { id: crypto.randomUUID(), title, description, columns: ["Бэклог", "В работе", "Проверка", "Готово"].map((t, i) => ({ id: `${crypto.randomUUID()}-${i}`, title: t, tasks: [] })), createdAt: now() };
      setState(prev => withActivity({ ...prev, boards: [...prev.boards, board] }, `Создана доска «${title}»`));
      return board;
    },
    renameBoard(boardId: string, title: string) {
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, title } : b) }, `Переименована доска в «${title}»`));
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
      const nextTask: Task = { id: crypto.randomUUID(), title: task.title?.trim() || "Новая задача", priority: task.priority || "Medium", labels: task.labels || [], ...task } as Task;
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.map(c => c.id === columnId ? { ...c, tasks: [...c.tasks, nextTask] } : c) } : b) }, `Добавлена задача «${nextTask.title}»`));
    },
    updateTask(boardId: string, taskId: string, patch: Partial<Task>) {
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.map(c => ({ ...c, tasks: c.tasks.map(t => t.id === taskId ? { ...t, ...patch } : t) })) } : b) }, patch.title ? `Обновлена задача «${patch.title}»` : "Обновлена задача"));
    },
    deleteTask(boardId: string, taskId: string) {
      setState(prev => withActivity({ ...prev, boards: prev.boards.map(b => b.id === boardId ? { ...b, columns: b.columns.map(c => ({ ...c, tasks: c.tasks.filter(t => t.id !== taskId) })) } : b) }, "Задача удалена"));
    },
    moveTask(boardId: string, taskId: string, fromColumnId: string, toColumnId: string) {
      if (fromColumnId === toColumnId) return;
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
        return withActivity({ ...prev, boards }, moving ? `Задача «${moving.title}» перемещена` : "Перемещена задача");
      });
    },
    addComment(boardId: string, taskId: string, body: string) {
      const comment = body.trim();
      if (!comment) return;
      setState(prev => withActivity(prev, "Добавлен комментарий к задаче"));
    },
    resetWorkspace() {
      window.localStorage.removeItem(KEY);
      setState({ boards: [], members: initialMembers, activity: [] });
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
