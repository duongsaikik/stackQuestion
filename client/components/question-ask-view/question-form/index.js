import React, { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { FetchContext } from '../../../store/fetch'
import { AuthContext } from '../../../store/auth'
import Button from '../../button'
import Textarea from '../../textarea'
import FormInput from '../../form-input'
/* import TagInput from '../../tag-input' */
import TagInputV2 from '../../tag-input/tagInput'

import styles from './question-form.module.css'


const QuestionForm = () => {
  const router = useRouter()
  const { authAxios } = useContext(FetchContext)
  const { isAuthenticated} = useContext(AuthContext)

  const [loading, setLoading] = useState(false)


  const[contentBo,setContentBo] = useState('');
  const[errMessBo,setErrMessBo] = useState('');
  const[errMessTag,setErrMessTag] = useState('');
  const[tagsSelect,setTagSelect] = useState([])

  
const handleChangeCM = (event, editor)  =>{ 
  const data = editor.getData();  
  setContentBo(data)
}

const selectedTags = (tags) => {
  setTagSelect(tags);
};

  return (
    <Formik
      initialValues={{ title: '', text: '', tags: [] }}
      onSubmit={async (values, { setStatus, resetForm }) => {
        setLoading(true)
     /*    console.log(values) */
        try {
        
          values.tags = tagsSelect;
          values.text = contentBo;
       
        
          if(isAuthenticated()){
            if(contentBo.length > 30 && tagsSelect.length > 0){          
               await authAxios.post('questions',values)
              resetForm({})
              alert("Câu hỏi của bạn đã được ghi nhận và sẽ được đăng tải sau khi được quản trị viên duyệt")
              setErrMessBo("");
              setErrMessTag('')
              router.push('/') 
           
            }else if(contentBo.length < 30){         
              setErrMessBo("Nội dung phải lớn hơn 30 ký tự");
            }else if(tagsSelect.length < 1){
                console.log(errMessTag)
              setErrMessTag("Cần ít nhất 1 tag");
              console.log("tag erro")
            }
          }else{
            router.push("/auth");
          }
         
         
        
         
        } catch (error) {
          setStatus(error.response.data.message)
          
        }
        setLoading(false)
      }}
      validationSchema={Yup.object({
        title: Yup.string()
        .required("Chủ đề còn trống")        
          .max(150, 'Title cannot be longer than 150 characters.')
          .min(15, 'Chủ đề phải lớn hơn 15 ký tự.'),
          text: Yup.string()
          .required("Chủ đề còn trống")        
            .max(500, 'Title cannot be longer than 150 characters.')
            .min(30, 'Chủ đề phải lớn hơn 30 ký tự.'),
  
     
       
      })}
    >
      {({
        values,
        errors,
        touched,
        status,
        handleChange,
     
        handleBlur,
        handleSubmit,
        isSubmitting
      }) => (
        <form onSubmit={handleSubmit}>
          <div className={styles.container}>
            <FormInput
              label="Chủ đề"
              inputInfo="Hãy nêu rõ chủ đề mà bạn muốn hỏi"
              type="text"
              name="title"
              autoComplete="off"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.title && errors.title}
              errorMessage={errors.title && errors.title}
              placeholder="e.g Làm sao để đóng học phí"
            />
            <Textarea           
             autoComplete="off"           
              onChange={(event, editor)  =>{ 
                const data = editor.getData();
                values.text = data;  
                setContentBo(data)
              }}
              value={values.text}                      
              errorMessage={errors.text && errors.text}
              label="Nội dung"
              inputInfo="Bày tỏ một cách rõ ràng về vấn đề chính của bạn"
            />
           {/*  <TagInput
              label="Tags"
              inputInfo="Add up to 5 tags to describe what your question is about"
              type="text"
              name="tags"
              value={values.tags}
              onChange={(e) => {
                console.log(e)
                setFieldValue('tags', e, true)
              }}
              onBlur={handleBlur}
              hasError={touched.tags && errors.tags}
              errorMessage={errors.tags && errors.tags}
            /> */}
            <TagInputV2
              selectedTags={selectedTags}  
              label="Tags"
              inputInfo="Thêm ít nhất một tag để làm rõ câu hỏi của bạn"
              errorMessage={errMessTag}
              />
          </div>
          <div className={styles.buttonContainer}>
            <p className={styles.status}>{status}</p>
            <div>
              <Button
                type="submit"
                primary
                isLoading={loading}
                disabled={isSubmitting}
              >
                Review your question
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  )
}

export default QuestionForm
