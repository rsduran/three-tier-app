// frontend/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Box, Text, Container, Heading, Input, Button, VStack, HStack } from '@chakra-ui/react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const addTask = async () => {
    if (!newTask) return;
    try {
      const response = await fetch(`${backendUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newTask }),
      });
      const task = await response.json();
      setTasks([...tasks, task]);
      setNewTask('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
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
          <Button colorScheme="teal" onClick={addTask}>
            Add Task
          </Button>
        </HStack>
        {tasks.map((task) => (
          <Box key={task.id} p={3} shadow="md" borderWidth="1px">
            <HStack justify="space-between">
              <Text>{task.content}</Text>
              <Button colorScheme="red" size="sm" onClick={() => deleteTask(task.id)}>
                Delete
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}
