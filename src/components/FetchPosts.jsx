import React, { useEffect, useState, useMemo, useCallback }  from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form, ListGroup, Button } from 'react-bootstrap';
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


const PostItem = React.memo(({ post, onEdit, onDelete, t }) => {
    console.log('Rendering PostItem: ', post.id); 
    return (
        <ListGroup.Item key={post.id}>
            <span>{post.title}</span> - {post.body}
            <button onClick={() => onEdit(post)} aria-label="Edit post button">{t('form.editButton')}</button>
            <button onClick={() => onDelete(post.id)} aria-label="Delete post button">{t('form.deleteButton')}</button>
        </ListGroup.Item>
    );
});


const FetchPosts = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ title: '', body: ''});
    const [buttonPressed, setButtonPressed] = useState(false);
    const [query, setQuery] = useState('');

    const { data: posts, isLoading, error } = useQuery('posts', fetchPosts);

    const { t, i18n } = useTranslation();
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
    }
    
    const editPost = useMutation(
        ({ id, updatedPost }) => fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPost)
        }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('posts')
            }
        },
    );

    const handleEditPost = useCallback((post) => {
        setFormData({ id: post.id, title: post.title, body: post.body });
        setButtonPressed(true);
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        editPost.mutate({ id: formData.id, updatedPost: formData });
        setButtonPressed(false);
    }, [formData, editPost]);
    

    const filteredPosts = useMemo(() => {
        return posts?.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()))
    }, [query, posts])


    useEffect(() => {
        if (posts && posts.length > 0) {
          setFormData({
            id: posts[0].id,
            title: posts[0].title,
            body: posts[0].body,
          });
        }
    }, [posts]);

    
    const deletePost = useMutation(
        id => fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: 'DELETE'
        }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('posts')
            }
        }
    );
    
    const handleQueryChange = useCallback((e) => {
        setQuery(e.target.value);
    }, []);


    if (isLoading) return <p>Loading posts...</p>;
    if (error) return <p>Error fetching posts: {error.message}</p>;

    return (
        <div>

            <div>
                
                <Form.Group>
                    <Form.Control 
                        controlId='formSearch'
                        type='text'
                        placeholder={t('form.searchPlaceholder')}
                        aria-label={t('form.searchLabel')}
                        value={query}
                        onChange={handleQueryChange} />
                </Form.Group>
                <br />

                <div>
                <Button onClick={() => changeLanguage('en')} aria-label="Change language to english button">English</Button>
                <Button onClick={() => changeLanguage('es')} aria-label="Change language to espanol button">Espanol</Button>
                </div>
                <br />
                <div>
                { buttonPressed ? (
                <form onSubmit={handleSubmit}>
                    <label><strong>{t('form.editTitleLabel')}</strong></label>
                    <input 
                        type="text"
                        name="name"
                        aria-label={t('form.editTitleLabel')}
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})} />
                    <label><strong>{t('form.editBodyLabel')}</strong></label>
                    <textarea 
                        type="text"
                        name="name"
                        aria-label={t('form.editBodyLabel')}
                        value={formData.body}
                        onChange={e => setFormData({...formData, body: e.target.value})} />
                        <button type="submit" aria-label="form save changes button">{t('form.submitButton')}</button>
                </form> ) : (
                    ''
                )}
             </div>
                <br />
                <ListGroup>
                    {filteredPosts.map(post => (
                        <PostItem 
                            key={post.id}
                            post={post} 
                            onEdit={handleEditPost}
                            onDelete={deletePost.mutate}
                            t={t}
                    />
                    ))}
                </ListGroup>  
                
            </div>
            


            {/* --CODE FOR DISPLAYING, EDITING & DELETING POSTS-- 
                {
                posts && posts.length > 0 ? (
                <ul>
                 {posts.map((post) => ( 
                    <li key={post.id}>
                        {post.title} - {post.body}
                        <button onClick={() => {setFormData({ id: post.id, title: post.title, body: post.body });
                            setButtonPressed(true)}}>Edit</button>
                        <button onClick={() => deletePost.mutate(post.id)}>Delete</button>
                    </li>
                ))}
                </ul>
                ) : (
                    <p>No Posts Available</p>
                )
                }
            */}
             
             
        </div>
    )
};
 
export default FetchPosts;


