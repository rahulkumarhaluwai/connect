import React, { useContext, useEffect, useState } from 'react'
import {AuthContext} from '../../context/AuthContext';
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../../context/ChatContext';
const Sidebar = () => {
   const{getUsers,users,selectedUser,setSelectedUser,
    unseenMessages,setUnseenMessages}=useContext(ChatContext);

  const {logout, onlineUsers} =useContext(AuthContext)
  const [input, setInput]=useState(false)
  const navigate = useNavigate();
  const filteredUsers =input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())): users;
  useEffect(()=>{
  getUsers();
  },[onlineUsers])

  return (
    <div className={`bg-white h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
           <img src={assets.logo} alt="logo" className='max-w-40'/>
           <div className="relative py-2 group">
            <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer'/>
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#d9d2ff] border
             border-gray-100 text-gray-100 hidden group-hover:block'>
              <p onClick={()=>navigate('/profile')} className='cursor-pointer text-small text-black'>Edit Profile</p>
              <hr className="my-2 border-t"/>
              <p onClick={()=>logout()} className='cursor-pointer text-small text-black'>Logout</p>
            </div>
           </div>
          </div>
          <div className='bg-[#5e42c7] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
            <img src={assets.search_icon} alt="Search" className='w-3'/>
            <input onChange={(e)=>setInput(e.target.value)} type="text" className='bg-transparent border-none outline-none
             text-white text-xs placeholder-[#ffffff] flex-1' placeholder='Search Connection'/>
          </div>
        </div>
        <div className='flex flex-col'>
          {filteredUsers.map((user,index)=>(
            <div onClick={()=>{setSelectedUser(user),setUnseenMessages(prev=>({
              ...prev,[user._id]:0}))}}
            key={index} className={`relative flex text-black items-center gap-2 p-3 pl-2 rounded cursor-pointer text-m
            ${selectedUser ?._id==user._id && 'bg-violet-200'}`}>
              <img src={user?.profilePic || assets.avatar_icon} alt=""
              className='w-[35px] aspect-[1/1] rounded-full'/>
              <div className='flex flex-col leading-5'>
                <p>{user.fullName}</p>
                {
                  onlineUsers.includes(user._id)
                  ? <span className='text-green-400 text-s'>Online</span>
                  : <span className='text-neutral-400 text-s'>Offline</span>
                }
              </div>
              {unseenMessages[user._id] > 0 && <p className='absolute top-4 right-4 text-sm h-5 w-5
              flex justify-center items-center rounded-full bg-blue-500/50'>{unseenMessages[user._id]}</p>}
            </div>
          ))}
        </div>
    </div>
  )
}

export default Sidebar
