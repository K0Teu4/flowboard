"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "ru" | "en";

type Dictionary = {
  language: string;
  navFeatures: string;
  navPulse: string;
  navDemo: string;
  navPricing: string;
  signIn: string;
  startFree: string;
  tryDemo: string;
  builtForMomentum: string;
  heroTitle: string;
  heroCopy: string;
  realtime: string;
  noCard: string;
  smallTeams: string;
  workspace: string;
  collaborators: string;
  pulse: string;
  onTrack: string;
  done: string;
  active: string;
  blocked: string;
  coreWorkflow: string;
  everythingOnBoard: string;
  workflowCopy: string;
  visualWorkflow: string;
  visualWorkflowCopy: string;
  realtimeTitle: string;
  realtimeCopy: string;
  pulseTitle: string;
  pulseCopy: string;
  sharedContext: string;
  boardSays: string;
  pulseSays: string;
  today: string;
  focus: string;
  risk: string;
  nextMilestone: string;
  demoBoard: string;
  footerTagline: string;
  footerProduct: string;
  footerResources: string;
  footerProductLinks: string;
  footerResourceLinks: string;
  footerDemo: string;
  footerStatus: string;
  footerVersion: string;
  languageRussian: string;
  languageEnglish: string;
  createWorkspace: string;
  createWorkspaceCopy: string;
  name: string;
  email: string;
  password: string;
  createWorkspaceButton: string;
  authNote: string;
  alreadyAccount: string;
  noAccount: string;
  welcomeBack: string;
  signInCopy: string;
  signInButton: string;
  demoAuthNote: string;
  appWorkspace: string;
  overview: string;
  boards: string;
  calendar: string;
  members: string;
  settings: string;
  search: string;
  notifications: string;
  account: string;
  goodAfternoon: string;
  overviewCopy: string;
  completed: string;
  dueToday: string;
  needsAttention: string;
  activeBoards: string;
  openDemo: string;
  focusToday: string;
  keepMomentum: string;
  addFocus: string;
  noBoardsTitle: string;
  noBoardsCopy: string;
  viewDemo: string;
  createBoard: string;
  boardName: string;
  boardNamePlaceholder: string;
  save: string;
  cancel: string;
  demoWorkspace: string;
  demoWorkspaceCopy: string;
  back: string;
  share: string;
  add: string;
  searchBoard: string;
  passwordTooShort: string;
  accountExists: string;
  invalidCredentials: string;
};

