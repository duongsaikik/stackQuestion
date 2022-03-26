import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { publicFetch } from '../util/fetcher'

import Layout from '../components/layout'
import QuestionWrapper from '../components/question/question-wrapper'
import QuestionStats from '../components/question/question-stats'
import QuestionSummary from '../components/question/question-summary'
import PageTitle from '../components/page-title'
import ButtonGroup from '../components/button-group'
import { Spinner } from '../components/icons'
import Panginations from '../components/pangination'
const HomePage = () => {
  const router = useRouter()

  const [questions, setQuestions] = useState(null)
  const [sortType, setSortType] = useState('Newest')
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    var request = {
      params: {
        requestType: sortType,
        page: router.query.pagee ? router.query.pagee : 1,
        size: 15
      }
    }
    const fetchQuestion = async () => {
      const { data } = await publicFetch.get('/question', request)
      setQuestions(data.data)
      setTotalPage(data.pageNum)
      setCurrentPage(data.currentPage)

    }

    const fetchQuestionByWord = async () => {
      const { data } = await publicFetch.get(`/question/find/${router.query.keyWord}`, request)
      console.log(data)
      setQuestions(data.data)
      setTotalPage(data.pageNum)
      setCurrentPage(data.currentPage)

    }

    const fetchQuestionByTag = async () => {
      const { data } = await publicFetch.get(`/questions/${router.query.tag}`)
      setQuestions(data)
    }

    if (router.query.tag) {
      fetchQuestionByTag()
    } else if (router.query.keyWord) {
      fetchQuestionByWord()
    }
    else {
      fetchQuestion()
    }
  }, [router.query.tag, router.query.keyWord, router.query.pagee, sortType])

  /*   const handleSorting = () => {
      
      switch (sortType) {
        case 'Votes':
          {
            sortQuestionByType(sortType)
          }
          break;
          return (a, b) => b.score - a.score 
        case 'Views':
          return (a, b) => b.views - a.views
        case 'Newest':
          return (a, b) => new Date(b.created) - new Date(a.created)
        case 'Oldest':
          return (a, b) => new Date(a.created) - new Date(b.created)
        default:
          break
      }
    } */


  return (
    <Layout>
      <Head>
        <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet' />
        <title>
          {router.query.tag ? router.query.tag : 'Questions'} - StackQuestions
        </title>
      </Head>

      <PageTitle title={router.query.tag ? `Tag [${router.query.tag}]` : 'Tất cả câu hỏi'} button borderBottom={false} />

      <ButtonGroup
        borderBottom
        buttons={['Newest', 'Views', 'Votes', 'Oldest']}
        selected={sortType}
        setSelected={setSortType}
      />

      {!questions && (
        <div className="loading">
          <Spinner />
        </div>
      )}

      {questions ? questions
        .map(
          ({
            id,
            votes,
            answers,
            views,
            title,
            text,
            tags,
            author,
            created,
            _status,
            check
          }) => (
            <>
              {
                _status === "accept"
                  ? <QuestionWrapper key={id}>

                    <QuestionStats
                      voteCount={votes.length}
                      answerCount={answers.length}
                      answers={answers}
                      view={views}
                      check={check}
                    />
                    <QuestionSummary
                      id={id}
                      title={title}
                      tags={tags}
                      author={author}
                      createdTime={created}
                    >
                      {text}
                    </QuestionSummary>


                  </QuestionWrapper>
                  : ''
              }
            </>

          )
        ) : ''}

      <Panginations currentPage={currentPage} totalPage={totalPage} />

    </Layout>
  )
}

export default HomePage