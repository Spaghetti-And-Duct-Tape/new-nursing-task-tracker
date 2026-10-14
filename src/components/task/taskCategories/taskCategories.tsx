import { List, Pill, UserRound } from "lucide-react";
import styles from "./taskCategories.module.css";
import type { TaskCategory, TaskInstance } from "../../../types/task";
import { filterTaskCategories } from "../../../utils/tasks/organizeTasks";

interface TaskCategoriesProps {
  tasks: TaskInstance[];
  activeCategory: Exclude<TaskCategory, "chart"> | "all";
  setActiveCategory: (category: Exclude<TaskCategory, "chart"> | "all") => void;
};

function tasksByCategories(
  allTasksCount: number,
  medicationTasksCount: number,
  personalTasksCount: number
) {
  return [{
      id: "all" as const,
      label: "All Tasks",
      count: allTasksCount,
      icon: List,
      className: styles.allTasks
    }, {
      id: "medication" as const,
      label: "Medications",
      count: medicationTasksCount,
      icon: Pill,
      className: styles.medications
    }, {
      id: "personal" as const, 
      label: "Personal",
      count: personalTasksCount,
      icon: UserRound,
      className: styles.personal
    }
  ];
};

export default function TaskCategories({
  tasks,
  activeCategory,
  setActiveCategory
}: TaskCategoriesProps) {
  const medicationTasks = filterTaskCategories(
    tasks,
    "medication"
  );
  const personalTasks = filterTaskCategories(
    tasks,
    "personal"
  );

  const categories = tasksByCategories(
    tasks.length,
    medicationTasks.length,
    personalTasks.length
  );

  return (
    <div className={styles.categories}>
      {categories.map(category => {
        const Icon = category.icon;

        return (
          <button
            key={category.id}
            type="button"
            className={
              `${styles.categoryButton} ${
                activeCategory === category.id ?
                  styles.active :
                  ""
              }`
            }
            onClick={() => setActiveCategory(category.id)}
          >
            <span
              className={`${styles.categoryCircle} ${category.className}`}
            >
              <Icon size={22} strokeWidth={2.3} />
            </span>

            <span className={styles.categoryCount}>
              {category.count}
            </span>

            <span className={styles.categoryLabel}>
              {category.label}
            </span>
          </button>
        )
      })}
    </div>
  )
};