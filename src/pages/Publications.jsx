import React from 'react'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Publication.module.css'

const Publications = () => {
    const [publications, setPublications] = useState([])
    const [reload, setReload] = useState(false)
    const { token, setToken, userId } = useAuth();
    const [commentNick, setCommentNick] = useState({});
    const [commentImage, setCommentImage] = useState({})
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [newComment, setNewComment] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [authorInfo, setAuthorInfo] = useState(null)
    
    useEffect(() => {
        const publicationsData = async () => {
          try {
            const response = await axios.get(`http://localhost:5353/publications/all`);
            setPublications(response.data.publications.reverse());
          } catch (error) {
            console.error('Error:', error.message);
          }
        };
    
        publicationsData();
      }, [newComment, reload]);
    
    useEffect(() => {
        if (!commentsLoaded) {
            const fetchCommentUserNames = async () => {
                const nickNames = {};
                const profileImages = {}
                for (const publication of publications) {
                    for (const comment of publication.comments) {
                        if (!nickNames[comment.user] || !profileImages[comment.user]) {
                            try {
                            const response = await axios.get(`http://localhost:5353/users/user/${comment.user}`, {
                                headers: {
                                'Authorization': `Bearer ${token}`
                                }
                            });
                            nickNames[comment.user] = response.data.user.nickName;
                            profileImages[comment.user] = response.data.user.profileImage;
                            } catch (error) {
                            console.error('Error:', error.message);
                            nickNames[comment.user] = 'unknown nick';
                            profileImages[comment.user] = 'unknown profile image';
                            }
                        }
                    }
                }
                setCommentNick(nickNames)
                setCommentImage(profileImages)
                setCommentsLoaded(true); // Marcar como cargados para evitar bucle infinito
            };
            if (publications.length > 0 && !commentsLoaded) {
                fetchCommentUserNames();
            }
        }
    }, [publications, token, commentsLoaded]);

    const getUserInfo = async (userId) => {
        try {
          const response = await axios.get(`http://localhost:5353/users/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          return response.data.user;
        } catch (error) {
          console.error('Error:', error.message);
          return null; // Manejar el error apropiadamente
        }
      };

    const addComment = async(id) => {
        try {
            const response = await axios.post('http://localhost:5353/publications/comment', {id, text: newComment} ,{
                headers: {
                'Authorization': `Bearer ${token}`
                }
            })
            setNewComment("")
            setReload(!reload)
        } catch (error) {
            console.error('Error', error);
        }
    }

    const createPublish = async(e) => {
        try {
            e.preventDefault()
            const response = await axios.post('http://localhost:5353/publications', {images: image, title: title, text: description}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            alert(response.data.message);
            setReload(!reload)
        } catch (error) {
            console.error('Error', error);
            alert(error.response.data.message)
        }
    }

    const handleShowComments = async(id) => {
        try {
            const response = await axios.put('http://localhost:5353/publications/show', {id},{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            setReload(!reload)
        } catch (error) {
            console.error('Error', error);
        }
    }

    useEffect(() => {
        // Obtener información del usuario para todas las publicaciones
        publications.forEach((item) => {
          const authorId = item.user;
          if (authorId) {
            getUserInfo(authorId).then(userInfo => {
              setAuthorInfo((prevAuthorInfo) => ({
                ...prevAuthorInfo,
                [authorId]: userInfo,
              }));
            });
          }
        });
      }, [publications, token]);

      const likePublication = async(id) => {
        try {
            const response = await axios.post('http://localhost:5353/publications/like', {id},{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            setReload(!reload)
        } catch (error) {
            console.error('Error', error);
        }
      }

      const removePublication = async(id) => {
        try {
            const response = await axios.delete(`http://localhost:5353/publications/${id}`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            setReload(!reload)
            alert(response.data.message)
        } catch (error) {
            console.error('Error', error);
            alert(error.response.data.message)
        }
      }

      const removeComment = async(publicationId, commentId) => {
        try {
            const response = await axios.put('http://localhost:5353/publications/comment/remove', {publicationId, commentId}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            setReload(!reload)
            alert(response.data.message)
        } catch (error) {
            console.error('Error', error);
            alert(error.response.data.message)
        }
      }




    



  return (
    <div className={styles.publication__container}>
        <div className={styles.main__container}>
            <h2>SHARE YOUR FAVORITES ADVENTURES</h2>
            <form id="publicationForm" encType="multipart/form-data" onSubmit={createPublish} className={styles.publication__form}>
                <input type="text" placeholder='Title' id="title" onChange={e => setTitle(e.target.value)}/>
                <textarea name="" id="description" cols="30" rows="10" onChange={e => setDescription(e.target.value)} className={styles.form__textarea} placeholder='description'></textarea>
                <input type="file" id="fileInput2" accept="image/*" onChange={e => setImage(e.target.files[0])}/>
                <button type='submit'>Publish</button>
            </form>
            <div className={styles.publication__box}>
                {publications.length>0 && authorInfo ? publications.map((item) => {
                    console.log(item);
                    const author = Object.values(authorInfo).find(userInfo => userInfo._id === item.user);
                    return <div key={item._id} className={styles.publication__card}>
                        <div className={styles.image__container}>
                            <img src={item.images} alt="" className={styles.publication__image}/>
                        </div>
                        <div className={styles.publication__info__contain}>
                            {author?<Link className={styles.author__box} to={item.user == userId ? `/profile` : `/user/${item.user}`}>
                                <img src={author.profileImage} alt="" className={styles.publication__profile__image}/>
                                <p>{author.nickName}</p>
                            </Link> : ""}
                            <div className={styles.publication__text__contain}>
                                <h4>{item.title}</h4>
                                <p>{item.text}</p>
                                <div>
                                    <div>
                                        <span className="material-symbols-outlined" onClick={()=> likePublication(item._id)}>thumb_up</span>
                                        <p>{item.likes.length}</p>
                                    </div>
                                    <button onClick={() => handleShowComments(item._id)}>Comments({item.comments.length})</button>
                                </div>
                            </div>
                            {item.show? 
                            <div className={styles.comment__box}>
                                {item.show && item.comments && item.comments.length > 0 && item.comments.map((comment) => (
                                    <div key={comment._id} className={styles.comment__card}>
                                        <Link to={comment.user == userId ? `/profile` : `/user/${comment.user}`}>
                                            <img src={commentImage[comment.user]} alt="" className={styles.comment__image}/>
                                            <p>{commentNick[comment.user]}:</p>
                                        </Link>
                                        <p>{comment.text}</p>
                                        {comment.user == userId?<span className={`material-symbols-outlined ${styles.comment__delete}`} onClick={()=> removeComment(item._id, comment._id)}>delete_forever</span> : ""}
                                    </div>
                                ))}
                            </div>: ""}
                            {item.show?<div className={styles.newcomment__box}>
                                <textarea type="text" placeholder='add comment' value={newComment} onChange={e => setNewComment(e.target.value)}/>
                                <button onClick={() => addComment(item._id)}>Comment</button>
                            </div>: ""}

                        </div>
                        {item.user == userId? <span className={`material-symbols-outlined ${styles.publication__delete}`} onClick={()=> removePublication(item._id)}>delete</span> : ""}
                        
                    </div>
                }) : (<p>hola</p>)}
            </div>
        </div>
    </div>
  )
}

export default Publications