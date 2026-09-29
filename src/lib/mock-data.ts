export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  labels: string[];
  due?: string;
  assignee?: string;
  checklist?: string;
  comments?: number;
  attachments?: number;
  blocked?: boolean;
};

export type BoardColumn = {
  id: string;
  title: string;
  tasks: Task[];
};

export const boardColumns: BoardColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [
      { id: "t1", title: "Define onboarding flow", priority: "Medium", labels: ["Product"], assignee: "DK", comments: 3 },
      { id: "t2", title: "Prepare launch checklist", priority: "Low", labels: ["Launch"], checklist: "2/8", assignee: "AM" },
      { id: "t3", title: "Review analytics events", priority: "Medium", labels: ["Data"], attachments: 1 },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    tasks: [
      { id: "t4", title: "Build dashboard", priority: "High", labels: ["Frontend"], due: "Today", assignee: "DK", checklist: "4/7", comments: 4 },
      { id: "t5", title: "Connect workspace roles", priority: "High", labels: ["Backend"], due: "Tomorrow", assignee: "AM", blocked: true, comments: 2 },
      { id: "t6", title: "Polish empty states", priority: "Low", labels: ["UX"], assignee: "DK" },
    ],
  },
  {
    id: "review",
    title: "Review",
    tasks: [
      { id: "t7", title: "Workspace settings", priority: "Medium", labels: ["UX"], due: "Oct 2", assignee: "AM", comments: 1 },
      { id: "t8", title: "Invite flow copy", priority: "Low", labels: ["Content"], assignee: "DK", attachments: 2 },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      { id: "t9", title: "Landing page", priority: "Medium", labels: ["Frontend"], assignee: "DK" },
      { id: "t10", title: "Authentication", priority: "High", labels: ["Backend"], assignee: "AM", checklist: "6/6" },
      { id: "t11", title: "Database schema draft", priority: "High", labels: ["Backend"], attachments: 1 },
    ],
  },
];

export const members = [
  { name: "Dmitry", initials: "DK", status: "online", role: "Owner" },
  { name: "Alex", initials: "AM", status: "online", role: "Admin" },
  { name: "Maria", initials: "MK", status: "idle", role: "Member" },
];
