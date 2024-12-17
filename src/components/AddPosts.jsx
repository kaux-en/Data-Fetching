import React from "react";
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from 'react-query';
import { Container, Form, Button } from 'react-bootstrap';


const addPostToAPI = async (newPost) => {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
        });
        if (!response.ok) {
            throw new Error('Error adding the post');
    } 
        console.log(newPost)
        return response.json();
};
    
function AddPosts() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const queryClient = useQueryClient();
    

    const mutation = useMutation(addPostToAPI, {
        onSuccess: () => {
            queryClient.invalidateQueries('posts');
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        const newPost = {
            title,
            body,
        };

        mutation.mutate(newPost)
        setTitle('');
        setBody('');
    };


    return (
        <div>
       
        <Container>
            <h2>Add a Post</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Add a Title</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter title"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>What's your Post</Form.Label>
                    <Form.Control  
                        type="text" 
                        placeholder="Enter post"
                        value={body} 
                        onChange={(e) => setBody(e.target.value)} />
                </Form.Group>
                <Button type="submit">Add Post</Button>
            </Form>
        </Container>  
        </div>
    )

};

export default AddPosts;

