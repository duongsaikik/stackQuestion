import React from 'react'

import styles from './question-ask-view.module.css'

const QuestionAskEdit = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.topForm}>
          <h1>Chỉnh sửa câu hỏi</h1>
        </div>
        {children}
      </div>
    </div>
  )
}

export default QuestionAskEdit
