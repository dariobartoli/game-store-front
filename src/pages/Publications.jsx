import React from 'react'
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/Publication.module.css'

const Publications = () => {
    const [publications, setPublications] = useState([])
    const [reload, setReload] = useState(false)
    const { token, setToken, userId, apiUrl } = useAuth();
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
            const response = await axios.get(`${apiUrl}publications/all`);
            const publicationsShows = response.data.publications.filter(publication => publication.aprobado === true)
            setPublications(publicationsShows.reverse());
          } catch (error) {
            console.error('Error:', error);
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
                            const response = await axios.get(`${apiUrl}users/user/${comment.user}`, {
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
          const response = await axios.get(`${apiUrl}users/user/${userId}`, {
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
            const response = await axios.post(`${apiUrl}publications/comment`, {id, text: newComment} ,{
                headers: {
                'Authorization': `Bearer ${token}`
                }
            })
            setNewComment("")
            setReload(!reload)
            alert(response.data.message)
        } catch (error) {
            console.error('Error', error);
            alert(error.response.data.message)
        }
    }

    const createPublish = async(e) => {
        try {
            e.preventDefault()
            const response = await axios.post(`${apiUrl}publications`, {images: image, title: title, text: description}, {
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

    //MANEJAR LOS COMENTARIOS DE CADA PUBLICACIÓN
    const [showModal, setShowModal] = useState(new Array(publications.length).fill(false))
    
    const handleModal = (index) => {
        setShowModal(prevShowModal => {
            const newShowModal = [...prevShowModal]; // Crear una copia del estado previo
            newShowModal[index] = !newShowModal[index];
            return newShowModal; // Devolver el nuevo estado actualizado
        });
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
            const response = await axios.post(`${apiUrl}publications/like`, {id},{
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
            const response = await axios.delete(`${apiUrl}publications/${id}`,{
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
            const response = await axios.put(`${apiUrl}publications/comment/remove`, {publicationId, commentId}, {
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
                <label htmlFor="file-upload" className={styles.custom_file_upload}>
                    Seleccionar Archivo
                </label>
                <input type="file" id="file-upload" accept="image/*" onChange={e => setImage(e.target.files[0])}/>
                <button type='submit'>Publish</button>
            </form>
            <div className={styles.publication__box}>
                {publications.length>0 && authorInfo ? publications.map((item, index) => {
                    const author = Object.values(authorInfo).find(userInfo => userInfo._id === item.user);
                    const date = item.createdAt.split('T')
                    const date2 = date[0].split('-')
                    const date3 = date2[1]+ "-"+date2[2]+"-"+ date2[0]
                    const hour = date[1].split('.')
                    const hour2 = hour[0].split(':')
                    const hour3 = hour2[0]+ ':' +hour2[1]
                    const fecha = hour3 + '/' + date3
                    return <div key={item._id} className={styles.publication__card}>
                        <div className={styles.image__container}>
                            <img src={item.images} alt="" className={styles.publication__image}/>
                        </div>
                        <div className={styles.publication__info__contain}>
                            <div className={styles.publication__head}>
                                {author?<NavLink className={styles.author__box} to={item.user == userId ? `/profile` : `/user/${item.user}`}>
                                    <img src={author.profileImage} alt="" className={styles.publication__profile__image}/>
                                    <p>{author.nickName}</p>
                                </NavLink> : ""}
                                <div className={styles.date__container}>
                                    <p className={styles.publication__date}>{hour3}</p>
                                    <p className={styles.publication__date}>{date3}</p>
                                </div>
                            </div>
                            <div className={styles.publication__text__contain}>
                                <div>
                                    <h4>{item.title}</h4>
                                    {item.user == userId? <span className={`material-symbols-outlined ${styles.publication__delete}`} onClick={()=> removePublication(item._id)}>delete</span> : ""}
                                </div>
                                <p>{item.text}</p>
                                <div>
                                    <div>
                                        <span className="material-symbols-outlined" onClick={()=> likePublication(item._id)}>thumb_up</span>
                                        <p>{item.likes.length}</p>
                                    </div>
                                    <button onClick={() => handleModal(index)}>Comments({item.comments.filter((comment) => comment.aprobado).length})</button>
                                </div>
                            </div>
                            {showModal[index]? 
                            <div className={styles.comment__box}>
                                {showModal[index] && item.comments && item.comments.length > 0 && item.comments.map((comment) => (
                                    comment.aprobado?
                                        <div key={comment._id} className={styles.comment__card}>
                                            <div>
                                                <NavLink to={comment.user == userId ? `/profile` : `/user/${comment.user}`}>
                                                    <img src={commentImage[comment.user]} alt="" className={styles.comment__image}/>
                                                    <p>{commentNick[comment.user]}:</p>
                                                </NavLink>
                                            </div>
                                            <p>{comment.text}</p>
                                            {comment.user == userId?<span className={`material-symbols-outlined ${styles.comment__delete}`} onClick={()=> removeComment(item._id, comment._id)}>delete_forever</span> : ""}
                                        </div>
                                    : ""
                                ))}
                            </div>: ""}
                            {item.show?<div className={styles.newcomment__box}>
                                <textarea type="text" placeholder='add comment' value={newComment} onChange={e => setNewComment(e.target.value)}/>
                                <button onClick={() => addComment(item._id)}>Comment</button>
                            </div>: ""}

                        </div>
                        
                    </div>
                }) : (<p>Don't found publications</p>)}
            </div>
        </div>
    </div>
  )
}

export default Publications