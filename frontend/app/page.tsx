// frontend/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Box, Text, Container, Heading, Input, Button, VStack, HStack, Spinner } from '@chakra-ui/react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTaskContent, setEditTaskContent] = useState(''); // New state for editing task content
  const [loading, setLoading] = useState(false);
  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
    setLoading(false);
  };

  const addOrUpdateTask = async () => {
    if (!newTask) return;

    try {
      setLoading(true);
      if (editTaskId !== null) {
        // Update task
        await fetch(`${backendUrl}/api/tasks/${editTaskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: editTaskContent }),
        });
        setEditTaskId(null);
        setEditTaskContent('');
      } else {
        // Add new task
        const response = await fetch(`${backendUrl}/api/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newTask }),
        });
        const task = await response.json();
        setTasks([...tasks, task]);
      }
      setNewTask('');
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Failed to add or update task:', error);
    }
    setLoading(false);
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${backendUrl}/api/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const startEditing = (task) => {
    setEditTaskId(task.id);
    setEditTaskContent(task.content); // Set the content of the task being edited
  };

  const handleEditChange = (event) => {
    setEditTaskContent(event.target.value);
  };

  const updateTask = async (id) => {
    if (!editTaskContent) return;

    try {
      setLoading(true);
      await fetch(`${backendUrl}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editTaskContent }),
      });
      setEditTaskId(null);
      setEditTaskContent('');
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Failed to update task:', error);
    }
    setLoading(false);
  };

  return (
    <Container centerContent>
      <Heading my={5}>Three-Tier To-Do App</Heading>
      <VStack spacing={4} align="stretch" width="100%">
        <HStack>
          <Input
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button colorScheme="teal" onClick={addOrUpdateTask}>
            {editTaskId !== null ? 'Update Task' : 'Add Task'}
          </Button>
        </HStack>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <Spinner size="xl" />
          </Box>
        ) : (
          tasks.map((task) => (
            <Box key={task.id} p={3} shadow="md" borderWidth="1px">
              <HStack justify="space-between">
                {editTaskId === task.id ? (
                  <Input
                    value={editTaskContent}
                    onChange={handleEditChange}
                    placeholder="Edit task"
                  />
                ) : (
                  <Text>{task.content}</Text>
                )}
                <HStack>
                  {editTaskId === task.id ? (
                    <Button size="sm" onClick={() => updateTask(task.id)}>
                      Save
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => startEditing(task)}>
                      Edit
                    </Button>
                  )}
                  <Button colorScheme="red" size="sm" onClick={() => deleteTask(task.id)}>
                    Delete
                  </Button>
                </HStack>
              </HStack>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
}
