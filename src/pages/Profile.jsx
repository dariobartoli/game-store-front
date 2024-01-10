import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import styles from '../styles/Profile.module.css'
import swal from 'sweetalert';

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [publications, setPublications] = useState([])
  const [requests, setRequests] = useState([])
  const [viewRequest, setViewRequest] = useState(false)
  const [deletedRequests, setDeletedRequests] = useState(JSON.parse(localStorage.getItem('deletedRequests')) || [])
  const { token, cartNumber, apiUrl, profileData, updateDataContext, setUpdateDataContext} = useAuth();
  const [editModal, setEditModal] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nickName, setNickName] = useState("")
  const [password, setPassword] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [userFriends, setUserFriends] = useState([])
  const [showFriend, setShowFriend] = useState(false)
  const [friendList, setFriendList] = useState([])
  const [showPublication, setShowPublication] = useState(false)
  const [backgroundShow, setBackgroundShow] = useState(false)
  const [backgroundSelect, setBackgroundSelect] = useState(null)

  
  useEffect(() => {
    const profileData = async () => {
      try {
        const response = await axios.get(`${apiUrl}users`, {
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
        const response = await axios.get(`${apiUrl}publications`, {
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
    if (profile && profile.friendRequest){
      const filteredRequests = profile.friendRequest.filter(request => !deletedRequests.includes(request));
      const userInfo = async(userId) => {
          try {
              const response = await axios(`${apiUrl}users/user/${userId}`, {
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
          const response = await axios(`${apiUrl}users/user/${userId}`, {
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
      const response = await axios.post(`${apiUrl}users/user/response`, {id:id, response:bool}, {
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
      setViewRequest(!viewRequest)
    } catch (error) {
      console.error('Error', error);
    }
  } 
  

  const updateProfileData = async(e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`${apiUrl}users`, {imagen:image, firstName:firstName, lastName:lastName, password:password, nickName:nickName, description: description}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      })
      setProfile(response.data.user);
      swal({
        title: "Success",
        text: response.data.message,
        icon: "success",
        button: "Close",
      });
      setEditModal(!editModal)
    } catch (error) {
      console.error('Error', error);
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        button: "Close",
      });
    }
  }

  const removeFriend = (id)=> {
    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this friend request",
        icon: "warning",
        buttons: {
          cancel: true,
          confirm: true,
          confirm: "Sure",
        },
        dangerMode: true,
      })
      .then(async (willDelete) => {
        if (willDelete) {
          const response = await axios.delete(`${apiUrl}users/user/remove/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          })
          const updateFriendList = friendList.filter(item => item != id)
          setFriendList(updateFriendList)
          setShowFriend(!showFriend)
          swal({
            title: "Success",
            text: response.data.message,
            icon: "success",
            button: "Close",
          });
        }
      });
    } catch (error) {
      console.error('Error', error);
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        button: "Close",
      });
    }
  }


  const handleBackground = async(e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${apiUrl}background/change`, {name: backgroundSelect}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      setBackgroundShow(false)
      setUpdateDataContext(!updateDataContext)
      swal({
        title: "Success",
        text: response.data.message,
        icon: "success",
        button: "Close",
      });
    } catch (error) {
      console.error('Error', error);
      swal({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        button: "Close",
      });
    }
  }

  return (
    <div className={styles.profile__container}>
      <div className={styles.main__container}>
        <div className={styles.wallpaper} style={profileData ? {backgroundImage: `url(${profileData.background})`} : null}>
          <div className={styles.profile__data}>
            {profile ? (
              <div className={styles.profile__card}>
                <img src={profile.profileImage} className={styles.profile__image}/>
                <div className={styles.text__container}>
                  <p>First name: <span>{profile.firstName}</span></p>
                  <p>Last name: <span>{profile.lastName}</span></p>
                  <p>Email: <span>{profile.email}</span></p>
                  <p>Nick: <span>{profile.nickName}</span></p>
                  <p>Wallet: <span>${profileData? profileData.wallet : null}</span> <span className={styles.add__funds}>ADD FUNDS</span></p>
                  <button onClick={() => setBackgroundShow(!backgroundShow)} className={styles.changeBg}>Change background</button>
                </div>
                <span className={`material-symbols-outlined ${styles.edit__icon}`} onClick={()=> setEditModal(!editModal)}> edit</span>
              </div>
            ) : (<p>Loading...</p>)} {/* Muestra un mensaje de carga mientras se obtiene el perfil */}


            {profile && profile.description? <p className={styles.user__description}>{profile.description}</p> : <p className={styles.user__description}>Don't have description</p>}





            <div className={styles.user__links__container}>
              <div className={styles.user__links__div} onClick={()=> setShowFriend(!showFriend)}>
                <span className="material-symbols-outlined">group</span>
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
          </div>

        </div>


        <div className={`${styles.edit__modal} ${editModal? styles.edit__view__modal: ""}`}>
          <span className={`material-symbols-outlined`} onClick={()=> setEditModal(!editModal)}>close</span>
          <p>Modify where you want changes:</p>
          <form id="imageForm" encType="multipart/form-data" onSubmit={updateProfileData} className={styles.edit__form}>
            <div>
              <input type="text" placeholder='Change first name' onChange={e => setFirstName(e.target.value)}/>
              <input type="text" placeholder='Change last name' onChange={e => setLastName(e.target.value)}/>
            </div>
            <div>
              <input type="password" placeholder='Change password' onChange={e => setPassword(e.target.value)}/>
              <input type="text" placeholder='Change nickname' onChange={e => setNickName(e.target.value)}/>
            </div>
            <textarea name="" id="" cols="30" rows="10" placeholder='Change description' onChange={e => setDescription(e.target.value)}></textarea>
            <label htmlFor="file-upload" className={styles.custom_file_upload}>
              Select file
            </label>
            <input type="file" name="" id="file-upload" accept="image/*" onChange={e => setImage(e.target.files[0])}/>
            <button type='submit'>Update</button>
          </form>
        </div>

        {
          backgroundShow? 
          <div className={styles.background__container}>
            <form className={styles.background__form}>
              <label htmlFor="back1">
                <input type="radio" name="back" id="back1" value={"bg1"} onChange={(e) => setBackgroundSelect(e.target.value)}/>
                <img src="./img/wallpaper.jpg" alt="Imagen 1" />
              </label>
              <label htmlFor="back2">
                <input type="radio" name="back" id="back2" value={"bg2"} onChange={(e) => setBackgroundSelect(e.target.value)}/>
                <img src="./img/wallpaper2.jpg" alt="Imagen 1" />
              </label>
              <label htmlFor="back3">
                <input type="radio" name="back" id="back3" value={"bg3"} onChange={(e) => setBackgroundSelect(e.target.value)}/>
                <img src="./img/wallpaper3.jpg" alt="Imagen 1" />
              </label>
              <label htmlFor="back4">
                <input type="radio" name="back" id="back4" value={"bg4"} onChange={(e) => setBackgroundSelect(e.target.value)}/>
                <img src="./img/wallpaper4.webp" alt="Imagen 1" />
              </label>
              <label htmlFor="back5">
                <input type="radio" name="back" id="back5" value={"bg5"} onChange={(e) => setBackgroundSelect(e.target.value)}/>
                <img src="./img/wallpaper5.webp" alt="Imagen 1" />
              </label>
              <label htmlFor="back6">
                <input type="radio" name="back" id="back6" value={"bg6"} onChange={(e) => setBackgroundSelect(e.target.value)}/>
                <img src="./img/wallpaper6.jpg" alt="Imagen 1" />
              </label>
              <label htmlFor="back7">
                <input type="radio" name="back" id="back7" value={"bg7"} onChange={(e) => setBackgroundSelect(e.target.value)}/>
                <img src="./img/wallpaper7.jpg" alt="Imagen 1" />
              </label>
              <label htmlFor="back8">
                <input type="radio" name="back" id="back8" value={"bg8"} onChange={(e) => setBackgroundSelect(e.target.value)}/>
                <img src="./img/wallpaper8.jpg" alt="Imagen 1" />
              </label>
              <label htmlFor="back9">
                <input type="radio" name="back" id="back9" value={"bg9"} onChange={(e) => setBackgroundSelect(e.target.value)}/>
                <img src="./img/wallpaper9.jpg" alt="Imagen 1" />
              </label>
              <label htmlFor="back10">
                <input type="radio" name="back" id="back10" value={"bg10"} onChange={(e) => setBackgroundSelect(e.target.value)}/>
                <img src="./img/wallpaper10.jpg" alt="Imagen 1" />
              </label>
            </form>
            <button onClick={handleBackground}>Save</button>

          </div>
          : ""
        }


        <div className={styles.links__container}>
          <Link to={'/profile/wishlist'} className={styles.links__wishlist}>Wishlist <span>({profileData? profileData.wishlist.length : null})</span></Link>
          <Link to={'/cart'} className={styles.links__cart}><span className={`material-symbols-outlined ${styles.links__icon}`}>shopping_cart</span><p>{cartNumber}</p></Link>
        </div>
      </div>

    </div>
  )
}

export default Profile