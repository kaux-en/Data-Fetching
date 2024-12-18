import React, { useState, useCallback } from "react";
import { useQuery, useQueryClient } from 'react-query';
import { Container, Form, InputGroup, Dropdown, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';


const fetchPosts = async () => {
    
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/?page=1');
    const jsonData = await response.json()
    if (!response.ok) {
        throw new Error('Network response was not ok');
    } else {
        console.log(jsonData);
        return jsonData
    } 
};


function Comments() {
    const queryClient = useQueryClient();
    const { data: posts, error } = useQuery('posts', fetchPosts);

    const [selectedPostId, setSelectedPostId] = useState(null);
    const [comment, setComment] = useState('');

    const { t, i18n } = useTranslation();
    

    const handlePostSelect = (postId) => {
        setSelectedPostId(postId);
    };

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        if (selectedPostId && comment) {
            console.log('Submitted comment:', {postId: selectedPostId, comment});
            setComment('');
        } else {
            alert("Please select a post and enter a comment.");
        }
    }, [])

    if (error) return <p>Error fetching posts: {error.message}</p>;

    return (
        <Container>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-basic" aria-label="comment.dropdownToggle">
          {selectedPostId ? `Selected Post #${selectedPostId}` : 'Select Post Title'}
          </Dropdown.Toggle>

            <Dropdown.Menu>
            {posts?.map(post => (
                    <Dropdown.Item key={post.id} onClick={() => handlePostSelect(post.id)}>
                        {post.title} 
                    </Dropdown.Item>
                    
                ))
            }

            </Dropdown.Menu>
        </Dropdown>

            <Form onSubmit={handleSubmit}>
            <InputGroup>
                <InputGroup.Text>{t('comment.commentLabel')}</InputGroup.Text>
                <Form.Control 
                    as="textarea" 
                    aria-label={t('comment.textarea')}
                    value={comment}
                    onChange={handleCommentChange} />
                <Button type="submit" variant="success" aria-label={t('comment.submitButton')}>{t('comment.submitButton')}</Button>
            </InputGroup>
            </Form>
        </Container>
      );
}
    
export default Comments;
