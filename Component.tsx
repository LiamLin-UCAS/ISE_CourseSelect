// src/components/StudentRegistration.tsx
import React, { useState, useEffect } from 'react';
import { Button, TextField, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import axios from 'axios';

interface Course {
    id: number;
    name: string;
    code: string;
}

const StudentRegistration: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>(defaultCourses);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [newCourse, setNewCourse] = useState<Course>({ id: 0, name: '', code: '' });

    useEffect(() => {
        // Fetch courses from the backend API using axios
        axios.get('/api/courses')
            .then(response => setCourses(response.data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    const handleSearch = () => {
        // Implement search logic based on the searchTerm
        axios.get('/api/courses')
            .then(response => setCourses(response.data))
            .catch(error => console.error('Error searching courses:', error));

    };

    const handleAddCourse = () => {
        // Implement logic to add a new course to the backend
        axios.post('/api/addEnroll', newCourse)
            .then(response => setCourses([...courses, response.data]))
            .catch(error => console.error('Error adding course:', error));
    };

    const handleUpdateCourse = (id: number) => {
        // Implement logic to update an existing course on the backend
        axios.post('/api/enroll', newCourse)
            .then(response => setCourses(courses.map(course => course.id === id ? response.data : course)))
            .catch(error => console.error('Error updating course:', error));
    };

    const handleDeleteCourse = (id: number) => {
        // Implement logic to delete a course from the backend
        axios.delete(`/api/enroll/${id}`)
            .then(() => setCourses(courses.filter(course => course.id !== id)))
            .catch(error => console.error('Error deleting course:', error));
    };

    return (
        <div>
            <TextField
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>

            <TextField
                label="Course Name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />
            <TextField
                label="Course Code"
                value={newCourse.code}
                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            />
            <Button onClick={handleAddCourse}>Add Course</Button>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses.map(course => (
                        <TableRow key={course.id}>
                            <TableCell>{course.id}</TableCell>
                            <TableCell>{course.name}</TableCell>
                            <TableCell>{course.code}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleUpdateCourse(course.id)}>Update</Button>
                                <Button onClick={() => handleDeleteCourse(course.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default StudentRegistration;
