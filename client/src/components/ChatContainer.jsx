import React, { useContext, useEffect, useRef,useState} from 'react'
import assets from '../assets/assets'
import {formatMessageTime} from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast';
const ChatContainer = () => {

  const {messages,selectedUser,setSelectedUser,sendMessage,getMessages}=useContext(ChatContext)
  const {authUser, onlineUsers}=useContext(AuthContext)

 const scrollEnd = useRef()

 const [input,setInput]=useState('');

const handleSendMessage=async(e)=>{
  e.preventDefault();
  if(input.trim()==="")return null;
  await sendMessage({text:input.trim()})
  setInput("")
}

const handleSendImage = async(e)=>{
  const file = e.target.files[0];
  if(!file || !file.type.startsWith("image/")){
    toast.error("select an image file")
    return;
  }
  const reader = new FileReader();
  reader.onloadend = async()=>{
    await sendMessage({image:reader.result})
    e.target.value = ""
  }
  reader.readAsDataURL(file);
}

useEffect(()=>{
if(selectedUser){
  getMessages(selectedUser._id)
}
},[selectedUser])

 useEffect(()=>{
  if(scrollEnd.current && messages){
scrollEnd.current.scrollIntoView({behavior:"smooth"})
  }
 },[messages])
  
  
  return selectedUser?(
    <div className='h-full overflow-scroll relative backdrop-blur-lg border-3'>
      {/*Header*/}
      <div className='sticky top-0 z-10 bg-white backdrop-blur-lg flex items-center gap-2 py-2 px-2 border-2 border-l-black'>
      <img src={selectedUser.profilePic || assets.avatar_icon} className="w-8 rounded-full" />
      <p className='flex-1 text-lg text-black flex items-center gap-2'>{selectedUser.fullName}
        {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
      </p>
      <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
      </div>
      {/*Chat Box*/}
      <div className='flex flex-col h-[calc(100%-12px)] overflow-y-scroll p-1 pb-2'>
        {messages.map((msg,index)=>(
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {msg.image ? (
              <img src={msg.image} className='max-w-[250px] border border-gray-700 rounded-lg overflow-hidden mb-3'/>
            ):(
                <p className={`p-2 max-w-[1000px] md:text-m font-light rounded-lg mb-3 break-all bg-blue-500/30 text-black
                  ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
            )}
            <div className="text-center text-xs">
             <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} className='w-8 h-8 rounded-full' />
            <p className='text-gray-500'> { formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
{/*Bottom Area*/}
<div className='sticky bottom-0 right-0 left-0 flex items-center gap-1'>
<div className='flex-1 flex items-center bg-white border-2 border-l-black'>
  <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key === "Enter" ? handleSendMessage(e): null} type="text" placeholder='Send a Message' 
  className='flex-1 text-m p-2.5 border-none rounded outline-none text-black placeholder-gray-600'/>
  <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg, image/jpg' hidden/>
  <label htmlFor="image">
    <img src={assets.gallery_icon} className="w-8 mr-2 cursor-pointer"/>
  </label>
</div>
<img onClick={handleSendMessage} src={assets.send_button} className="w-9 cursor-pointer" />
</div>
    </div>
  ):(
    <div className='flex flex-col items-center justify-center gap-2 text-black bg-white/10 max-md:hidden'>
      <img src={assets.logo} alt="" className='max-w-40' />
      <p className='text-lg font-medium text-black'>Connect with your Loved Ones</p>
    </div>
  )
}

export default ChatContainer
