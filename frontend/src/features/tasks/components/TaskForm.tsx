'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useCreateTask } from '../hooks';

/**
 * Форма создания задачи. Управляемые поля через useState — для формы такого
 * размера (4 поля) это проще и читабельнее, чем подключать react-hook-form,
 * который оправдан при больших формах с сложной кросс-валидацией.
 */
export function TaskForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState([5]);
    const [category, setCategory] = useState('');

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
            },
            {
                onSuccess: () => {
                    // Сброс формы только при успехе — при ошибке пользователь
                    // не должен терять то, что уже напечатал
                    setTitle('');
                    setDescription('');
                    setPriority([5]);
                    setCategory('');
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

            <div className="grid grid-cols-2 gap-4">
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
                    <Label>
                        Priority: <span className="font-semibold">{priority[0]}</span>/10
                    </Label>
                    <Slider
                        value={priority}
                        onValueChange={(value) => {
                            // Base UI Slider может вернуть одиночное число или массив (range-режим) —
                            // у нас всегда single-slider, но типы это не гарантируют, поэтому нормализуем
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