const copy: Record<Language, Dictionary> = {
  ru: {
    language: "Язык",
    navFeatures: "Возможности",
    navPulse: "Пульс проекта",
    navDemo: "Демо",
    navPricing: "Тарифы",
    signIn: "Войти",
    startFree: "Начать бесплатно",
    tryDemo: "Открыть демо",
    builtForMomentum: "Для проектов, которым нужен темп",
    heroTitle: "Планируй.\nФокусируйся.\nДелай.",
    heroCopy: "Современное визуальное рабочее пространство для небольших команд и создателей. Управляй задачами в реальном времени, находи узкие места и держи внимание на следующем важном шаге.",
    realtime: "Совместная работа в реальном времени",
    noCard: "Без привязки карты",
    smallTeams: "Для небольших команд",
    workspace: "Рабочее пространство",
    collaborators: "участника онлайн",
    pulse: "Пульс проекта",
    onTrack: "в плане",
    done: "готово",
    active: "активных",
    blocked: "заблокировано",
    coreWorkflow: "Основной процесс",
    everythingOnBoard: "Всё важное — на одной доске.",
    workflowCopy: "Начинай с канбан-доски. Добавляй детали только тогда, когда они действительно нужны.",
    visualWorkflow: "Визуальный процесс",
    visualWorkflowCopy: "Карточки, списки, метки, сроки и чек-листы без визуального шума.",
    realtimeTitle: "Совместная работа по умолчанию",
    realtimeCopy: "Присутствие, живые изменения и совместные рабочие пространства на Liveblocks.",
    pulseTitle: "Пульс проекта",
    pulseCopy: "Лёгкий снимок состояния проекта показывает прогресс, блокеры и ближайшие риски.",
    sharedContext: "Общий контекст для команды",
    boardSays: "Доска показывает, что происходит.",
    pulseSays: "Пульс показывает, почему это важно.",
    today: "Сегодня",
    focus: "Фокус",
    risk: "Риск",
    nextMilestone: "Ближайший этап",
    demoBoard: "Редизайн сайта",
    footerTagline: "Планируй работу. Сохраняй фокус. Двигай проект вперёд.",
    footerProduct: "Продукт",
    footerResources: "Ресурсы",
    footerProductLinks: "Возможности|Пульс проекта|Тарифы",
    footerResourceLinks: "GitHub|Документация|Статус",
    footerDemo: "Открыть живое демо",
    footerStatus: "Система работает",
    footerVersion: "v0.5 · GitHub Pages",
    languageRussian: "Русский",
    languageEnglish: "English",
    createWorkspace: "Создай рабочее пространство",
    createWorkspaceCopy: "Начни с чистого рабочего пространства. Команду можно пригласить позже.",
    name: "Имя",
    email: "Почта",
    password: "Пароль",
    createWorkspaceButton: "Создать пространство",
    authNote: "В этой версии аккаунт сохраняется локально до подключения Supabase.",
    alreadyAccount: "Уже есть аккаунт?",
    noAccount: "Нет аккаунта?",
    welcomeBack: "С возвращением",
    signInCopy: "Войди, чтобы продолжить работу.",
    signInButton: "Войти",
    demoAuthNote: "Демо-авторизация сохранит локальное состояние аккаунта.",
    appWorkspace: "Flowboard",
    overview: "Обзор",
    boards: "Доски",
    calendar: "Календарь",
    members: "Участники",
    settings: "Настройки",
    search: "Поиск",
    notifications: "Уведомления",
    account: "Аккаунт",
    goodAfternoon: "Добрый день",
    overviewCopy: "Здесь будет состояние твоего рабочего пространства и то, что требует внимания.",
    completed: "Завершено",
    dueToday: "Сегодня",
    needsAttention: "Требует внимания",
    activeBoards: "Активные доски",
    openDemo: "Открыть демо",
    focusToday: "Фокус сегодня",
    keepMomentum: "Сохраняй темп",
    addFocus: "Добавить задачу в фокус",
    noBoardsTitle: "Рабочее пространство готово. Досок пока нет.",
    noBoardsCopy: "Здесь будут твои доски и задачи. После подключения Supabase данные будут доступны между устройствами.",
    viewDemo: "Посмотреть демо",
    createBoard: "Создать первую доску",
    boardName: "Название доски",
    boardNamePlaceholder: "Например, Запуск Flowboard",
    save: "Сохранить",
    cancel: "Отмена",
    demoWorkspace: "Рабочее пространство",
    demoWorkspaceCopy: "Интерактивное демо Flowboard",
    back: "Назад",
    share: "Поделиться",
    add: "Добавить",
    searchBoard: "Поиск по доске",
    passwordTooShort: "Заполни все поля. Пароль — минимум 6 символов.",
    accountExists: "Пользователь с такой почтой уже существует на этом устройстве.",
    invalidCredentials: "Неверная почта или пароль.",
  },
  en: {
    language: "Language",
    navFeatures: "Features",
    navPulse: "Project Pulse",
    navDemo: "Demo",
    navPricing: "Pricing",
    signIn: "Sign in",
    startFree: "Start free",
    tryDemo: "Open demo",
    builtForMomentum: "Built for projects that need momentum",
    heroTitle: "Plan.\nFocus.\nShip.",
    heroCopy: "A modern visual workspace for small teams and makers. Manage tasks in realtime, spot bottlenecks early, and keep attention on the next important step.",
    realtime: "Realtime collaboration",
    noCard: "No credit card",
    smallTeams: "Built for small teams",
    workspace: "Workspace",
    collaborators: "collaborators online",
    pulse: "Project Pulse",
    onTrack: "on track",
    done: "done",
    active: "active",
    blocked: "blocked",
    coreWorkflow: "Core workflow",
    everythingOnBoard: "Everything important on one board.",
    workflowCopy: "Start simple with Kanban. Add detail only when the project needs it.",
    visualWorkflow: "Visual workflow",
    visualWorkflowCopy: "Cards, lists, labels, deadlines and checklists without visual clutter.",
    realtimeTitle: "Realtime by default",
    realtimeCopy: "Presence, live updates and collaborative workspaces powered by Liveblocks.",
    pulseTitle: "Project Pulse",
    pulseCopy: "A lightweight health snapshot surfaces progress, blockers and upcoming risk.",
    sharedContext: "Designed around shared context",
    boardSays: "The board tells you what is happening.",
    pulseSays: "Pulse tells you why it matters.",
    today: "Today",
    focus: "Focus",
    risk: "Risk",
    nextMilestone: "Next milestone",
    demoBoard: "Website redesign",
    footerTagline: "Plan work. Keep focus. Move the project forward.",
    footerProduct: "Product",
    footerResources: "Resources",
    footerProductLinks: "Features|Project Pulse|Pricing",
    footerResourceLinks: "GitHub|Documentation|Status",
    footerDemo: "Open live demo",
    footerStatus: "All systems operational",
    footerVersion: "v0.4 GitHub Pages ready",
    languageRussian: "Русский",
    languageEnglish: "English",
    createWorkspace: "Create your workspace",
    createWorkspaceCopy: "Start with a clean workspace. Invite your team later.",
    name: "Name",
    email: "Email",
    password: "Password",
    createWorkspaceButton: "Create workspace",
    authNote: "In this version the account is stored locally until Supabase is connected.",
    alreadyAccount: "Already have an account?",
    noAccount: "No account?",
    welcomeBack: "Welcome back",
    signInCopy: "Sign in to continue to your workspace.",
    signInButton: "Sign in",
    demoAuthNote: "Demo auth will store local account state.",
    appWorkspace: "Flowboard",
    overview: "Overview",
    boards: "Boards",
    calendar: "Calendar",
    members: "Members",
    settings: "Settings",
    search: "Search",
    notifications: "Notifications",
    account: "Account",
    goodAfternoon: "Good afternoon",
    overviewCopy: "Your workspace state and the work that needs attention will appear here.",
    completed: "Completed",
    dueToday: "Due today",
    needsAttention: "Needs attention",
    activeBoards: "Active boards",
    openDemo: "Open demo",
    focusToday: "Focus today",
    keepMomentum: "Keep momentum",
    addFocus: "Add focus task",
    noBoardsTitle: "Workspace ready. No boards yet.",
    noBoardsCopy: "Demo data lives separately on the Demo page. Next we will connect real boards and persistence through Supabase.",
    viewDemo: "View demo",
    createBoard: "Create first board",
    boardName: "Board name",
    boardNamePlaceholder: "For example, Flowboard launch",
    save: "Save",
    cancel: "Cancel",
    demoWorkspace: "Workspace",
    demoWorkspaceCopy: "Interactive Flowboard demo",
    back: "Back",
    share: "Share",
    add: "Add",
    searchBoard: "Search board",
    passwordTooShort: "Fill in all fields. Password must be at least 6 characters.",
    accountExists: "An account with this email already exists on this device.",
    invalidCredentials: "Incorrect email or password.",
  },
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  copy: Dictionary;
}>({ language: "ru", setLanguage: () => undefined, toggleLanguage: () => undefined, copy: copy.ru });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    const stored = window.localStorage.getItem("flowboard-language");
    if (stored === "ru" || stored === "en") setLanguageState(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("flowboard-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: (next: Language) => setLanguageState(next),
      toggleLanguage: () => setLanguageState((current) => (current === "ru" ? "en" : "ru")),
      copy: copy[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
