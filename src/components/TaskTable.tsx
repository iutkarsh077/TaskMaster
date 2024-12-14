"use client";
import { Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { GetUserTask } from "../../actions/GetAllTask";
import { UpdateTaskDialog } from "./UpdateTaskDialog";
import { DeleteTask } from "../../actions/DeleteTask";

export interface Task {
  id?: string;
  title: string;
  priority: number;
  status: "Pending" | "Finished";
  startTime: Date | string;
  endTime: Date | string;
  totalHours: number;
}

export default function TaskTable() {
  const [userTask, setUserTask] = useState<Task[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showUpdateTaskDialog, setUpdateTaskDialog] = useState(false);
  const [addTaskToDelete, setAddTaskToDelete] = useState<Task[]>([]);
  const [loadAfterDelete, setLoadAfterDelete] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true);
      setError(null);
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
        setError(error.message || "An unexpected error occurred.");
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [showUpdateTaskDialog, loadAfterDelete]);

  const handleAddTaskForDelete = (task: any) => {
    setAddTaskToDelete((prevTasks: any[]) => {
      const isTaskAlreadyAdded = prevTasks.some(
        (existingTask) => existingTask.id === task.id
      );

      if (!isTaskAlreadyAdded) {
        return [...prevTasks, task];
      } else {
        return prevTasks.filter((existingTask) => existingTask.id !== task.id);
      }
    });
  };

  const handleDelete = async () => {
    if (addTaskToDelete.length === 0) {
      console.log("Enpty");
      return;
    }
    const deleteTaskIds = addTaskToDelete.map((task: any) => task.id);
    try {
      setLoadAfterDelete(true);
      const res = await DeleteTask(deleteTaskIds);
      if (res?.status === false) {
        throw new Error(res.msg);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadAfterDelete(false);
    }
  };
  return (
    <>
      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-4 text-center">Loading tasks...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">
            {error} <br />
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : userTask && userTask.length > 0 ? (
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="w-20">Task ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="text-right">
                  Total time to finish (hrs)
                </TableHead>
                <TableHead className="w-20">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userTask.map((task, index) => (
                <TableRow
                  key={task.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell onClick={() => handleAddTaskForDelete(task)}>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        task.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {typeof task.startTime === "string"
                      ? task.startTime
                      : task.startTime.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {typeof task.endTime === "string"
                      ? task.endTime
                      : task.endTime.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {Math.abs(
                      (new Date(task.endTime).getTime() -
                        new Date(task.startTime).getTime()) /
                        (1000 * 60 * 60)
                    ).toFixed(2)}
                  </TableCell>

                  <TableCell
                    onClick={() => {
                      setSelectedTask(task), setUpdateTaskDialog(true);
                    }}
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-4 text-center text-gray-600">
            No tasks available. Add a new task to get started!
          </div>
        )}
      </div>
      {addTaskToDelete.length !== 0 && (
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="text-black
      "
        >
          Delete Selected Task
        </Button>
      )}
      {showUpdateTaskDialog && (
        <UpdateTaskDialog
          showUpdateTaskDialog={showUpdateTaskDialog}
          setUpdateTaskDialog={setUpdateTaskDialog}
          selectedTask={selectedTask}
        />
      )}
    </>
  );
}
