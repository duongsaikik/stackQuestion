import React, { useState, useRef, useEffect } from 'react'

/* import cn from 'classnames' */

import styles from './textarea.module.css'

const TextArea = ({

  /*  hasError,
   errorMessage, */
   label,
   value,
   inputInfo,
   errorMessage,
  ...props
}) => {

  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false)
  const { CKEditor, ClassicEditor } = editorRef.current || {}

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, //Added .CKEditor
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    }
    setEditorLoaded(true)

  }, []);



  return (
    <div className={styles.container}>

      {label && <label className={styles.label}>{label}</label>}
      {inputInfo && <p className={styles.inputInfo}>{inputInfo}</p>}
      {editorLoaded ? <> <CKEditor

        editor={ClassicEditor}
        config={{
          placeholder: 'Hãy viết gì đó ...',
          toolbar: ['heading', '|', 'bold', 'italic', 'link','numberedList'],
          uiColor :'#902C17 '
           }
         
        }
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          // console.log("Editor is ready to use!", editor);
          editor.editing.view.change((writer) => {
            writer.setStyle(
              "min-height",
              "200px",
              editor.editing.view.document.getRoot()
            );
          });
        }}
        data={value}
        {...props}
      />
      </>
        : <p>Carregando...</p>
      }
      {/*   {hasError && <p className={styles.errorMessage}>{errorMessage}</p>}    */}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>} 
    </div>
  )
}

export default TextArea
