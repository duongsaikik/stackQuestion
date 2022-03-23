import React, { useState, useContext} from 'react'
import Link from 'next/link'


import { FetchContext } from '../../store/fetch'
import { AuthContext } from '../../store/auth'
import ModalContext from '../../store/modal'

import TextArea from '../textarea'
import Button from '../button'
import Tag from '../tag'

import styles from './add-answer.module.css'

const AddAnswer = ({ id, tags, setQuestion }) => {
 
  const { authAxios } = useContext(FetchContext)
  const { isAuthenticated } = useContext(AuthContext)
  const { handleComponentVisible } = useContext(ModalContext)


  const [comment, setComment] = useState('');
  const [status,setStatus] = useState('');
 

const handleChangeCM =(event, editor)  =>{ 
    const data = editor.getData()   
    setComment(data) 
}
const handleSubmit = async (e) =>{
  e.preventDefault();
  if(comment.length < 1){
    setStatus("Nội dung không được trống")
  }else{
    const { data } = await authAxios.post(`/answer/${id}`, {text:comment})
    setComment('');
    setQuestion(data)
  }
}
  return (
    
        <form className={styles.container} onSubmit={handleSubmit}>
         
          <h2>Your answer</h2>
           <TextArea                 
             onChange={handleChangeCM}                 
              value={comment}
          /> 
           
          <p className={styles.status}>{status}</p>
          <div className={styles.button}>
            <Button
              type="submit"
              primary
             onClick={() => !isAuthenticated() && handleComponentVisible(true, 'signup')}
            >
              Post Your Answer
            </Button>
          </div>
          <h3>
            Browse other questions tagged &nbsp;
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            or &nbsp;
            <Link href="/questions/ask" as="/questions/ask">
              <a>ask your own question.</a>
            </Link>
          </h3>
        </form>
     
  )
}

export default AddAnswer
