'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCreateTask } from '../hooks';

export function TaskForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState([5]);
    const [category, setCategory] = useState('');
    const [dueDate, setDueDate] = useState('');

    const createTask = useCreateTask();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        createTask.mutate(
            {
                title: title.trim(),
                description: description.trim() || undefined,
                priority: priority[0],
                category: category.trim() || undefined,
                // input type="date" отдаёт "YYYY-MM-DD" — конвертируем в полноценный
                // ISO datetime, так как backend (Zod) ожидает z.string().datetime()
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            },
            {
                onSuccess: () => {
                    setTitle('');
                    setDescription('');
                    setPriority([5]);
                    setCategory('');
                    setDueDate('');
                },
            },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    maxLength={200}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more details..."
                    maxLength={2000}
                    rows={2}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category (optional)</Label>
                    <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Work, Personal"
                        maxLength={50}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due date (optional)</Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="space-y-2">
                    <Label>
                        Priority: <span className="font-semibold">{priority[0]}</span>/10
                    </Label>
                    <Slider
                        value={priority}
                        onValueChange={(value) => {
                            setPriority(Array.isArray(value) ? [...value] : [value]);
                        }}
                        min={1}
                        max={10}
                        step={1}
                        className="mt-3"
                    />
                </div>
            </div>

            <Button type="submit" disabled={createTask.isPending || !title.trim()} className="w-full">
                {createTask.isPending ? 'Adding...' : 'Add task'}
            </Button>
        </form>
    );
}