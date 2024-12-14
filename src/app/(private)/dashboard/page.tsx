"use client";
import TaskTable, { Task } from "@/components/TaskTable";
import { useEffect, useState } from "react";
import { GetUserTask } from "../../../../actions/GetAllTask";

export default function Dashboard() {
  const [userTask, setUserTask] = useState<Task[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      try {
        const res = await GetUserTask();
        if (res.status === false) {
          throw new Error(res.msg || "Failed to fetch tasks");
        }
        const formattedTasks: Task[] = res.task!.map((task: any) => ({
          id: task.id,
          title: task.title,
          priority: parseInt(task.priority, 10),
          status: task.status as "Pending" | "Finished",
          startTime: new Date(task.startTime),
          endTime: new Date(task.endTime),
          totalHours: Number(task.totalHours),
        }));
        setUserTask(formattedTasks);
      } catch (error: any) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, []);

  const totalTasks = userTask?.length || 0;
  const completedTasks = userTask?.filter(task => task.status === "Finished") || [];
  const pendingTasks = userTask?.filter(task => task.status === "Pending") || [];
  const totalCompletedTasks = completedTasks.length;
  const totalPendingTasks = pendingTasks.length;

  const estimatedTimeToFinish = pendingTasks.reduce((acc, task) => {
    const endTime = new Date(task.endTime);
    const timeRemaining = endTime.getTime() - Date.now();
    return acc + (timeRemaining > 0 ? timeRemaining / (1000 * 60 * 60) : 0); // 
  }, 0);

  return (
    <>
      <div className="max-w-4xl p-6 space-y-8 mx-auto">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <span className="block text-3xl sm:text-4xl font-bold text-indigo-600">{totalTasks}</span>
              <span className="text-sm text-gray-500">Total tasks</span>
            </div>
            <div className="space-y-2">
              <span className="block text-3xl sm:text-4xl font-bold text-indigo-600">
                {totalTasks > 0 ? ((totalCompletedTasks / totalTasks) * 100).toFixed(2) : 0}%
              </span>
              <span className="text-sm text-gray-500">Tasks completed</span>
            </div>
            <div className="space-y-2">
              <span className="block text-3xl sm:text-4xl font-bold text-indigo-600">
                {totalTasks > 0 ? ((totalPendingTasks / totalTasks) * 100).toFixed(2) : 0}%
              </span>
              <span className="text-sm text-gray-500">Tasks pending</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Pending task summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <span className="block text-3xl sm:text-4xl font-bold text-indigo-600">{totalPendingTasks}</span>
              <span className="text-sm text-gray-500">Pending tasks</span>
            </div>
            <div className="space-y-2">
              <span className="block text-3xl sm:text-4xl font-bold text-indigo-600">{estimatedTimeToFinish.toFixed(2)} hrs</span>
              <span className="text-sm text-gray-500">Total time to finish</span>
              <span className="text-xs text-gray-400 italic">estimated based on endtime</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <TaskTable />
        </div>
      </div>
    </>
  );
}
