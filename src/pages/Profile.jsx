import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import styles from '../styles/Profile.module.css'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [publications, setPublications] = useState([])
  const [requests, setRequests] = useState([])
  const [viewRequest, setViewRequest] = useState(false)
  const [deletedRequests, setDeletedRequests] = useState(JSON.parse(localStorage.getItem('deletedRequests')) || [])
  const { token, setToken, wishlistNumber, cartNumber } = useAuth();
  const [editModal, setEditModal] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nickName, setNickName] = useState("")
  const [password, setPassword] = useState("")
  const [image, setImage] = useState("")
  const [userFriends, setUserFriends] = useState([])
  const [showFriend, setShowFriend] = useState(false)
  const [friendList, setFriendList] = useState([])
  const [showPublication, setShowPublication] = useState(false)

  useEffect(() => {
    const profileData = async () => {
      try {
        const response = await axios.get("http://localhost:5353/users", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfile(response.data.user);
      } catch (error) {
        console.error('Error:', error.response.data.message);
      }
    };
    profileData();

    const publicationsData = async () => {
      try {
        const response = await axios.get("http://localhost:5353/publications", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPublications(response.data.publications)
      } catch (error) {
        console.error('Error:', error);
      }
    };
    publicationsData();
  }, [token]);

  useEffect(() => {

  }, [])
  
  useEffect(() => {
    if (profile && profile.friendRequest){
      const filteredRequests = profile.friendRequest.filter(request => !deletedRequests.includes(request));
      const userInfo = async(userId) => {
          try {
              const response = await axios(`http://localhost:5353/users/user/${userId}`, {
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              })
              return response.data.user
          } catch (error) {
              console.error('Error', error);
          }
      }
      const promises = filteredRequests.map(item => userInfo(item));
      Promise.all(promises)
          .then(usersData => {
              setRequests(usersData)
          })
          .catch(error => {
              console.error('Error', error);
          })
    }
  }, [profile, nickName, editModal])

  useEffect(() => {
    if(profile && profile.friends){
      if(friendList.length == 0){
        setFriendList(profile.friends)
      }
      const friendsData = async(userId) => {
        try {
          const response = await axios(`http://localhost:5353/users/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data.user
        } catch (error) {
          console.error('Error', error);
        }
      }
      const promises = friendList.map(item => friendsData(item))
      Promise.all(promises)
        .then(usersData => {
            setUserFriends(usersData)
        })
        .catch(error => {
            console.error('Error', error);
        })
    }
  }, [profile, nickName, editModal, showFriend])
  

  const responseRequest = async(id, bool) => {
    try {
      const response = await axios.post('http://localhost:5353/users/user/response', {id:id, response:bool}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const updatedDeletedRequests = [...deletedRequests, id];
      localStorage.setItem('deletedRequests', JSON.stringify(updatedDeletedRequests));
      const updatedRequests = requests.filter(request => request._id !== id);
      setRequests(updatedRequests)
      const updateFriendList = [...friendList, id]
      setFriendList(updateFriendList)
    } catch (error) {
      console.error('Error', error);
    }
  } 
  

  const updateProfileData = async(e) => {
    e.preventDefault()
    try {
      const response = await axios.put('http://localhost:5353/users', {imagen:image, firstName:firstName, lastName:lastName, password:password, nickName:nickName}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      })
      alert(response.data.message)
      setProfile(response.data.user);
      setEditModal(!editModal)
    } catch (error) {
      console.error('Error', error);
      alert(error.response.data.message)
    }
  }

  const removeFriend = async(id)=> {
    try {
      const response = await axios.delete(`http://localhost:5353/users/user/remove/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      })
      alert(response.data.message)
      const updateFriendList = friendList.filter(item => item != id)
      setFriendList(updateFriendList)
      setShowFriend(!showFriend)
    } catch (error) {
      console.error('Error', error);
      alert(error.response.data.message)
    }
  }


  return (
    <div className={styles.profile__container}>
      <div className={styles.main__container}>
        <div className={styles.profile__data}>
          {profile ? (
            <div className={styles.profile__card}>
              <img src={profile.profileImage} className={styles.profile__image}/>
              <div className={styles.text__container}>
                <p>First name: <span>{profile.firstName}</span></p>
                <p>Last name: <span>{profile.lastName}</span></p>
                <p>Email: <span>{profile.email}</span></p>
                <p>Nick: <span>{profile.nickName}</span></p>
                <p>Wallet: <span>${profile.wallet}</span></p>
              </div>
              <span className={`material-symbols-outlined ${styles.edit__icon}`} onClick={()=> setEditModal(!editModal)}> edit</span>
            </div>
          ) : (<p>Loading...</p>)} {/* Muestra un mensaje de carga mientras se obtiene el perfil */}
          <div className={styles.request__div}>
            <button onClick={() => setViewRequest(!viewRequest)} className={styles.request__button}>Friends Requests: <span>{requests.length}</span></button>
            <div className={styles.request__div2}>
              {viewRequest? <div className={styles.request__div3}></div> : ""}
              {viewRequest ? <div className={styles.request__container}>
                {requests.length > 0 ? requests.map(data => ( 
                  <div key={data._id} className={styles.request__card}>
                    <div>
                      <img src={data.profileImage} alt="" className={styles.request__image}/>
                      <p>{data.nickName}</p>
                    </div>
                    <div>
                      <span className={`material-symbols-outlined ${styles.request__accept}`} onClick={() => responseRequest(data._id, true)}>check</span>
                      <span className={`material-symbols-outlined ${styles.request__deny}`} onClick={() => responseRequest(data._id, false)}>cancel</span>
                    </div>
                  </div>
                )): (<p className={styles.request__text}>There is not any friend request</p>)}
              </div> : ""}
            </div>
          </div>

          <div className={styles.user__links__div}>
            <span className="material-symbols-outlined" onClick={()=> setShowFriend(!showFriend)}>group</span>
            <p onClick={()=> setShowFriend(!showFriend)}>Friends</p>
            {showFriend? 
              <div className={styles.friends__box}>
                <span className="material-symbols-outlined" onClick={()=> setShowFriend(!showFriend)}>close</span>
                {userFriends.length>0 ?userFriends.map(item => (
                  <div key={item._id} className={styles.friends__card}>
                    <Link to={`/user/${item._id}`}>
                      <img src={item.profileImage} alt="" />
                      <p>{item.nickName}</p>
                    </Link>
                    <span className="material-symbols-outlined" onClick={() =>  removeFriend(item._id)}>person_remove</span>
                  </div>
                )): (<p>You don't have any friend</p>)}
              </div>
            : ""}
          </div>
          
          <Link to={'/library'} className={styles.user__links__div}>
            <span className="material-symbols-outlined">casino</span>
            <p>Games</p>
          </Link>

          <div className={styles.user__links__div} onClick={()=> setShowPublication(!showPublication)}>
           <span className="material-symbols-outlined">list_alt</span>
           <p>Publications</p>
          </div>


          {showPublication? 
            <div className={styles.publication__box}>
              <span className="material-symbols-outlined" onClick={()=> setShowPublication(!showPublication)}>close</span>
              {publications.length > 0 ? (
                publications.map((publication) => {
                  const date = publication.createdAt.split('T')
                  const date2 = date[0].split('-')
                  const date3 = date2[1]+ "-"+date2[2]+"-"+ date2[0]
                  return <div key={publication._id} className={styles.publication__card}>
                            <div>
                              <p>{publication.title}</p>
                              <p>{date3}</p>
                            </div>
                            <p>{publication.text}</p>
                            <div>
                              <div>
                                <span className="material-symbols-outlined">thumb_up</span>
                                <p>{publication.likes.length}</p>
                              </div>
                              <p>Comments: {publication.comments.length}</p>
                            </div>
                         </div>})
              ) : (<p>You don't have publications</p>)}
            </div>
          : ""}

        
          <div className={styles.links__container}>
            <Link to={'/profile/wishlist'} className={styles.links__wishlist}>Wishlist <span>({wishlistNumber})</span></Link>
            <Link to={'/cart'} className={styles.links__cart}><span className={`material-symbols-outlined ${styles.links__icon}`}>shopping_cart</span><p>{cartNumber}</p></Link>
          </div>
        </div>


        <div className={`${styles.edit__modal} ${editModal? styles.edit__view__modal: ""}`}>
          <span className={`material-symbols-outlined`} onClick={()=> setEditModal(!editModal)}>close</span>
          <p>Modify where you want changes:</p>
          <form id="imageForm" encType="multipart/form-data" onSubmit={updateProfileData} className={styles.edit__form}>
            <input type="text" placeholder='Change first name' onChange={e => setFirstName(e.target.value)}/>
            <input type="text" placeholder='Change last name' onChange={e => setLastName(e.target.value)}/>
            <input type="password" placeholder='Change password' onChange={e => setPassword(e.target.value)}/>
            <input type="text" placeholder='Change nickname' onChange={e => setNickName(e.target.value)}/>
            <input type="file" name="" id="fileInput" accept="image/*" onChange={e => setImage(e.target.files[0])}/>
            <button type='submit'>Update</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile