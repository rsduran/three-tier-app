// frontend/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Box, Text, Container, Heading, Input, Button, VStack, HStack, Spinner } from '@chakra-ui/react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
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
          body: JSON.stringify({ content: newTask }),
        });
        setEditTaskId(null);
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
    setNewTask(task.content);
  };

  return (
    <Container centerContent>
      <Heading my={5}>Three-Tier To-Do App</Heading>
      <VStack spacing={4} align="stretch" width="100%">
        <HStack>
          <Input
            placeholder="Add or update a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button colorScheme="teal" onClick={addOrUpdateTask}>
            {editTaskId !== null ? 'Update Task' : 'Add Task'}
          </Button>
        </HStack>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          tasks.map((task) => (
            <Box key={task.id} p={3} shadow="md" borderWidth="1px">
              <HStack justify="space-between">
                <Text>{task.content}</Text>
                <HStack>
                  <Button size="sm" onClick={() => startEditing(task)}>
                    Edit
                  </Button>
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
