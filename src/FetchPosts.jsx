import React, { useEffect, useState }  from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";


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

const FetchPosts = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ title: '', body: ''});
    const [buttonPressed, setButtonPressed] = useState(false);

    const { data: posts, isLoading, error } = useQuery('posts', fetchPosts);


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

    const handleSubmit = event => {
        event.preventDefault();
        editPost.mutate({ id: formData.id, updatedPost: formData });
        setButtonPressed(false);
    };

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

    if (isLoading) return <p>Loading posts...</p>;
    if (error) return <p>Error fetching posts: {error.message}</p>;

    return (
        <div>
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
             
             <div>
                { buttonPressed ? (
                <form onSubmit={handleSubmit}>
                    <label><strong>Edit Title</strong></label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})} />
                    <label><strong>Edit Body</strong></label>
                    <input 
                        type="text"
                        name="name"
                        value={formData.body}
                        onChange={e => setFormData({...formData, body: e.target.value})} />
                        <button type="submit">Save Changes</button>
                </form> ) : (
                    ''
                )}
             </div>
        </div>
    )
};

export default FetchPosts;

