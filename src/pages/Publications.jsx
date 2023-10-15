import React from 'react'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Publications = () => {
    const [publications, setPublications] = useState([])
    const [showComments, setShowComments] = useState(false)
    const { token, setToken } = useAuth();
    const [commentUserData, setCommentUserData] = useState({});
    const [commentNick, setCommentNick] = useState({})
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [newComment, setNewComment] = useState("")
    
    useEffect(() => {
        const publicationsData = async () => {
          try {
            const response = await axios.get(`http://localhost:5353/publications/all`);
            setPublications(response.data.publications);
          } catch (error) {
            console.error('Error:', error.message);
          }
        };
    
        publicationsData();
      }, [newComment]);
    
    useEffect(() => {
        if (!commentsLoaded) {
            const fetchCommentUserNames = async () => {
                const userNames = {};
                const nickNames = {};
                for (const publication of publications) {
                    for (const comment of publication.comments) {
                        if (!userNames[comment.user] || !nickNames[comment.user]) {
                            try {
                            const response = await axios.get(`http://localhost:5353/users/user/${comment.user}`, {
                                headers: {
                                'Authorization': `Bearer ${token}`
                                }
                            });
                            userNames[comment.user] = response.data.user.email;
                            nickNames[comment.user] = response.data.user.nickName;
                            } catch (error) {
                            console.error('Error:', error.message);
                            userNames[comment.user] = 'unknown user';
                            nickNames[comment.user] = 'unknown nick'
                            }
                        }
                    }
                }
                setCommentUserData(userNames);
                setCommentNick(nickNames)
                setCommentsLoaded(true); // Marcar como cargados para evitar bucle infinito
            };
            if (publications.length > 0 && !commentsLoaded) {
                fetchCommentUserNames();
            }
        }
    }, [publications, token, commentsLoaded]);

    const addComment = async(id) => {
        try {
            const response = await axios.post('http://localhost:5353/publications/comment', {id, text: newComment} ,{
                headers: {
                'Authorization': `Bearer ${token}`
                }
            })
            setNewComment("")
        } catch (error) {
            console.error('Error', error.message);
        }
    }
  return (
    <>
        {publications ? publications.map((item) => {
            return <div key={item._id}>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
                <p>{item.likes.length}</p>
                <p onClick={() => setShowComments(prevShowComments => !prevShowComments)}>Comments: {item.comments.length}</p>
                {showComments && item.comments && item.comments.length > 0 && item.comments.map((comment) => (
                    <div key={comment._id}>
                        <p>{comment.text}</p>
                        <p>{commentNick[comment.user] ? commentNick[comment.user] : commentUserData[comment.user] }</p>
                    </div>
                ))}
                {showComments ?
                <div>
                    <input type="text" placeholder='add comment' value={newComment} onChange={e => setNewComment(e.target.value)}/>
                    <button onClick={() => addComment(item._id)}>Comment</button>
                </div>
                : ""}
            </div>
        }) : ([])}
    </>
  )
}

export default Publications