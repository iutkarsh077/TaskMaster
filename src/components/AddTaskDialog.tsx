"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AddTask } from "../../actions/Addtask";
import { Loader2 } from "lucide-react";

export function AddTaskDialog() {
  const [isFinished, setIsFinished] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("1");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    setLoading(true);
    const taskData = {
      title,
      priority,
      status: isFinished ? "Finished" : "Pending",
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    };
    try {
      const res = await AddTask(taskData);
      
      if(res.status === false){
        throw new Error(res.msg);
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
      setLoading(false)
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add new task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add new task
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Apply for new jobs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select defaultValue="1" onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-muted-foreground">Pending</span>
                <Switch checked={isFinished} onCheckedChange={setIsFinished} />
                <span className="text-sm text-muted-foreground">Finished</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start time</Label>
              <Input
                type="datetime-local"
                id="start-time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End time</Label>
              <Input
                type="datetime-local"
                id="end-time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={handleAddTask}
          >
            {loading === false ? "Add task" : <Loader2 className="animate-spin"/>}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
