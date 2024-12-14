import { AddTaskDialog } from "@/components/AddTaskDialog";
import TaskTable from "@/components/TaskTable";
import React from "react";

const Home = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-16">
      <div className="text-xl sm:text-2xl lg:text-3xl font-semibold">Task List</div>
      <div className="space-y-5 mt-5">
        <AddTaskDialog />
        <div className="overflow-x-auto">
          <TaskTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
