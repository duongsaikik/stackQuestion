import React from 'react';
import Head from 'next/head'

import QuestionAskEdit from '../../components/question-edit'
import Header from '../../components/layout/header'
import QuestionForm from '../../components/question-edit/question-form'

const Ask = () => {
  return (
    <div>
      <Head>
        <title>Đặt câu hỏi - StackQuestions</title>
      </Head>

      <Header />
      <QuestionAskEdit>
        <QuestionForm />
      </QuestionAskEdit>
    </div>
  )
}

export default Ask
