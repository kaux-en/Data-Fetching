import React from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from 'react-query';
import { Container, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


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

    const { t, i18n } = useTranslation();
        const changeLanguage = (lng) => {
            i18n.changeLanguage(lng)
        }
    

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
            <h2>{t('form.addPostHeader')}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>{t('form.addTitleLabel')}</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder={t('form.addTitlePlaceholder')}
                        aria-label={t('form.addTitleLabel')}
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>{t('form.addPostLabel')}</Form.Label>
                    <Form.Control  
                        type="text" 
                        placeholder={t('form.addPostPlaceholder')}
                        aria-label={t('form.addPostLabel')}
                        value={body} 
                        onChange={(e) => setBody(e.target.value)} />
                </Form.Group>
                <Button type="submit" aria-label="form add post button">{t('form.addPostButton')}</Button>
            </Form>
        </Container>  
        </div>
    )

};

export default AddPosts;

